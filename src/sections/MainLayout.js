import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function MainLayout({ children, userName, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { path: "/main/welcome", label: "Welcome" },
    { path: "/main/cv", label: "CV" },
    { path: "/main/about", label: "About" },
    { path: "/main/contact", label: "Contact" },
    { path: "/main/projects", label: "Projects" },
    { path: "/main/skills", label: "Skills" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav
        className={`bg-white shadow-md fixed w-full z-20 transition-all duration-300 ${
          isScrolled ? "h-12" : "h-16"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-900">
                William Tucker
              </h2>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm font-medium">
                Welcome, {userName}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label="Log out"
              >
                Logout
              </button>
            </div>
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
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="sm:hidden bg-white shadow-lg overflow-hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMobileMenu}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                      location.pathname === link.path
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      <div className="pt-16 flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
        </div>
      </div>
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

export default MainLayout;
