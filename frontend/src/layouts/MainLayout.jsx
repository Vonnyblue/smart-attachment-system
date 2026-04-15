import React from 'react';
import Header from '../components/layout/Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
