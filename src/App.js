import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Helmet } from "react-helmet";
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
          element={isAuthenticated() ? <Main /> : <Navigate to="/login" />}
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
