import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CheckIn from './pages/CheckIn';
import ManagerLogin from './pages/ManagerLogin';
import ManagerDashboard from './pages/ManagerDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/CheckIn" element={<CheckIn />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route 
          path="/manager/dashboard" 
          element={
            <PrivateRoute>
              <ManagerDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;