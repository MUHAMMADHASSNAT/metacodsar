import React from 'react';
import logoImage from '../assets/logo.jpg';

interface MetaCodSarLogoProps {
  className?: string;
  size?: number;
}

const MetaCodSarLogo: React.FC<MetaCodSarLogoProps> = ({ className = "", size = 64 }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImage} 
        alt="MetaCodSar Logo" 
        className="w-full h-full object-contain"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default MetaCodSarLogo;