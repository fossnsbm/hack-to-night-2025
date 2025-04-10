"use client";
import { useState } from 'react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-screen h-[50px] text-white">
      <div className="h-full px-8 max-w-7xl mx-auto relative flex items-center ">

        <div className="hidden md:flex gap-28 h-full px-8 max-w-7xl mx-auto relative flex items-center">
          <a href="#home" className="text-white opacity-70 hover:opacity-100 transition-opacity relative hover:after:w-full after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300">
            Home
          </a>
          <a href="#about-us" className="text-white opacity-70 hover:opacity-100 transition-opacity relative hover:after:w-full after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300">
            About us
          </a>
          <a href="#contact-us" className="text-white opacity-70 hover:opacity-100 transition-opacity relative hover:after:w-full after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300">
            Contact us
          </a>
        </div>

   
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'X' : '☰'}
        </button>
      </div>

      
      {isOpen && (
        <div className="md:hidden absolute top-[50px] left-0 w-full  Hey, Cortana. Hey, Cortana. Hey, Cortana. The same operators in Pune. Hey, Cortana. Move to the last one, album songs. I. Hello. Hey, Cortana. Hey, Cortana. Hey, Cortana. Hey, Cortana. Hey, Cortana.  bg-opacity-80 text-white">
          <div className="flex flex-col items-center py-4">
            <a
              href="#home"
              className="py-2 px-4 text-white hover:bg-gray-700 w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="#about-us"
              className="py-2 px-4 text-white hover:bg-gray-700 w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              About us
            </a>
            <a
              href="#contact-us"
              className="py-2 px-4 text-white hover:bg-gray-700 w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
