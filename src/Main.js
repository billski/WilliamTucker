import React from "react";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h2 className="text-xl font-bold text-gray-900">William Tucker</h2>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/cv"
                  className="border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  CV
                </Link>
                <Link
                  to="/about"
                  className="border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  About Me
                </Link>
                <Link
                  to="/contact"
                  className="border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Contact
                </Link>
                <Link
                  to="/references"
                  className="border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  References
                </Link>
                <Link
                  to="/projects"
                  className="border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Projects
                </Link>
                <Link
                  to="/skills"
                  className="border-b-2 border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Skills
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button
            type="button"
            className="bg-gray-100 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon for hamburger menu (you can use a library or SVG) */}
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
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu (Hidden by default) */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/cv"
              className="border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              CV
            </Link>
            <Link
              to="/about"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              About Me
            </Link>
            <Link
              to="/contact"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Contact
            </Link>
            <Link
              to="/references"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              References
            </Link>
            <Link
              to="/projects"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Projects
            </Link>
            <Link
              to="/skills"
              className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
            >
              Skills
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, William!</h1>
          <p className="mt-2 text-gray-600">
            This is your main dashboard. Navigate using the menu above to explore your CV, about me section, contact details, references, projects, and skills.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Main;