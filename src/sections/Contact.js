import React from "react";
import { Helmet } from "react-helmet";

function Contact() {
  return (
    <>
      <Helmet>
        <title>William Tucker | Contact Me</title>
        <meta
          name="description"
          content="Contact William Tucker, a software developer specializing in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta property="og:title" content="William Tucker | Contact Me" />
        <meta
          property="og:description"
          content="Contact William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
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
          content="https://williamtucker.ca/main/contact"
        />
      </Helmet>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Me</h1>
        <p className="text-gray-700 text-center">
          Email:{" "}
          <a href="mailto:william@williamtucker.ca" className="text-blue-600">
            william@williamtucker.ca
          </a>
          <br />
          Phone: 250 619 8900
          <br />
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/william-tucker-06203044/"
            className="text-blue-600"
          >
            linkedin.com/in/william-tucker-06203044
          </a>
        </p>
      </div>
    </>
  );
}

export default Contact;
