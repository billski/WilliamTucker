import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deviceId = Date.now().toString();
    try {
      console.log("Request URL:", "/api/login");
      const response = await axios.post("/api/login", {
        username,
        password,
      });
      console.log("Login response:", response.data);
      if (response.data.success) {
        localStorage.setItem(`token_${deviceId}`, response.data.token);
        localStorage.setItem(
          `user_${deviceId}`,
          JSON.stringify(response.data.user)
        );
        localStorage.setItem("currentDeviceId", deviceId);
        setError("");
        window.location.href = "/main";
      }
    } catch (err) {
      console.error("Full error:", err);
      console.error(
        "Error response:",
        err.response?.data || "No response data"
      );
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleTestRequest = async () => {
    try {
      console.log("Testing backend at: /api/test");
      const response = await axios.get("/api/test");
      console.log("Test response:", response.data);
    } catch (err) {
      console.error("Test error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          William Tucker
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please log in to view my portfolio
        </p>
        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-100 rounded-md py-2 px-4">
            {error}
          </p>
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
