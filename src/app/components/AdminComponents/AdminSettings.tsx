"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faHome, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export const AdminSettings = () => {
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const toggleSettingModal = () => {
    setIsSettingModalOpen((prev) => !prev);
  };

  const token = process.env.NEXT_PUBLIC_SECRET_KEY;
  return (
    <div className="relative inline-block">
      {/* Settings Button */}
      <button onClick={toggleSettingModal} className="p-2">
        <FontAwesomeIcon icon={faGear} className="text-3xl" />
      </button>

      {/* Dropdown Content */}
      {isSettingModalOpen && (
        <div
          className="absolute top-full mt-2 bg-white w-[200px] shadow-lg rounded border border-gray-300 z-50"
          style={{ left: "-150px" }}
        >
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Settings</h2>
            <Link
              href={"/#Home"}
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-slate-300"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg" />
              <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
                User Side
              </span>
            </Link>
            <Link
                href={`/admin/AdminManagement?token=${token}`}
              className="flex items-center gap-2 px-5 py-2 rounded hover:bg-slate-300"
            >
              <FontAwesomeIcon icon={faPlusSquare} className="text-lg" />
              <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
                Add Admin
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
