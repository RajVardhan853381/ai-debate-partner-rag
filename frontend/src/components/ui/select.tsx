import React from 'react';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child as React.ReactElement, { value, onValueChange })
      )}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className = '' }) => {
  return <div className={`border rounded px-3 py-2 ${className}`}>{children}</div>;
};

export const SelectContent: React.FC<SelectContentProps> = ({ children, className = '' }) => {
  return <div className={`mt-1 ${className}`}>{children}</div>;
};

export const SelectItem: React.FC<SelectItemProps> = ({ children, value, className = '' }) => {
  return <option value={value} className={className}>{children}</option>;
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className = '' }) => {
  return <span className={className}>{placeholder}</span>;
};