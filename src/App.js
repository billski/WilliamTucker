import React, { Suspense, useEffect, useState } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    "url('/assets/hero-bg.jpg')"
  ); // Default for unauthenticated users

  const checkAuth = () => {
    const deviceId = localStorage.getItem("currentDeviceId");
    const token = localStorage.getItem(`token_${deviceId}`);
    return !!token;
  };

  const handleLogout = () => {
    const deviceId = localStorage.getItem("currentDeviceId");
    if (deviceId) {
      localStorage.removeItem(`token_${deviceId}`);
      localStorage.removeItem(`user_${deviceId}`);
      localStorage.removeItem("currentDeviceId");
    }
    setIsAuthenticated(false);
    setBackgroundImage("url('/assets/hero-bg.jpg')"); // Reset to public image
  };

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);

    if (authStatus) {
      const deviceId = localStorage.getItem("currentDeviceId");
      const token = localStorage.getItem(`token_${deviceId}`);
      fetch("/public/hero-bg.jpg", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch background image");
          }
          return response.blob();
        })
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          console.log("Authenticated background image loaded:", imageUrl);
          setBackgroundImage(`url(${imageUrl})`);
        })
        .catch((err) => {
          console.error("Error loading authenticated background image:", err);
          setBackgroundImage("url('/assets/hero-bg.jpg')"); // Fallback to public image
        });
    } else {
      console.log("Using public background image: /assets/hero-bg.jpg");
      const img = new Image();
      img.src = "/assets/hero-bg.jpg";
      img.onload = () => {
        console.log("Public background image loaded successfully");
        setBackgroundImage("url('/assets/hero-bg.jpg')");
      };
      img.onerror = () => {
        console.error(
          "Failed to load public background image, using fallback gradient"
        );
        setBackgroundImage(""); // Fallback to gradient only
      };
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div
        className="min-h-[calc(100dvh)] flex flex-col bg-gradient-landing relative"
        style={{
          backgroundImage: backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
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
                    <meta
                      property="og:title"
                      content="William Tucker | Login"
                    />
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
                  <Login setIsAuthenticated={setIsAuthenticated} />
                </>
              }
            />
            <Route
              path="/main/*"
              element={
                checkAuth() ? (
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
                    <meta
                      property="og:url"
                      content="https://williamtucker.ca"
                    />
                  </Helmet>
                  <PublicLanding />
                </>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

function PublicLanding() {
  const [isOnline, setIsOnline] = useState(true); // Initial status (assume online)

  // Function to test server connectivity using the /api/health endpoint
  const testServerConnectivity = async () => {
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-store", // Avoid caching
      });
      if (response.ok) {
        // Check if status is 200-299
        console.log("Server health check succeeded:", response.status);
        return true;
      } else {
        console.log("Server health check failed with status:", response.status);
        return false;
      }
    } catch (err) {
      console.log("Server health check failed:", err.message);
      return false;
    }
  };

  // Check server status every 30 seconds
  useEffect(() => {
    const updateServerStatus = async () => {
      const serverStatus = await testServerConnectivity();
      setIsOnline(serverStatus);
    };

    // Initial check
    updateServerStatus();

    // Add event listeners for online/offline events as a fallback
    const handleOnline = () => {
      console.log("Online event fired");
      updateServerStatus();
    };
    const handleOffline = () => {
      console.log("Offline event fired");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set up interval to check every 30 seconds
    const interval = setInterval(updateServerStatus, 30000);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Online/Offline Indicator */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <div
          className={`h-6 w-6 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
        <span className="text-xs text-white">
          {isOnline ? "online" : "offline"}
        </span>
      </div>
      <div className="text-center mt-20 sm:mt-24 lg:mt-28">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          William Tucker
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-gray-200">
          Software Developer
        </p>
        <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-md">
          Welcome! This is my professional portfolio showcasing over 10 years of
          experience in system integrations, data reporting, and modernizing
          legacy systems.
        </p>
        <div className="mt-6">
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
      <footer className="bg-gray-800 text-white py-4 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            © 2025 William Tucker. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="https://www.linkedin.com/in/william-tucker-06203044/"
              className="hover:scale-110 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white rounded-none p-1">
                <img
                  src="/assets/linkedin-icon.png"
                  alt="LinkedIn"
                  className="h-6 w-6"
                />
              </div>
            </a>
            <a
              href="https://github.com/billski"
              className="hover:scale-110 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white rounded-full p-1">
                <img
                  src="/assets/github-icon.png"
                  alt="GitHub"
                  className="h-6 w-6"
                />
              </div>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
