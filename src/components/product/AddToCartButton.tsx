import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddToCartButtonProps {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number | null;
  stock: number;
  selectedOptions?: Record<string, string>;
}

export const AddToCartButton = ({ productId, title, image, price, salePrice, stock, selectedOptions }: AddToCartButtonProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const [localQty, setLocalQty] = useState(1);

  const cartItem = items.find(i => i.productId === productId);
  const isInCart = !!cartItem;
  const quantity = isInCart ? cartItem.quantity : localQty;

  const isOutOfStock = stock <= 0;

  const handleMinus = () => {
    if (isInCart) {
      if (quantity === 1) {
        removeItem(productId);
      } else {
        updateQuantity(productId, quantity - 1);
      }
    } else {
      if (localQty > 1) setLocalQty(localQty - 1);
    }
  };

  const handlePlus = () => {
    if (quantity >= stock) return;
    if (isInCart) {
      updateQuantity(productId, quantity + 1);
    } else {
      setLocalQty(localQty + 1);
    }
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    setAnimating(true);
    addItem({
      productId,
      title,
      image,
      price: salePrice ?? price,
      salePrice,
      quantity: localQty,
      maxStock: stock,
      addedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 90, // 3 months
      selectedOptions
    });
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div className="flex flex-col gap-4">
      {!isOutOfStock && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 w-max order-first sm:order-none">
             Stock Available: <span className="text-foreground font-bold">{stock}</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground-muted">Quantity:</span>
            <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden shadow-sm h-10 w-[120px]">
              <button 
                onClick={handleMinus}
                disabled={!isInCart && localQty <= 1}
                className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-foreground transition-colors disabled:opacity-50"
              >
                {isInCart && quantity === 1 ? <Trash2 size={16} className="text-error" /> : <Minus size={16} />}
              </button>
              <div className="flex-1 h-full flex items-center justify-center text-base font-semibold text-foreground border-x border-border bg-gray-50">
                {quantity}
              </div>
              <button 
                onClick={handlePlus}
                disabled={quantity >= stock}
                className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-foreground transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            {isInCart && <span className="text-sm font-bold text-primary ml-2">Already in Cart</span>}
          </div>
        </div>
      )}

      {isInCart && !isOutOfStock ? (
        <button 
          onClick={() => navigate('/cart')}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all shadow-sm bg-orange-400 text-white hover:bg-orange-500 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Go to Cart
        </button>
      ) : (
        <button 
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-sm ${
            isOutOfStock 
              ? 'bg-gray-400 text-white cursor-not-allowed shadow-inner border border-gray-300' 
              : 'bg-primary text-white hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {animating ? 'Added to Cart!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
};
