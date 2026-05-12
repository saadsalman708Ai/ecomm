import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl?: string;
  targetUrl?: string;
}

export const HeroSectionView = ({ title, subtitle, buttonText, imageUrl, targetUrl }: Props) => {
  return (
    <div 
      className={`rounded-2xl h-[280px] md:h-[400px] flex items-center px-6 md:px-12 relative overflow-hidden mb-10 shadow-sm border border-border group ${!imageUrl ? 'bg-gradient-to-br from-primary to-[#722ed1] text-white' : 'bg-gray-900 text-white'}`}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      )}
      
      {!imageUrl && (
        <div className="absolute right-[-20px] bottom-[-20px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      )}

      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl md:text-5xl font-extrabold m-0 leading-tight mb-4 drop-shadow-md">{title}</h1>
        {subtitle && <p className="mt-2 text-white/90 text-sm md:text-lg mb-6 leading-relaxed drop-shadow">{subtitle}</p>}
        <Link 
          to={targetUrl || '/search'} 
          className="inline-block bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl active:scale-95"
        >
          {buttonText || 'Shop Now'}
        </Link>
      </div>
    </div>
  );
};
