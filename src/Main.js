import React, { useState } from "react";

function Main() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deviceId = localStorage.getItem("currentDeviceId");
  const user = deviceId
    ? JSON.parse(localStorage.getItem(`user_${deviceId}`) || "{}")
    : null;
  const userName = user ? user.name || "Guest" : "Guest";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const sections = {
    welcome: (
      <div className="px-4 py-12 sm:px-0 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome, {userName}!
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Software Developer | Problem Solver
        </p>
        <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
          Thanks for accessing my portfolio! Navigate the sections above to view
          my CV, projects, and more.
        </p>
        <a
          href="/William_Tucker_CV.pdf" // Replace with your actual CV file path
          download
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Download My CV
        </a>
      </div>
    ),
    cv: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Curriculum Vitae
        </h1>
        <div className="prose max-w-none">
          <h2>Experience</h2>
          <p>
            <strong>Software Developer</strong> - [Current Company]
            (2020–Present)
          </p>
          <ul>
            <li>Developed web applications using React and Node.js.</li>
            <li>Led a team to implement [specific project].</li>
          </ul>
          <h2>Education</h2>
          <p>
            <strong>B.Sc. Computer Science</strong> - [University Name]
            (2016–2020)
          </p>
          {/* Add more real details */}
        </div>
      </div>
    ),
    about: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">About Me</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          I’m a dedicated software developer with a passion for building
          efficient, user-focused solutions. Outside of work, I enjoy hiking and
          exploring new technologies.
        </p>
      </div>
    ),
    contact: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Me</h1>
        <p className="text-gray-700 text-center">
          Email:{" "}
          <a href="mailto:william@williamtucker.ca" className="text-blue-600">
            william@williamtucker.ca
          </a>
          <br />
          Phone: (123) 456-7890
          <br />
          LinkedIn:{" "}
          <a
            href="https://linkedin.com/in/williamtucker"
            className="text-blue-600"
          >
            linkedin.com/in/williamtucker
          </a>
        </p>
      </div>
    ),
    projects: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Project 1</h2>
            <p className="text-gray-600">
              A web app built with React and Node.js.
            </p>
            <a href="#" className="text-blue-600 hover:underline">
              Live Demo
            </a>{" "}
            |{" "}
            <a href="#" className="text-blue-600 hover:underline">
              GitHub
            </a>
          </div>
          {/* Add more projects */}
        </div>
      </div>
    ),
    skills: (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">Skills</h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <li className="bg-gray-100 p-3 rounded text-center">JavaScript</li>
          <li className="bg-gray-100 p-3 rounded text-center">React</li>
          <li className="bg-gray-100 p-3 rounded text-center">Node.js</li>
          {/* Add more skills */}
        </ul>
      </div>
    ),
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-900">
                William Tucker
              </h2>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {Object.keys(sections).map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`border-b-2 text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      activeSection === section
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent"
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
              <div className="sm:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16m-7 6h7"
                      }
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobile && isMobileMenuOpen && (
            <div className="sm:hidden bg-white shadow-lg">
              <div className="pt-2 pb-3 space-y-1">
                {Object.keys(sections).map((section) => (
                  <button
                    key={section}
                    onClick={() => {
                      setActiveSection(section);
                      toggleMobileMenu();
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                      activeSection === section
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600"
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 William Tucker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Main;
