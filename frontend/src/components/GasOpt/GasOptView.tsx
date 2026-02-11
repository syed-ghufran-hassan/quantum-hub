import React from 'react';

interface Props {
  className?: string;
}

export const GasOptView = ({ className }: Props) => {
  return (
    <div className={`p-4 border rounded ${className}`}>
      <h2 className="text-xl font-bold mb-2">Gas Optimization</h2>
      <div className="text-gray-500">Feature Active</div>
    </div>
  );
};
