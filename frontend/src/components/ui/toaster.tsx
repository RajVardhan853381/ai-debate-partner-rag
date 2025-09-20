'use client';

import * as React from 'react';

// Simple placeholder toaster component
const Toaster = () => {
  return <div id="toast-container" className="fixed top-4 right-4 z-50" />;
};

const toast = {
  success: (message: string) => {
    console.log('Success toast:', message);
  },
  error: (message: string) => {
    console.error('Error toast:', message);
  },
  info: (message: string) => {
    console.info('Info toast:', message);
  },
};

export { Toaster, toast };