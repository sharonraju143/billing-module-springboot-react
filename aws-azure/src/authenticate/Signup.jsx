import React, { useState } from "react";
import {
  Box,
  InputLabel,
} from "@mui/material";
import styles from "../styles.module.css";
import InputComponent from "./InputComponent";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import toast from "react-hot-toast";
import { ButtonComponent } from "./ButtonComponent";
import { Link } from "react-router-dom";
import { UserSignUpService } from "../services/Services";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const nav = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const forSignup = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


  const forSubmit = async() => {
    if (form.firstName && form.lastName && form.email && form.password && form.userName) {
      try {
        console.log('Form Data:', form);
        const response = await UserSignUpService(form);
        console.log('Response:', response);
        nav('/')
        toast.success('Sign-up successful');
      } catch (error) {
        console.error('Signup Error:', error);
        toast.error('Username already exists');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div>
      <Box component="main" className={styles.centeredContainersign}>
        <Box component={"div"} className={styles.container}>
          <Box component={"p"} className={styles.login}>
            Sign Up
          </Box>
          <Box component={"p"} className={styles.mintxt}>
            Enter your credential to access your account
          </Box>

          <Box component={"div"} className={styles.space}>
            <InputLabel>ENTER FIRSTNAME</InputLabel>
            <InputComponent
              name="firstName"
              type="string"
              placeholder="Enter First Name"
              value={form.firstName}
              forChange={forSignup}
              icon={null}
              togglePasswordVisibility={null}
            />
          </Box>

          <Box component={"div"} className={styles.space}>
            <InputLabel>ENTER LASTNAME</InputLabel>
            <InputComponent
              name="lastName"
              type="string"
              placeholder="Enter Last Name"
              value={form.lastName}
              forChange={forSignup}
              icon={null}
              togglePasswordVisibility={null}
            />
          </Box>

          <Box component={"div"} className={styles.space}>
            <InputLabel>ENTER USERNAME</InputLabel>
            <InputComponent
              name="userName"
              type="string"
              placeholder="Enter User Name"
              value={form.userName}
              forChange={forSignup}
              icon={null}
              togglePasswordVisibility={null}
            />
          </Box>

          <Box component={"div"} className={styles.space}>
            <InputLabel>ENTER EMAIL</InputLabel>
            <InputComponent
              name="email"
              type="string"
              placeholder="Enter Email"
              value={form.email}
              forChange={forSignup}
              icon={null}
              togglePasswordVisibility={null}
            />
          </Box>

          <Box component={"div"} className={styles.space}>
            <InputLabel>PASSWORD</InputLabel>
            <InputComponent
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={form.password}
              forChange={forSignup}
              icon={showPassword ? <VisibilityOff /> : <Visibility />}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </Box>

          <ButtonComponent variant="contained" fullWidth onClick={forSubmit}>
            Sign Up
          </ButtonComponent>

          <Box component={"p"} className={styles.minchild}>
            Are you already user?{" "}
            <Link to={"/"} className={styles.accounttxt}>
              Log In
            </Link>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Signup;
