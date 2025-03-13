import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Main from "./Main";

function App() {
  const isAuthenticated = () => {
    const deviceId = localStorage.getItem("currentDeviceId");
    return !!localStorage.getItem(`token_${deviceId}`);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/main"
          element={isAuthenticated() ? <Main /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<PublicLanding />} />
      </Routes>
    </Router>
  );
}

function PublicLanding() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">William Tucker</h1>
      <p className="mt-4 text-xl text-gray-600">Software Developer</p>
      <p className="mt-6 text-gray-700 max-w-md text-center">
        Welcome! This is my professional portfolio. Please log in to view my
        full CV and contact details.
      </p>
      <a
        href="/login"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Log In
      </a>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © 2025 William Tucker
      </footer>
    </div>
  );
}

export default App;
