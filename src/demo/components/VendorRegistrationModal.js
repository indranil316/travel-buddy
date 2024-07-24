import React, { useState } from "react";
import {
  Modal,
  Steps,
  Button as AntButton,
  Divider,
  message,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import iconImage from "../assets/travelBuddyIcon.png";
import cardIcon from "../assets/accountIcon.png";
import "./VendorRegistrationModal.css";

const { Step } = Steps;

const cardData = [
  { icon: cardIcon, text: "Accommodation" },
  { icon: cardIcon, text: "Transport" },
  { icon: cardIcon, text: "Recreation" },
  { icon: cardIcon, text: "Adventure" },
  { icon: cardIcon, text: "Food & Beverages" },
];

const serviceSubcategories = {
  Accommodation: [
    { icon: cardIcon, text: "Hotel" },
    { icon: cardIcon, text: "Villa" },
    { icon: cardIcon, text: "Resort" },
    { icon: cardIcon, text: "Homestay" },
    { icon: cardIcon, text: "Airbnb" },
  ],
  Transport: [
    { icon: cardIcon, text: "Car Rental" },
    { icon: cardIcon, text: "Bike Rental" },
    { icon: cardIcon, text: "Local Transport" },
    { icon: cardIcon, text: "Cab Service" },
  ],
  Recreation: [
    { icon: cardIcon, text: "Shikara Ride" },
    { icon: cardIcon, text: "Pony Riding" },
    { icon: cardIcon, text: "Garden Tours" },
    { icon: cardIcon, text: "Orchard Tours" },
    { icon: cardIcon, text: "Bat Factory Tours" },
    { icon: cardIcon, text: "Shawl Factory Tours" },
  ],
  Adventure: [
    { icon: cardIcon, text: "Hiking" },
    { icon: cardIcon, text: "Skiing" },
    { icon: cardIcon, text: "Snowboarding" },
    { icon: cardIcon, text: "Camping" },
    { icon: cardIcon, text: "Trekking" },
  ],
  "Food & Beverages": [
    { icon: cardIcon, text: "Restaurant" },
    { icon: cardIcon, text: "Cafe" },
    { icon: cardIcon, text: "Street Food" },
    { icon: cardIcon, text: "Food Truck" },
    { icon: cardIcon, text: "Fine Dine" },
  ],
};

const ClickableCard = ({ icon, text, onClick, isSelected }) => {
  return (
    <div
      className={`custom-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(text)}
    >
      <img src={icon} alt={text} className="card-icon" />
      <span className="card-text">{text}</span>
    </div>
  );
};

const VendorRegistrationModal = ({ isVisible, onClose }) => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    address: "",
    licenceName: "",
    licenceNumber: "",
    file: null,
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleCardClick = (text) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(text)
        ? prevSelectedServices.filter((service) => service !== text)
        : [...prevSelectedServices, text]
    );
  };

  const handleSubcategoryClick = (service, text) => {
    setSelectedSubcategories((prevSubcategories) => ({
      ...prevSubcategories,
      [service]: prevSubcategories[service]?.includes(text)
        ? prevSubcategories[service].filter((sub) => sub !== text)
        : [...(prevSubcategories[service] || []), text],
    }));
  };

  const validateStep = () => {
    if (current === 0) {
      const { name, email, password, number, address } = formData;
      if (!name || !email || !number || !address || !password) {
        message.error("Please enter all details in Step 1.");
        return false;
      }
    } else if (current === 1) {
      if (selectedServices.length === 0) {
        message.error("Please select at least one service in Step 2.");
        return false;
      }
    } else if (current === 2) {
      const allSelected = selectedServices.every(
        (service) => selectedSubcategories[service]?.length > 0
      );
      if (!allSelected) {
        message.error(
          "Please select subcategories for all selected services in Step 3."
        );
        return false;
      }
    } else if (current === 3) {
      const { licenceName, licenceNumber } = formData;
      if (!licenceName || !licenceNumber) {
        message.error("Please enter all details in Step 4.");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep()) {
      setCurrent(current + 1);
    }
  };

  const prev = () => setCurrent(current - 1);

  const register = async () => {
    if (validateStep()) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("number", formData.number);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("licenceName", formData.licenceName);
      formDataToSend.append("licenceNumber", formData.licenceNumber);
      formDataToSend.append("file", formData.file);

      selectedServices.forEach((service) =>
        formDataToSend.append("selectedServices", service)
      );

      formDataToSend.append(
        "selectedSubcategories",
        JSON.stringify(selectedSubcategories)
      );

      try {
        const response = await axios.post(
          "/api/vendor/register",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Vendor registered successfully!");
        onClose();
      } catch (error) {
        message.error("Registration failed. Please try again.");
        console.error("Registration error:", error);
      }
    }
  };

  const { Dragger } = Upload;
  const props = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      setFormData({
        ...formData,
        file,
      });
      return false; // Prevent upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const steps = [
    {
      title: "Step 1",
      content: (
        <div className="v-register-form-div">
          <h3>Vendor Registration Form - Step 1</h3>
          <p>Personal Details</p>
          <form>
            <div className="input-div">
              <label>Vendor Name / Org Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-div">
              <label>Email ID</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your Email ID"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-div">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-div">
              <label>Contact Number</label>
              <input
                name="number"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-div">
              <label>Address</label>
              <input
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div className="v-register-form-div">
          <h3>Vendor Registration Form - Step 2</h3>
          <p>Select the services you offer:</p>
          <div className="custom-card-grid">
            {cardData.map((card) => (
              <ClickableCard
                key={card.text}
                icon={card.icon}
                text={card.text}
                onClick={handleCardClick}
                isSelected={selectedServices.includes(card.text)}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div className="v-register-form-div">
          <h3>Vendor Registration Form - Step 3</h3>
          <p>Select subcategories for each service:</p>
          {selectedServices.map((service) => (
            <div key={service}>
              <h4>{service}</h4>
              <div className="custom-card-grid">
                {serviceSubcategories[service]?.map((sub) => (
                  <ClickableCard
                    key={sub.text}
                    icon={sub.icon}
                    text={sub.text}
                    onClick={() => handleSubcategoryClick(service, sub.text)}
                    isSelected={selectedSubcategories[service]?.includes(
                      sub.text
                    )}
                  />
                ))}
              </div>
              <Divider />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Step 4",
      content: (
        <div className="v-register-form-div">
          <h3>Vendor Registration Form - Step 4</h3>
          <p>Upload Documents:</p>
          <form>
            <div className="input-div">
              <label>Business Licence Name</label>
              <input
                name="licenceName"
                type="text"
                placeholder="Enter your business licence name"
                value={formData.licenceName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-div">
              <label>Business Licence Number</label>
              <input
                name="licenceNumber"
                type="text"
                placeholder="Enter your business licence number"
                value={formData.licenceNumber}
                onChange={handleChange}
                required
              />
            </div>
          </form>
          <div className="upload-div">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single upload. Strictly prohibit from uploading
                company data or other band files
              </p>
            </Dragger>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <span>
          <img
            src={iconImage}
            alt="Icon"
            style={{ width: "30px", height: "30px", marginRight: "10px" }}
          />
          Vendor Registration
        </span>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="custom-modal"
    >
      <div className="steps-container">
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current > 0 && (
            <AntButton style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </AntButton>
          )}
          {current < steps.length - 1 && (
            <AntButton type="primary" onClick={() => next()}>
              Next
            </AntButton>
          )}
          {current === steps.length - 1 && (
            <AntButton type="primary" onClick={register}>
              Register
            </AntButton>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VendorRegistrationModal;
