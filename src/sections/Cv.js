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
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
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

function Cv() {
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
        <title>William Tucker | Curriculum Vitae</title>
        <meta
          name="description"
          content="View the CV of William Tucker, a software developer with experience in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta property="og:title" content="William Tucker | Curriculum Vitae" />
        <meta
          property="og:description"
          content="View the CV of William Tucker, a software developer with over 10 years of experience in system integrations, data reporting, and modernizing legacy systems."
        />
        <meta
          property="og:image"
          content="https://williamtucker.ca/public/preview-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://williamtucker.ca/main/cv" />
      </Helmet>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Curriculum Vitae
        </h1>

        {/* Experience Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6 flex items-center">
            <FaBriefcase className="mr-2 text-blue-600" /> Experience
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-medium text-gray-900">
                Programmer/Analyst
              </h3>
              <p className="text-gray-600">
                Vancouver Island University | Jul 2016 - Present
              </p>
              <ul className="mt-2 text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Developed integrations and customizations for cloud-based ERP
                  systems using REST web services in C# .NET Entity Framework,
                  improving system interoperability.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Recreated student and financial reports using Crystal Reports,
                  PL/SQL, and T-SQL, enhancing data accessibility for
                  stakeholders.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Troubleshot and resolved bugs in JavaScript, C# .NET, Classic
                  ASP, Oracle, and MSSQL Server, reducing system downtime by
                  30%.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Re-implemented legacy ERP modules using modern JavaScript
                  libraries and RESTful web services, modernizing user
                  interfaces and improving performance.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Designed ETL solutions for cloud ERP data migration using
                  SOAP/REST and Talend, ensuring seamless data transitions
                  during system upgrades.
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-medium text-gray-900">
                Software Analyst
              </h3>
              <p className="text-gray-600">
                Thompson Rivers University | Jan 2013 - Jul 2016
              </p>
              <ul className="mt-2 text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Designed and implemented the T.R.U. Student ID Card system in
                  Java for BC Transit and City of Kamloops, streamlining student
                  access to public services.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Developed an Employee Survey System using Groovy/Grails,
                  integrated with Oracle DB, enabling confidential feedback
                  collection for 500+ employees.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Created reports and ETL jobs from Oracle DB for Finance, HR,
                  Payroll, and Student Services, improving data-driven
                  decision-making.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Delivered a Groovy/Grails presentation at the BCNET Conference
                  in 2015, sharing best practices with 200+ industry
                  professionals.
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-medium text-gray-900">
                Institutional Data Analyst
              </h3>
              <p className="text-gray-600">
                Thompson Rivers University | Sep 2012 - Mar 2013
              </p>
              <ul className="mt-2 text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Generated reports on Oracle data using SQL and PL/SQL,
                  providing actionable insights for institutional planning.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Collaborated with stakeholders to identify reporting needs,
                  ensuring data accuracy and relevance.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Optimized SQL queries to improve report generation speed by
                  20%.
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-medium text-gray-900">
                Institutional Report Coordinator (Co-op)
              </h3>
              <p className="text-gray-600">
                Thompson Rivers University | May 2012 - Dec 2012
              </p>
              <ul className="mt-2 text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Developed solutions using SQL, PL/SQL, and PHP for
                  institutional reporting, automating data collection processes.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Designed and maintained a reporting dashboard for
                  institutional metrics, improving accessibility for
                  non-technical staff.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Documented reporting workflows, creating a knowledge base for
                  future coordinators.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6 flex items-center">
            <FaGraduationCap className="mr-2 text-blue-600" /> Education
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 font-medium">
                Computer Systems: Operations & Management, Computer Science
              </p>
              <p className="text-gray-600">
                Thompson Rivers University | Sep 2010 - Jul 2013
              </p>
              <p className="text-gray-600 mt-2">
                Relevant Coursework: Data Structures, Algorithms, Database
                Systems, Software Engineering. Completed a capstone project on
                optimizing database queries for institutional reporting.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 font-medium">
                Journeyman Marine Technician, Trades
              </p>
              <p className="text-gray-600">
                British Columbia Institute of Technology | 2003 - 2007
              </p>
              <p className="text-gray-600 mt-2">
                Developed technical problem-solving and analytical skills, later
                applied to software development and system troubleshooting.
              </p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6 flex items-center">
            <FaTrophy className="mr-2 text-blue-600" /> Achievements
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 font-medium">
                Presented at BCNET Conference 2015
              </p>
              <p className="text-gray-600">
                Delivered a presentation on Groovy/Grails best practices to 200+
                industry professionals, sharing insights on web application
                development.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 font-medium">
                Streamlined ERP Data Migration
              </p>
              <p className="text-gray-600">
                Led the design and implementation of ETL solutions at Vancouver
                Island University, reducing data migration time by 40% during
                ERP system upgrades.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6 flex items-center">
            Skills
          </h2>
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
        </section>
      </div>
    </>
  );
}

export default Cv;
