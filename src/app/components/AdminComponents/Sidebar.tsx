import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCar,
  faNewspaper,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

// Define props for Sidebar
interface SidebarProps {
  currentSection: "AddCarsToList" | "CarList";
  setCurrentSection: React.Dispatch<React.SetStateAction<"AddCarsToList" | "CarList">>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setCurrentSection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSidebarHover = (hovered: boolean) => {
    setIsSidebarHovered(hovered);
    if (!hovered) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => handleSidebarHover(true)}
      onMouseLeave={() => handleSidebarHover(false)}
    >
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full bg-slate-800 text-white w-16 hover:w-64 overflow-hidden transition-all duration-300 ease-in-out">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6 border-b border-gray-700">
          <img
            src="/images/blueLogo.png"
            alt="MG Car"
            className="w-12 h-auto transition-all duration-300"
          />
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 px-2 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-5 px-4 py-2 rounded hover:bg-slate-700"
          >
            <FontAwesomeIcon icon={faHome} className="text-xl" />
            <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
              Dashboard
            </span>
          </Link>
          <button
            type="button"
            className="flex items-center gap-5 px-4 py-2 rounded hover:bg-slate-700"
            aria-controls="dropdown-cars"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faCar} className="text-xl" />
            <span
              className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out"
            >
              Car Management
            </span>
            {isDropdownOpen ? (
              <FontAwesomeIcon icon={faChevronUp} className="w-6 h-6" />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} className="w-6 h-6" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul id="dropdown-cars" className="py-2  space-y-2">
              <li>
                <button
                  onClick={() => setCurrentSection("AddCarsToList")}
                  className={`flex items-center w-full p-2 text-base font-normal text-gray-300 transition duration-75 rounded-lg group mb-2 hover:bg-gray-700 pl-14 ${
                    currentSection === "AddCarsToList" ? "bg-gray-700" : ""
                  }`}
                >
                  Add Cars
                </button>
                <button
                  onClick={() => setCurrentSection("CarList")}
                  className={`flex items-center w-full p-2 text-base font-normal text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 pl-14 ${
                    currentSection === "CarList" ? "bg-gray-700" : ""
                  }`}
                >
                  Car List
                </button>
              </li>
            </ul>
          )}

          <Link
            href="/admin/AddNews"
            className="flex items-center gap-5 px-4 py-2 rounded hover:bg-slate-700"
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-xl" />
            <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
              News Management
            </span>
          </Link>
        </nav>

        {/* Footer Section */}
        <div className="py-4 text-center text-gray-400 border-t border-gray-700">
          <p className="text-sm">&copy; 2025 GoCar Express</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
