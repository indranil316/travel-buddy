import React, { useState } from "react";
import { Modal, Button, Input, Dropdown, Menu, Divider } from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import SignInModal from "./SignInModal";
import UserRegistrationModal from "./UserRegistrationModal";
import VendorSignInModal from "./VendorSignInModal";
import VendorRegistrationModal from "./VendorRegistrationModal";
import "./Navbar.css";

const Navbar = ({validateLogin, isVendorLogin, logoutVendor}) => {
  //user sign In modal
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  //vendor sign in modal
  const [vSignInModalOpen, setVSignInModalOpen] = useState(false);

  //user registration modal
  const [userRegModalOpen, setUserRegModalOpen] = useState(false);

  //vendor registration modal
  const [vRegModalOpen, setVRegModalOpen] = useState(false);

  //location modal
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [location, setLocation] = useState("Current Location");
  //state for temporary location input
  const [tempLocation, setTempLocation] = useState("");

  const handleLocationChange = (e) => {
    setTempLocation(e.target.value);
  };

  const handleLocationConfirm = () => {
    setLocation(tempLocation);
    setLocationModalOpen(false);
  };

  const openLocationModal = () => {
    setTempLocation("");
    setLocationModalOpen(true);
  };

  const menu = (
    <Menu>
      <Menu.Item key="login" onClick={() => setSignInModalOpen(true)}>
        Log In
      </Menu.Item>
      <Menu.Item key="signup" onClick={() => setUserRegModalOpen(true)}>
        Sign Up
      </Menu.Item>
      <Divider />
      <Menu.Item key="vSignup" onClick={() => setVSignInModalOpen(true)}>
        Log In as Vendor
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <div className="location">
        <Button
          type="text"
          icon={<EnvironmentOutlined />}
          onClick={openLocationModal}
        >
          {location}
        </Button>
      </div>
      <h1 className="title">TRAVEL BUDDY</h1>
      {
        !isVendorLogin ? (
          <div className="nav-icons">
            <Button type="text" onClick={() => setVRegModalOpen(true)}>
              Register as Vendor
            </Button>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button type="text" icon={<UserOutlined />} />
            </Dropdown>

            <Button type="text" icon={<MenuOutlined />} />
          </div>
        ) : (
          <div className="nav-icons">
            <Button type="default" onClick={logoutVendor}>
              Logout
            </Button>
          </div>
        )
      }
      {/* User Sign In Modal */}
      <Modal
        centered
        open={signInModalOpen}
        onOk={() => setSignInModalOpen(false)}
        onCancel={() => setSignInModalOpen(false)}
        width={vRegModalOpen ? 500 : 500}
        footer={null}
      >
        <SignInModal
          setSignInModalOpen={setSignInModalOpen}
          setVRegModalOpen={setVRegModalOpen}
        />
      </Modal>

      {/* User Registration Modal */}
      <Modal
        centered
        open={userRegModalOpen}
        onOk={() => setUserRegModalOpen(false)}
        onCancel={() => setUserRegModalOpen(false)}
        width={vRegModalOpen ? 500 : 500}
        footer={null}
      >
        <UserRegistrationModal
          setUserRegModalOpen={setUserRegModalOpen}
          setVRegModalOpen={setVRegModalOpen}
        />
      </Modal>

      {/* Vendor Sign In Modal */}
      <Modal
        centered
        open={vSignInModalOpen}
        onOk={() => setVSignInModalOpen(false)}
        onCancel={() => setVSignInModalOpen(false)}
        width={vRegModalOpen ? 500 : 500}
        footer={null}
      >
        <VendorSignInModal
          setVSignInModalOpen={setVSignInModalOpen}
          setVRegModalOpen={setVRegModalOpen}
          validateLogin = {validateLogin}
        />
      </Modal>

      {/* Vendor  registration Modal */}
      <VendorRegistrationModal
        isVisible={vRegModalOpen}
        onClose={() => setVRegModalOpen(false)}
      />
      <Modal
        centered
        open={locationModalOpen}
        onOk={handleLocationConfirm}
        onCancel={() => setLocationModalOpen(false)}
        width={400}
        footer={
          <Button type="primary" onClick={handleLocationConfirm}>
            Confirm
          </Button>
        }
      >
        <div>
          <h2>Your Current Location</h2>
          <p>Update your current location.</p>
          <Input
            name="location"
            type="text"
            placeholder="Enter city"
            value={tempLocation}
            onChange={handleLocationChange}
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
