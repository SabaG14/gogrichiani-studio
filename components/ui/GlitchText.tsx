
import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  color?: 'cyan' | 'pink' | 'white';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className = '',
  color = 'cyan'
}) => {
  const colorClass = color === 'cyan' ? 'text-cyan-400' : color === 'pink' ? 'text-fuchsia-500' : 'text-white';
  const shadowClass = color === 'cyan' ? 'neon-text-cyan' : color === 'pink' ? 'neon-text-pink' : '';

  return (
    <Component className={`relative inline-block group ${className} ${colorClass} ${shadowClass}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px]">
        {text}
      </span>
    </Component>
  );
};
