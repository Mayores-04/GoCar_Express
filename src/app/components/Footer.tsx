"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="h-auto p-6 px-9 flex flex-col md:flex-row items-center justify-between bg-gray-100 shadow-md">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/blueLogo.PNG"
            alt="GoCar Express Logo"
            width={60}
            height={60}
            className="rounded-br-full rounded-bl-full"
          />
          <h1 className="text-xl font-semibold text-[#4169e1]">GoCar Express</h1>
        </div>

        {/* Contact Us Section */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faPhone} className="text-[#4169e1]" />
            <a
              href="tel:+639209075454"
              className="text-gray-600 hover:underline"
              aria-label="Call GoCar Express"
            >
              +63 920 907 5454
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-[#4169e1]" />
            <a
              href="mailto:gocarexpress0608@gmail.com"
              className="text-gray-600 hover:underline"
              aria-label="Email GoCar Express"
            >
              gocarexpress0608@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-4 md:mt-0 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GoCar Express. All rights reserved.
        </div>
      </footer>
    </>
  );
}
