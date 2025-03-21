import React from "react";
import { Helmet } from "react-helmet";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaLock,
  FaJsSquare,
  FaCuttlefish,
  FaJava,
  FaGitAlt,
  FaLinux,
  FaPhp,
  FaHtml5,
  FaCss3Alt,
  FaExchangeAlt,
  FaCode,
} from "react-icons/fa";
import {
  SiReactrouter,
  SiTailwindcss,
  SiAxios,
  SiExpress,
  SiMysql,
  SiJsonwebtokens,
  SiPwa,
  SiCrystal,
  SiHibernate,
  SiTalend,
  SiJavascript,
} from "react-icons/si";
import { TbApi, TbSql } from "react-icons/tb";
import { MdIntegrationInstructions } from "react-icons/md";
import { GrSystem } from "react-icons/gr";

function Skills() {
  const skills = [
    { name: "React", icon: <FaReact /> },
    { name: "React Router", icon: <SiReactrouter /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss /> },
    { name: "Axios", icon: <SiAxios /> },
    { name: "Node.js", icon: <FaNodeJs /> },
    { name: "Express", icon: <SiExpress /> },
    { name: "MySQL", icon: <SiMysql /> },
    { name: "bcryptjs", icon: <FaLock /> },
    { name: "JWT", icon: <SiJsonwebtokens /> },
    { name: "Parcel", icon: <FaJsSquare /> },
    { name: "PWA", icon: <SiPwa /> },
    { name: "pm2", icon: <FaNodeJs /> },
    { name: "Linux", icon: <FaLinux /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "HTML", icon: <FaHtml5 /> },
    { name: "CSS", icon: <FaCss3Alt /> },
    { name: "Oracle PL/SQL", icon: <FaDatabase /> },
    { name: "C#", icon: <FaCuttlefish /> },
    { name: "MSSQL Server", icon: <FaDatabase /> },
    { name: "T-SQL", icon: <TbSql /> },
    { name: "SQL", icon: <TbSql /> },
    { name: "Java", icon: <FaJava /> },
    { name: "Git", icon: <FaGitAlt /> },
    { name: "REST/SOAP", icon: <TbApi /> },
    { name: "Entity Framework", icon: <FaCuttlefish /> },
    { name: "Crystal Reports", icon: <SiCrystal /> },
    { name: "Talend", icon: <SiTalend /> },
    { name: "Groovy/Grails", icon: <FaCode /> },
    { name: "Classic ASP", icon: <FaJsSquare /> },
    { name: "PHP", icon: <FaPhp /> },
    { name: "Hibernate", icon: <SiHibernate /> },
    { name: "ETL Development", icon: <FaExchangeAlt /> },
    { name: "System Integration", icon: <MdIntegrationInstructions /> },
    { name: "SQL Tuning", icon: <GrSystem /> },
  ];

  return (
    <>
      <Helmet>
        <title>William Tucker | Skills</title>
        <meta
          name="description"
          content="Discover the skills of William Tucker, a software developer specializing in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta property="og:title" content="William Tucker | Skills" />
        <meta
          property="og:description"
          content="Discover the skills of William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
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
          content="https://williamtucker.ca/main/skills"
        />
      </Helmet>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Skills
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-3"
            >
              <span className="text-blue-600 text-2xl">{skill.icon}</span>
              <span className="text-gray-700 font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Skills;
