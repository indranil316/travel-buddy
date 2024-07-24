import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, message, Modal } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import axios from "axios";
import "./VendorServices.css";
import { getToken, getVendorId } from "../../utils";

//service types and subtypes
const items = [
  {
    key: "service1",
    label: "Accommodation",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "hotel",
        label: "Hotel",
      },
      {
        key: "villa",
        label: "Villa",
      },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "service2",
    label: "Transport",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "cabService",
        label: "Cab Service",
      },
      {
        key: "carRental",
        label: "Car Rentals",
      },
      {
        key: "bikeRental",
        label: "Bike Rentals",
      },
    ],
  },
];

//table for services
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const VendorServices = () => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(2);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(()=>{
    getServices()
  },[])

  const getServices = async () => {
    try{
      const data = (await (axios.get(`/api/vendor/service?vendorId=${getVendorId()}`, {
        headers: {
          "x-auth-token": getToken(),
        }
      }))).data;
      setDataSource(data);
    }
    catch(err){
      alert('coudnt fetch data');
    }
   
  }

  const handleDelete = async (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAdd = async (values) => {
    const newData = {
      key: count,
      name: values.name,
      stars: values.stars,
      address: values.address,
      vendorId: getVendorId()
    };

    try {

      const token = getToken()
      await axios.post("/api/vendor/service", newData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      setDataSource([...dataSource, newData]);
      setCount(count + 1);
      message.success("Service added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      getServices()
    } catch (err) {
      console.error(err);
      message.error("Failed to add service.");
    }
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Stars",
      dataIndex: "stars",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const onClick = (e) => {
    console.log("click ", e);
  };

  return (
    <div className="services-body">
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />

      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
      <Button
        onClick={showModal}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add new Service
      </Button>
      <Modal
        title="Add New Service"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  handleAdd(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="add_service_form">
          <Form.Item
            name="name"
            label="Service Name"
            rules={[
              {
                required: true,
                message: "Please input the name of the service!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stars"
            label="Stars"
            rules={[
              {
                required: true,
                message: "Please input the stars rating!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input the address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorServices;
