
import React from 'react';

export const Background: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black animate-spin-slow opacity-40" />
  </div>
);
