import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Profile");

  useEffect(() => {
    const storedActiveItem = localStorage.getItem("activeItem");
    if (storedActiveItem) setActiveItem(storedActiveItem);
  }, []);

  const handleSetActive = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeItem", item);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } bg-white h-screen p-5 pt-8 transition-all duration-300 border-r border-gray-300 shadow-lg relative`}
      >
        {/* Toggle Button */}
        <button
          className="absolute -right-4 top-10 bg-gray-700 text-white p-2 rounded-full focus:outline-none shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <span>&lt;</span> : <span>&gt;</span>}
        </button>

        {/* Sidebar Items */}
        <ul className="mt-10">
          <SidebarItem
            icon="fa-solid fa-user"
            text="Profile"
            isOpen={isOpen}
            activeItem={activeItem}
            setActiveItem={handleSetActive}
            link="/complete-profile"
          />
          <SidebarItem
            icon="fa-solid fa-gauge"
            text="Dashboard"
            isOpen={isOpen}
            activeItem={activeItem}
            setActiveItem={handleSetActive}
            link="/dashboard"
          />
          <SidebarItem
            icon="fa-solid fa-phone"
            text="Support"
            isOpen={isOpen}
            activeItem={activeItem}
            setActiveItem={handleSetActive}
            link="/support"
          />
          <SidebarItem
            icon="fa-solid fa-gear"
            text="Settings"
            isOpen={isOpen}
            activeItem={activeItem}
            setActiveItem={handleSetActive}
            link="/settings"
          />
        </ul>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, isOpen, activeItem, setActiveItem, link }) => {
  const isActive = activeItem === text;

  return (
    <li
      className={`flex items-center gap-4 p-3 my-2 rounded-lg transition-all cursor-pointer ${
        isActive ? "bg-[#23242A] text-white" : "text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setActiveItem(text)}
    >
      <Link to={link} className="flex items-center gap-4 w-full">
        <i className={`${icon} text-lg`}></i>
        {isOpen && <span className="text-sm">{text}</span>}
      </Link>
    </li>
  );
};

export default Sidebar;
