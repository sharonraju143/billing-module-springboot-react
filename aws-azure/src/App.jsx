import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import AzurePage from "./pages/AzurePage";
import Awspage from "./pages/AwsPage";
import GcpPage from "./pages/GcpPage";
import GitPage from "./pages/GitPage";
import Atlassian from "./pages/Atlassian";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import LoginPage from "./authenticate/Login";
import Login from "./authenticate/Login";
import Signup from "./authenticate/Signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" exact element={<Home />}></Route>
            <Route path="/awspage" exact element={<Awspage />}></Route>
            <Route path="/azurepage" exact element={<AzurePage />}></Route>
            <Route path="/gcppage" exact element={<GcpPage />}></Route>
            <Route path="/gitpage" exact element={<GitPage />}></Route>
            <Route path="/atlassian" exact element={<Atlassian />}></Route>
          </Route>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
