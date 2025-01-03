"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<string>("HOME");

  useEffect(() => {
    if (pathname === "/" || pathname === "/#Home") {
      setActiveButton("HOME");
    } else if (
      pathname === "/#LocationPage" ||
      pathname.includes("#LocationPage")
    ) {
      setActiveButton("LOCATION");
    } else if (pathname === "/ReservationPage") {
      setActiveButton("RESERVATIONS");
    } else if (pathname === "/CarsPage") {
      setActiveButton("CARS");
    } else if (pathname === "/AboutPage") {
      setActiveButton("ABOUT");
    } else if (pathname === "/ContactPage") {
      setActiveButton("CONTACT");
    } else if (pathname === "/news") {
      setActiveButton("NEWS");
    }
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/#Home" || href === "/") {
      return activeButton === "HOME" ? "text-sky-500" : "text-[#001f3f]";
    }

    if (href === "/#LocationPage" || href.includes("#LocationPage")) {
      return activeButton === "LOCATION" ? "text-sky-500" : "text-[#001f3f]";
    }

    return pathname === href ? "text-sky-500" : "text-[#001f3f]";
  };

  const handleClick = (button: string) => {
    setActiveButton(button);
    
  };

  const handleLocationClick = () => {
    const locationSection = document.getElementById("LocationPage");

    if (locationSection) {
      locationSection.scrollIntoView({ behavior: "smooth" });
      setActiveButton("LOCATION");
    }
  };

  return (
    <header className="h-[82px] px-6 p-1 bg-white fixed w-full z-50 rounded-bl-lg rounded-br-lg shadow-md">
      <div className="flex items-center space-x-4 w-full justify-between text-end">
        <div className="flex space-x-6">
          <div className="">
            <Image
              src="/images/blueLogo.png"
              alt="logo"
              width={80}
              height={80}
              className="rounded-br-[50%] rounded-bl-[50%] p-2"
              priority
            />
          </div>
        </div>

        <nav className="px-4 space-x-8 py-4 sticky top-0 w-full">
          <Link
            href="/ReservationPage"
            className={`font-semibold ${isActive(
              "/ReservationPage"
            )} hover:text-sky-500`}
            onClick={() => handleClick("RESERVATIONS")}
          >
            RESERVATIONS
          </Link>
          <Link
            href="/#Home"
            className={`font-semibold ${isActive("/#Home")} hover:text-sky-500`}
            onClick={() => handleClick("HOME")}
          >
            HOME
          </Link>
          <Link
            href="/CarsPage"
            className={`font-semibold ${isActive(
              "/CarsPage"
            )} hover:text-sky-500`}
            onClick={() => handleClick("CARS")}
          >
            OUR CARS
          </Link>
          <Link
            href="/news"
            className={`font-semibold ${isActive(
              "/news"
            )} hover:text-sky-500`}
            onClick={() => handleClick("NEWS")}
          >
            NEWS
          </Link>
          <Link
            href="/AboutPage"
            className={`font-semibold ${isActive(
              "/AboutPage"
            )} hover:text-sky-500`}
            onClick={() => handleClick("ABOUT")}
          >
            ABOUT US
          </Link>
          <a
            id="locationButton"
            href="/#LocationPage"
            className={`font-semibold ${
              activeButton === "LOCATION" ? "text-sky-500" : "text-[#001f3f]"
            } hover:text-sky-500`}
            onClick={handleLocationClick}
          >
            LOCATION
          </a>
          <Link
            href="/ContactPage"
            className={`font-semibold ${isActive(
              "/ContactPage"
            )} hover:text-sky-500`}
            onClick={() => handleClick("CONTACT")}
          >
            CONTACT US
          </Link>
        </nav>
      </div>
    </header>
  );
}
