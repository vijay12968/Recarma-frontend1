import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import OwnerDashboard from './pages/OwnerDashboard';
import CreateVehicle from './pages/owner/CreateVehicle';
import VehicleDetails from './pages/owner/VehicleDetails';
import SchedulePickup from './pages/owner/SchedulePickup';
import UploadDocs from './pages/owner/UploadDocs';
import DealerDashboard from './pages/DealerDashboard';
import DealerVehicleDetails from './pages/dealer/DealerVehicleDetails';
import ChatBot from './components/ChatBot';
import { Role } from './types';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles?: Role[] }>) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') as Role;
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === Role.OWNER) return <Navigate to="/owner" replace />;
    if (role === Role.DEALER) return <Navigate to="/dealer" replace />;
    if (role === Role.ADMIN) return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* Owner Routes */}
          <Route path="/owner" element={
              <ProtectedRoute allowedRoles={[Role.OWNER]}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/owner/create-vehicle" element={
              <ProtectedRoute allowedRoles={[Role.OWNER]}>
                <CreateVehicle />
              </ProtectedRoute>
            } 
          />
           <Route path="/owner/vehicle/:id" element={
              <ProtectedRoute allowedRoles={[Role.OWNER]}>
                <VehicleDetails />
              </ProtectedRoute>
            } 
          />
           <Route path="/owner/schedule-pickup/:id" element={
              <ProtectedRoute allowedRoles={[Role.OWNER]}>
                <SchedulePickup />
              </ProtectedRoute>
            } 
          />
           <Route path="/owner/upload-documents/:id" element={
              <ProtectedRoute allowedRoles={[Role.OWNER]}>
                <UploadDocs />
              </ProtectedRoute>
            } 
          />

          {/* Dealer Routes */}
          <Route path="/dealer" element={
              <ProtectedRoute allowedRoles={[Role.DEALER]}>
                <DealerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/dealer/vehicle/:id" element={
              <ProtectedRoute allowedRoles={[Role.DEALER]}>
                <DealerVehicleDetails />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Route */}
          <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <div className="p-8 text-center">Admin Dashboard (Coming Soon)</div>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-6xl font-bold text-slate-300">404</h1>
                  <p className="text-slate-500 mt-4">Page not found</p>
                  <a href="/" className="mt-4 text-primary-600 hover:underline">Go Home</a>
              </div>
          } />
        </Routes>
        <ChatBot />
      </div>
    </Router>
  );
};

export default App;