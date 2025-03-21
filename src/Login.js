import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(true); // Track server status

  // Function to check server status
  const checkServerStatus = async () => {
    try {
      await axios.head("/api/login", { timeout: 5000 });
      setIsServerOnline(true);
    } catch (err) {
      setIsServerOnline(false);
    }
  };

  // Check server status on mount and every 10 seconds
  useEffect(() => {
    checkServerStatus(); // Initial check
    const interval = setInterval(checkServerStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");
    const deviceId = Date.now().toString();
    try {
      const response = await axios.post("/api/login", { username, password });
      if (response.data.success) {
        localStorage.setItem(`token_${deviceId}`, response.data.token);
        localStorage.setItem(
          `user_${deviceId}`,
          JSON.stringify(response.data.user)
        );
        localStorage.setItem("currentDeviceId", deviceId);
        setError("");
        setIsAuthenticated(true); // Update authentication state
        window.location.href = "/main";
      }
    } catch (err) {
      if (!navigator.onLine) {
        setError(
          "You are currently offline. Please check your internet connection."
        );
      } else if (
        !err.response ||
        [502, 503, 504].includes(err.response?.status)
      ) {
        setError("Server is offline.");
      } else {
        const errorMsg =
          err.response?.data?.error || "Login failed. Please try again.";
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative z-10">
          <div className="absolute top-4 right-4 flex items-center">
            <span
              className={`w-4 h-4 rounded-full ${
                isServerOnline ? "bg-green-500" : "bg-red-500"
              } mr-2`}
            ></span>
            <span className="text-sm text-gray-600">
              {isServerOnline ? "Online" : "Offline"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            William Tucker
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Please log in to view my portfolio
          </p>
          {error && (
            <div className="text-center">
              <p className="text-red-500 mb-4 text-center bg-red-100 rounded-md py-2 px-4 flex items-center justify-center">
                {(error.includes("Server is offline") ||
                  error.includes("You are currently offline")) && (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                    />
                  </svg>
                )}
                {error}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition disabled:bg-blue-400"
              aria-label="Log in to portfolio"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
      {/* Footer as a Banner */}
      <footer className="bg-gray-800 text-white py-4 w-full relative z-10">
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

export default Login;
