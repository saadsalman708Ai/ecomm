import React from 'react';
import { Tag, Image, Trash2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { LazyImage } from '../../shared/LazyImage';

interface Props {
  product: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AdminProductCard = ({ product, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 sm:items-center relative group">
      <div className="flex gap-4 items-center flex-1 min-w-0">
        <div className="w-20 h-20 bg-gray-50 rounded-lg border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
           {product.images?.[0] ? (
              <LazyImage src={product.images[0]} alt={product.title} />
           ) : (
              <Image size={24} className="text-gray-300" />
           )}
           {product.salePercent && (
             <div className="absolute top-0 left-0 bg-error text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">{product.salePercent}% OFF</div>
           )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-2 text-wrap break-words">{product.title}</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
             <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{formatPrice(product.salePrice ?? product.price)}</span>
             <span className="text-foreground-muted font-medium whitespace-nowrap">Stock: <span className={product.quantity <= 0 ? 'text-error' : 'text-foreground'}>{product.quantity}</span></span>
             <span className="text-foreground-muted font-medium whitespace-nowrap">inOrder: <span className="text-primary">{product.inOrder || 0}</span></span>
             <span className="text-foreground-muted font-medium whitespace-nowrap">Sold: <span className="text-success">{product.soldCount || 0}</span></span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-end gap-3 border-t border-border pt-4 mt-1 sm:mt-0 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-4">
        <button 
          type="button"
          onClick={() => onDelete(product.id)}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 p-2 sm:p-2 text-error bg-error/10 hover:bg-error hover:text-white sm:bg-transparent sm:text-error sm:hover:bg-error/10 rounded-lg transition-colors border border-error/20 sm:border-none"
          title="Delete Product"
        >
          <Trash2 size={18} />
          <span className="sm:hidden font-bold text-sm">Delete</span>
        </button>
        <div className="hidden sm:block h-6 w-px bg-border"></div>
        <button 
          onClick={() => onEdit(product.id)}
          className="flex-1 sm:flex-none py-2.5 sm:py-2 px-6 text-sm font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
