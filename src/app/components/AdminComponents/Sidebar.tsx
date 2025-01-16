import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCar, faNewspaper, faChevronUp, faChevronDown, faBook, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = () => {
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

  const token = process.env.NEXT_PUBLIC_SECRET_KEY;
  return (
    <div
      className="relative z-50"
      onMouseEnter={() => handleSidebarHover(true)}
      onMouseLeave={() => handleSidebarHover(false)}
    >
      <div className="fixed top-0 left-0 h-full bg-slate-800 text-white w-16 hover:w-64 overflow-hidden transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-center py-6 border-b border-gray-700">
          <img
            src="/images/blueLogo.png"
            alt="MG Car"
            className="w-12 h-auto transition-all duration-300"
          />
        </div>

        <nav className="mt-4 px-2 space-y-2">
          <Link
            href={`/admin?token=${token}`}
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
            <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
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
            <ul id="dropdown-cars" className="py-2 space-y-2">
              <li>
                <Link
                  href={`/admin/AddCars?token=${token}`}
                  className="flex items-center w-full p-2 text-base font-normal text-gray-300 transition duration-75 rounded-lg group mb-2 hover:bg-gray-700 pl-14"
                >
                  Add Cars
                </Link>
                <Link
                  href={`/admin/CarsList?token=${token}`}
                  className="flex items-center w-full p-2 text-base font-normal text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 pl-14"
                >
                  Car List
                </Link>
              </li>
            </ul>
          )}

          <Link
            href={`/admin/AddNews?token=${token}`}
            className="flex items-center gap-5 px-4 py-2 rounded hover:bg-slate-700"
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-xl" />
            <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
              News Management
            </span>
          </Link>
          <Link
            href={`/admin/Reservations?token=${token}`}
            className="flex items-center gap-5 px-4 py-2 ml-1 rounded hover:bg-slate-700"
          >
            <FontAwesomeIcon icon={faClipboardList} className="text-xl" />
            <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
              Reservations
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
