import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';   
import Footer from './Footer'; 
import ErrorBoundary from './ErrorBoundary';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      <main className="flex-grow container mx-auto">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;