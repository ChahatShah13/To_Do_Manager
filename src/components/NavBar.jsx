import React from "react";

const NavBar = () => {
  return (
    <div>
  <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg rounded-lg">
    <div className="logo">
      <span className="font-extrabold text-2xl tracking-wide">TaskMaster</span>
    </div>
    <ul className="flex gap-6">
      <li className="cursor-pointer hover:font-bold hover:underline underline-offset-4 transition-all duration-200 ease-in-out">
        Home
      </li>
      <li className="cursor-pointer hover:font-bold hover:underline underline-offset-4 transition-all duration-200 ease-in-out">
        Your Tasks
      </li>
    </ul>
  </nav>
</div>

  );
};

export default NavBar;
