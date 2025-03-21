import React from "react";
import { Helmet } from "react-helmet";

function About() {
  return (
    <>
      <Helmet>
        <title>William Tucker | About Me</title>
        <meta
          name="description"
          content="Learn more about William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta property="og:title" content="William Tucker | About Me" />
        <meta
          property="og:description"
          content="Learn more about William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta
          property="og:image"
          content="https://williamtucker.ca/public/preview-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://williamtucker.ca/main/about" />
      </Helmet>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center">About Me</h1>
        <div className="flex flex-col items-center sm:flex-row sm:items-start max-w-2xl mx-auto gap-6">
          <img
            src="/assets/headshot.png"
            alt="William Tucker Headshot"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-md"
          />
          <div className="text-gray-700 text-center sm:text-left">
            <p>
              Hey there! I’m William, a software developer who’s been coding up
              a storm for over 10 years. I love tackling tricky problems and
              turning old, clunky systems into sleek, modern solutions. My sweet
              spot? Building integrations, digging into data reporting, and
              making sure everything runs smoothly for users.
            </p>
            <p className="mt-4">
              When I’m not glued to my screen, you’ll probably find me hiking
              through the beautiful trails around Kelowna or geeking out over
              the latest tech trends. Let’s just say I’m always up for a
              challenge—whether it’s debugging a stubborn bug or conquering a
              steep mountain!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
