import React from "react";
import Landing from "./screens/landing";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./screens/home";

const App = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
