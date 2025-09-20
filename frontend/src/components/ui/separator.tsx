import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({ 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const orientationClass = orientation === 'horizontal' 
    ? 'w-full h-px' 
    : 'h-full w-px';
    
  return (
    <div className={`bg-gray-300 ${orientationClass} ${className}`} />
  );
};