import React from 'react';

const SuspenseUI: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D46A]"></div>
    </div>
  );
};

export default SuspenseUI;