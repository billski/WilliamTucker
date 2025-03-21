import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaFilePdf, FaFileWord, FaFileAlt, FaCopy } from "react-icons/fa";
import Cv from "./Cv";

function Welcome({ userName }) {
  const [downloadedFormat, setDownloadedFormat] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = (format) => {
    setDownloadedFormat(format);
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handleCopyText = async () => {
    try {
      const response = await fetch("/public/CV.txt"); // Updated to /public/CV.txt
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>William Tucker | Welcome</title>
        <meta
          name="description"
          content="Welcome to the portfolio of William Tucker, a software developer specializing in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta property="og:title" content="William Tucker | Welcome" />
        <meta
          property="og:description"
          content="Welcome to the portfolio of William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
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
          content="https://williamtucker.ca/main/welcome"
        />
      </Helmet>
      <div className="px-4 py-12 sm:px-0">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Welcome</h1>
          <p className="mt-2 text-2xl text-gray-600">Hello, {userName}!</p>
          <p className="mt-4 text-xl text-gray-600">
            Software Developer | Problem Solver
          </p>
          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
            Thanks for accessing my portfolio! Navigate the sections above to
            view my CV, projects, and more.
          </p>
        </div>

        {/* Download CV Section */}
        <section className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Download My CV
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            My CV is available in multiple formats to suit your needs. Choose
            the format that works best for you:
          </p>
          {downloadedFormat && (
            <p className="text-green-600 mb-4">
              CV downloaded in {downloadedFormat} format!
            </p>
          )}
          {copied && (
            <p className="text-green-600 mb-4">CV text copied to clipboard!</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* PDF Option */}
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-2">
                <FaFilePdf className="text-red-500 text-3xl mr-2" />
                <h3 className="text-lg font-medium text-gray-900">PDF</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Best for printing and ATS compatibility.
              </p>
              <a
                href="/public/CV.pdf" // Updated to /public/CV.pdf
                download
                onClick={() => handleDownload("PDF")}
                className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
              >
                Download PDF
              </a>
            </div>

            {/* Word Option */}
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-2">
                <FaFileWord className="text-blue-500 text-3xl mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Word</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Editable format for easy modifications.
              </p>
              <a
                href="/public/CV.docx" // Updated to /public/CV.docx
                download
                onClick={() => handleDownload("Word")}
                className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
              >
                Download Word
              </a>
            </div>

            {/* Plain Text Option */}
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-2">
                <FaFileAlt className="text-gray-500 text-3xl mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Text</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Simple format for copying/pasting.
              </p>
              <div className="space-y-2">
                <a
                  href="/public/CV.txt" // Updated to /public/CV.txt
                  download
                  onClick={() => handleDownload("Text")}
                  className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
                >
                  Download Text
                </a>
                <button
                  onClick={handleCopyText}
                  className="block w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition text-center"
                >
                  <FaCopy className="inline mr-2" /> Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CV Preview Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            CV Preview
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto text-center">
            Below is a preview of my CV. You can download the full version in
            your preferred format above.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <Cv />
          </div>
        </section>
      </div>
    </>
  );
}

export default Welcome;
