import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import AddUser from '../components/AddUser';
import History from '../components/History';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'addUser':
        return <AddUser />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-darker">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />

        <div className="flex-1 mt-16 p-4 md:p-8 md:ml-64 overflow-x-hidden">
          {renderContent()}
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;