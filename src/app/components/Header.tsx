"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<string>("HOME");
  const [menuOpen, setMenuOpen] = useState(false);

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
    } else if (pathname === "/#NewsSection") {
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
    setMenuOpen(false);  
  };

  const handleLocationClick = () => {
    const locationSection = document.getElementById("LocationPage");

    if (locationSection) {
      locationSection.scrollIntoView({ behavior: "smooth" });
      setActiveButton("LOCATION");
      setMenuOpen(false);  
    }
  };

  const handleNewsSectionClick = () => {
    const newsSection = document.getElementById("NewsSection");

    if (newsSection) {
      newsSection.scrollIntoView({ behavior: "smooth" });
      setActiveButton("NEWS");
      setMenuOpen(false);  
    }
  };

  return (
    <header className="h-[85px] px-6 py-2 bg-white fixed w-full z-50 rounded-bl-lg rounded-br-lg shadow-md">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="">
          <Image
            src="/images/blueLogo.png"
            alt="logo"
            width={80}
            height={80}
            className="rounded-br-[50%] rounded-bl-[50%]  p-2"
            priority
          />
        </div>

        {/* Hamburger Icon */}  
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖️" : "☰"}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            menuOpen ? "flex flex-col space-y-4 w-screen justify-center items-center " : "hidden"
          } md:flex md:items-center md:space-x-8 w-full md:w-auto bg-white absolute md:static top-[82px] left-0 md:top-0 md:bg-transparent p-6 md:p-0 shadow-md md:shadow-none`}
        >
          <Link
            href="/#Home"
            className={`font-semibold ${isActive("/#Home")} hover:text-sky-500`}
            onClick={() => handleClick("HOME")}
          >
            HOME
          </Link>
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
            href="/CarsPage"
            className={`font-semibold ${isActive(
              "/CarsPage"
            )} hover:text-sky-500`}
            onClick={() => handleClick("CARS")}
          >
            OUR CARS
          </Link>
          <a
            id="newsSectionButton"
            href="/#NewsSection"
            className={`font-semibold ${
              activeButton === "NEWS" ? "text-sky-500" : "text-[#001f3f]"
            } hover:text-sky-500`}
            onClick={handleNewsSectionClick}
            
          >
            NEWS
          </a>
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
