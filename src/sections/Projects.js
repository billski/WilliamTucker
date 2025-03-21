import React from "react";
import { Helmet } from "react-helmet";

function Projects() {
  return (
    <>
      <Helmet>
        <title>William Tucker | Projects</title>
        <meta
          name="description"
          content="Explore the projects of William Tucker, a software developer with expertise in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta property="og:title" content="William Tucker | Projects" />
        <meta
          property="og:description"
          content="Explore the projects of William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
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
          content="https://williamtucker.ca/main/projects"
        />
      </Helmet>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Employee Survey System</h2>
            <p className="text-gray-600">
              A Groovy/Grails web application for anonymous/confidential surveys
              with an admin interface.
            </p>
            <a href="#" className="text-blue-600 hover:underline">
              Live Demo
            </a>{" "}
            |{" "}
            <a href="#" className="text-blue-600 hover:underline">
              GitHub
            </a>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">
              Ministry Data Warehouse ETL
            </h2>
            <p className="text-gray-600">
              An ETL project for transforming Banner data using Oracle PL/SQL,
              controlled by a Groovy/Grails web app.
            </p>
            <a href="#" className="text-blue-600 hover:underline">
              Live Demo
            </a>{" "}
            |{" "}
            <a href="#" className="text-blue-600 hover:underline">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
