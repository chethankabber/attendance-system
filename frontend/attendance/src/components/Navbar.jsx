import React from 'react';
import { useNavigate } from 'react-router-dom';

import {LogOut, Power, } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const manager = JSON.parse(localStorage.getItem('manager') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('manager');
    navigate('/manager/login');
  };

  return (
   <nav className="bg-darker border-b border-dark shadow-xl fixed w-full z-50">
   <div className="w-full px-4 md:px-6 py-4 flex items-center">
    {/* LEFT */}
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-300 hover:text-primary transition p-2 rounded-lg hover:bg-dark"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
        <img src="/logo.png" alt="Logo" className="w-6 h-6" />
      </div>

      <span className="text-xl font-semibold text-white hidden sm:block">
        Attendance System
      </span>
    </div>

    {/* RIGHT */}
    <div className="flex items-center space-x-4 ml-auto">
      <span className="text-sm text-gray-300">
        Welcome, <span className="text-primary font-semibold">{manager.name}</span>
      </span>

      {/* <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-secondary to-primary px-4 py-2 rounded-lg text-white font-medium"
      >
       Logout
      </button> */}
      <button
                className="group text-sky-400 hover:text-red-400 transition-all duration-200 p-2 rounded-lg"
               onClick={handleLogout}
            >
                <div className="flex items-center gap-2">
                    <LogOut
                        size={28}
                        className="group-hover:scale-110 transition-transform"
                    />
                    <span className="group-hover:inline hidden font-medium">
                        Logout
                    </span>
                </div>
            </button>
    </div>

  </div>
</nav>


  );
};

export default Navbar;