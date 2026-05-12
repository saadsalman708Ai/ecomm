import React from 'react';

interface Props {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const ProductThumbnails = ({ images, activeIndex, onSelect }: Props) => {
  if (!images || images.length <= 1) return null;

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
      {images.map((img, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
            activeIndex === idx ? 'border-primary' : 'border-transparent hover:border-border'
          } bg-gray-50`}
        >
          <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </button>
      ))}
    </div>
  );
};
