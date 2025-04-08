import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 border-t border-gray-300 p-4 w-full mt-auto">
      <div className="container mx-auto">
        <p className="text-center text-gray-600 text-xs md:text-sm">
          <strong className="text-red-700">Note:</strong> This application is designed to help children with Juvenile Dermatomyositis (JDM) track their CMAS exercises. 
          All data can be exported for discussion with your healthcare provider.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
