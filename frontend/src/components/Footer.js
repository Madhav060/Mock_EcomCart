import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Vibe Commerce. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          This is a mock e-commerce site built for demonstration purposes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;