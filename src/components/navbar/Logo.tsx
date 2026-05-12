import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_TEXT, LogoIcon, LOGO_IMAGE_URL, SHOW_LOGO_IMAGE, SHOW_LOGO_ICON, SHOW_LOGO_TEXT } from '../../config/branding';

interface LogoProps {
  onClick?: () => void;
  showImage?: boolean;
  showIcon?: boolean;
  showText?: boolean;
}

export const Logo = ({ 
  onClick, 
  showImage = SHOW_LOGO_IMAGE, 
  showIcon = SHOW_LOGO_ICON, 
  showText = SHOW_LOGO_TEXT 
}: LogoProps) => {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2 text-xl md:text-2xl font-extrabold tracking-tight text-primary hover:opacity-90">
      {showImage && LOGO_IMAGE_URL && (
        <img src={LOGO_IMAGE_URL} alt={LOGO_TEXT} className="h-8 md:h-10 object-contain" />
      )}
      
      {showIcon && (
        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
          <LogoIcon />
        </div>
      )}
      
      {showText && (
        <span>{LOGO_TEXT}</span>
      )}
    </Link>
  );
};
