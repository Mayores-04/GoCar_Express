"use client";

import AddCarsToList from "@/app/components/AdminComponents/AddCarsToList";
import CarList from "@/app/components/AdminComponents/CarList";
import Sidebar from "@/app/components/AdminComponents/Sidebar";
import React, { useState } from "react";

const Page = () => {
  // State to control the current section
  const [currentSection, setCurrentSection] = useState<"AddCarsToList" | "CarList">("AddCarsToList");

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />

      {/* Main Content */}
      <div className=" p-4 flex-grow">
        {currentSection === "AddCarsToList" && (
          <div>
            <AddCarsToList />
          </div>
        )}
        {currentSection === "CarList" && (
          <div>
            <CarList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
