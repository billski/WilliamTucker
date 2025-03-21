import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-gray-600">Page not found.</p>
      <Link
        to="/main/welcome"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Back to Welcome
      </Link>
    </div>
  );
}

export default NotFound;
