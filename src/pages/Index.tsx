
import React from 'react';
import { useApp } from '../contexts/AppContext';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const { state } = useApp();

  if (!state.currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-medical-800">
            Dental Center Management System
          </h1>
          <p className="text-xl text-medical-600">
            Professional dental practice management for modern clinics
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
