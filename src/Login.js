import React, { useState } from "react";
import axios from "axios";

function Login() {
  console.log("Login component rendered");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  const deviceId = Date.now().toString(); // Simple device identifier (can be improved)
  try {
    console.log("Attempting login with:", { username, password, deviceId });
    const response = await axios.post("http://192.168.1.64:3000/api/login", { username, password });
    console.log("Login response:", response.data);
    if (response.data.success) {
      localStorage.setItem(`token_${deviceId}`, response.data.token);
      localStorage.setItem(`user_${deviceId}`, JSON.stringify(response.data.user));
      setError("");
      window.location.href = "/main";
    }
  } catch (err) {
    console.error("Login error:", err.response?.data?.error || err.message);
    setError(err.response?.data?.error || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;