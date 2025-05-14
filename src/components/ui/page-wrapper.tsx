import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-secondary/10 p-6 ${className}`}>
      {children}
    </div>
  );
}
