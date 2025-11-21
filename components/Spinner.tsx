import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-6 h-6 border-2 border-academic-text border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
