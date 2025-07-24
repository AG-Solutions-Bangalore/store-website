import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { AppBottombar } from '../components/Navbar/AppBottombar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
     
      <div className="fixed top-0 left-0 w-full z-50  bg-white">
        <Navbar />
      </div>

   
      <main className="flex-grow  pt-36"> 
        <div className="bg-[#FFFFFF]">
          {children}
        </div>
      </main>

      <Footer />
      <AppBottombar/>
    </div>
   
  );
};

export default MainLayout;
