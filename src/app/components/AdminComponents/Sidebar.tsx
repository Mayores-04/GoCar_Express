
import React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-64 bg-slate-800 text-white">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <img src="/images/blueLogo.png" alt="MG Car" className="w-24 h-auto" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 px-4 space-y-2">
          <Link 
            href="/admin"
          className="block px-4 py-2 rounded hover:bg-slate-700">
            Dashboard
          </Link>
          <Link 
            href="/admin/AddCars"
          className="block px-4 py-2 rounded hover:bg-slate-700">
            Add Car
          </Link>
          <Link
            href="/admin/AddNews" className="block px-4 py-2 rounded hover:bg-slate-700">
            Add News
          </Link>
          <Link
            href="/admin/AddCars" className="block px-4 py-2 rounded hover:bg-slate-700">
            Settings
          </Link>
      </nav>

      {/* Footer Section */}
      <div className="py-4 text-center text-gray-400 border-t border-gray-700">
        <p className="text-sm">&copy; 2025 GoCar Express</p>
      </div>
    </div>
  );
};

export default Sidebar;
