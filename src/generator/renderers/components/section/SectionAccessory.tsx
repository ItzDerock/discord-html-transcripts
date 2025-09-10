import React from 'react';

interface SectionAccessoryProps {
  children?: React.ReactNode;
}

function SectionAccessory({ children }: SectionAccessoryProps) {
  if (!children) return null;

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        maxWidth: '500px',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

export default SectionAccessory;
