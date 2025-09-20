import React from 'react';

interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  rows = 3 
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full border rounded px-3 py-2 ${className}`}
    />
  );
};