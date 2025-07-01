import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import AppointmentManagement from './components/AppointmentManagement';
import CalendarView from './components/CalendarView';
import PatientView from './components/PatientView';
import PatientRecords from './components/PatientRecords';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('dental-center-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('dental-center-user');
      }
    }
  }, [dispatch]);

  if (!state.currentUser) {
    return <Login />;
  }

  const isAdmin = state.currentUser.role === 'Admin';

  return (
    <Layout>
      <Routes>
        {isAdmin ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/appointments" element={<AppointmentManagement />} />
            <Route path="/records" element={<CalendarView />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-appointments" element={<PatientView />} />
            <Route path="/my-records" element={<PatientRecords />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
