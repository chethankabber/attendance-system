import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard',  },
    { id: 'addUser', label: "Employee's",  },
    { id: 'history', label: 'History',  }
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
    closeSidebar();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden backdrop-blur-sm "
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
  className={`fixed left-0 top-16 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0 transition-transform duration-300 ease-in-out
  z-40 w-64 bg-dark border-r border-darker shadow-2xl
  h-[calc(100vh-4rem)]`}
>

        <div className="p-6">
          {/* Close button for mobile */}
          <div className="flex justify-between items-center mb-8 md:hidden">
            
            <button
              onClick={closeSidebar}
              className="text-gray-300 hover:text-primary transition p-2 rounded-lg hover:bg-darker"
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                    : 'text-gray-300 hover:bg-darker hover:text-primary'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;