import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Helmet } from "react-helmet";
const Login = React.lazy(() => import("./Login"));
const Main = React.lazy(() => import("./Main"));

function App() {
  const isAuthenticated = () => {
    const deviceId = localStorage.getItem("currentDeviceId");
    return !!localStorage.getItem(`token_${deviceId}`);
  };

  const handleLogout = () => {
    const deviceId = localStorage.getItem("currentDeviceId");
    if (deviceId) {
      localStorage.removeItem(`token_${deviceId}`);
      localStorage.removeItem(`user_${deviceId}`);
      localStorage.removeItem("currentDeviceId");
    }
    window.location.href = "/login";
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        }
      >
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Helmet>
                  <title>William Tucker | Login</title>
                  <meta
                    name="description"
                    content="Log in to view the portfolio of William Tucker, a software developer specializing in system integrations, data reporting, and modernizing legacy systems."
                  />
                  <meta property="og:title" content="William Tucker | Login" />
                  <meta
                    property="og:description"
                    content="Log in to view the portfolio of William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
                  />
                  <meta
                    property="og:image"
                    content="https://williamtucker.ca/public/preview-image.png"
                  />
                  <meta property="og:image:width" content="1200" />
                  <meta property="og:image:height" content="630" />
                  <meta property="og:type" content="website" />
                  <meta
                    property="og:url"
                    content="https://williamtucker.ca/login"
                  />
                </Helmet>
                <Login />
              </>
            }
          />
          <Route
            path="/main/*"
            element={
              isAuthenticated() ? (
                <Main handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>William Tucker | Software Developer Portfolio</title>
                  <meta
                    name="description"
                    content="Portfolio of William Tucker, a software developer specializing in system integrations, data reporting, and modernizing legacy systems."
                  />
                  <meta
                    property="og:title"
                    content="William Tucker | Software Developer Portfolio"
                  />
                  <meta
                    property="og:description"
                    content="Explore the portfolio of William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
                  />
                  <meta
                    property="og:image"
                    content="https://williamtucker.ca/public/preview-image.png"
                  />
                  <meta property="og:image:width" content="1200" />
                  <meta property="og:image:height" content="630" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content="https://williamtucker.ca" />
                </Helmet>
                <PublicLanding />
              </>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

function PublicLanding() {
  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-landing relative"
      style={{
        backgroundImage: `url('/public/hero-bg.jpg')`, // Updated path to match server location
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          William Tucker
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-gray-200">
          Software Developer
        </p>
        <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-md text-center">
          Welcome! This is my professional portfolio showcasing over 10 years of
          experience in system integrations, data reporting, and modernizing
          legacy systems.
        </p>
        <div className="mt-6 text-center">
          <p className="text-gray-200 text-sm sm:text-base">
            Featured Skill: React & Node.js
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Log in to see projects and more!
          </p>
        </div>
        <a
          href="/login"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Log In
        </a>
      </div>
      {/* Footer as a Banner */}
      <footer className="bg-gray-800 text-white py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            © 2025 William Tucker. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="https://linkedin.com/in/yourprofile"
              className="text-gray-400 hover:text-white transition text-sm sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/yourprofile"
              className="text-gray-400 hover:text-white transition text-sm sm:text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
