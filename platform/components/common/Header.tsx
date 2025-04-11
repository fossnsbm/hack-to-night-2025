"use client";

import { useState } from 'react';
import * as motion from "motion/react-client";
import { AnimatePresence } from 'motion/react';

const navItems = {
    "About Us": "#about",
    "Memories": "#memories",
    "FAQ": "#faq",
    "Contact": "#contact"
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={"fixed z-50 top-0 left-0 w-screen h-[50px] text-white transition" + (isOpen ? " bg-black" : "")}>
      <div className="h-full px-8 max-w-7xl mx-auto relative flex items-center">
        <div className="hidden md:flex gap-28 h-full px-8 max-w-7xl mx-auto relative items-end">
          {Object.entries(navItems).map(([name, href]) => (
            <a key={name} href={href} className="text-white opacity-70 hover:opacity-100 transition-opacity relative hover:after:w-full after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300">
              {name}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'X' : '☰'}
        </button>
      </div>


      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="md:hidden absolute top-[50px] left-0 w-full bg-black text-white transition">
                <div className="flex flex-col items-center py-4">
                  {Object.entries(navItems).map(([name, href]) => (
                    <a
                      key={name}
                      href={href}
                      className="py-2 px-4 text-white hover:bg-gray-700 w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
