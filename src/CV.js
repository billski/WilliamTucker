import React from "react";

function CV() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">William Tucker</h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">Web Developer & Designer</p>
              <p className="text-gray-600 mt-1 text-base sm:text-lg">william@williamtucker.ca | (123) 456-7890 | Vancouver, BC</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 sm:text-2xl">Experience</h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 sm:text-xl">Web Developer</h3>
                <p className="text-gray-600 text-base sm:text-lg">Tech Solutions Inc. | Jan 2020 - Present</p>
                <ul className="list-disc list-inside mt-2 text-gray-600 text-base sm:text-lg leading-relaxed">
                  <li>Developed responsive websites using React and Tailwind CSS.</li>
                  <li>Collaborated with designers to implement UI/UX improvements.</li>
                  <li>Optimized database queries for better performance.</li>
                </ul>
              </div>
              {/* Add similar adjustments for other sections */}
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 sm:text-2xl">Education</h2>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">B.Sc. in Computer Science, University of British Columbia | 2014 - 2018</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 sm:text-2xl">Skills</h2>
              <ul className="list-disc list-inside mt-2 text-gray-600 text-base sm:text-lg leading-relaxed">
                <li>React, JavaScript, Node.js</li>
                <li>Tailwind CSS, HTML, CSS</li>
                <li>MySQL, API Development</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CV;