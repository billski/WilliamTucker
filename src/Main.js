import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./sections/MainLayout";
import Welcome from "./sections/Welcome";
import Cv from "./sections/Cv";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import NotFound from "./sections/NotFound";

function Main({ handleLogout }) {
  const deviceId = localStorage.getItem("currentDeviceId");
  const user = deviceId
    ? JSON.parse(localStorage.getItem(`user_${deviceId}`) || "{}")
    : null;
  const userName = user ? user.name || "Guest" : "Guest";

  return (
    <MainLayout userName={userName} handleLogout={handleLogout}>
      <Routes>
        <Route path="welcome" element={<Welcome userName={userName} />} />
        <Route path="cv" element={<Cv />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="projects" element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="/" element={<Navigate to="welcome" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default Main;
