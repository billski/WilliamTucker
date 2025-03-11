import React, { useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobile detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Get user from localStorage using the current device ID
  const deviceId = localStorage.getItem("currentDeviceId");
  const user = deviceId ? JSON.parse(localStorage.getItem(`user_${deviceId}`) || "{}") : null;
  const userName = user ? user.name || "Guest" : "Guest";

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const sections = {
    welcome: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}!</h1>
        <p className="mt-2 text-gray-600">
          This is your main dashboard. Navigate using the menu above to explore your CV, about me section, contact details, references, projects, and skills.
        </p>
      </div>
    ),
    cv: <Link to="/cv" className="text-blue-500 hover:underline">View CV</Link>,
    about: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold mb-6 text-center">About Me</h1>
        <p className="text-gray-700">This is the about me section. Add your personal story here!</p>
      </div>
    ),
    contact: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold mb-6 text-center">Contact</h1>
        <p className="text-gray-700">Email: william@williamtucker.ca | Phone: (123) 456-7890</p>
      </div>
    ),
    references: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold mb-6 text-center">References</h1>
        <p className="text-gray-700">Add your references here!</p>
      </div>
    ),
    projects: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold mb-6 text-center">Projects</h1>
        <p className="text-gray-700">List your projects here!</p>
      </div>
    ),
    skills: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold mb-6 text-center">Skills</h1>
        <p className="text-gray-700">Add your skills here!</p>
      </div>
    ),
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setActiveSection("welcome");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Welcome, {userName}</h2>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {Object.keys(sections).map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      setActiveSection(section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      activeSection === section ? "border-indigo-500 text-gray-900" : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            {isMobile && (
              <div className="sm:hidden">
                <button
                  type="button"
                  className="bg-gray-100 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobile && isMobileMenuOpen && (
            <div className="sm:hidden bg-white shadow-md">
              <div className="pt-2 pb-3 space-y-1">
                {Object.keys(sections).map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      setActiveSection(section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium ${
                      activeSection === section ? "border-indigo-500 bg-indigo-50 text-indigo-700" : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white w-full text-left pl-3 pr-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Content Area */}
      <div className="pt-16 flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {sections[activeSection]}
        </div>
      </div>
    </div>
  );
}

export default Main;