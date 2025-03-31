
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CartItem } from '@/services/api/types';

// Cart context interface
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('mediwrap-cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse stored cart data');
        localStorage.removeItem('mediwrap-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mediwrap-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        
        toast({
          title: "Cart updated",
          description: `Increased ${item.name} quantity to ${updatedItems[existingItemIndex].quantity}`,
        });
        
        return updatedItems;
      } else {
        // If item doesn't exist, add it
        toast({
          title: "Item added to cart",
          description: `${item.name} has been added to your cart`,
        });
        
        return [...prevItems, item];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === id);
      
      if (item) {
        if (item.quantity > 1) {
          // If quantity > 1, decrease quantity
          const updatedItems = prevItems.map(cartItem => 
            cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
          );
          
          toast({
            title: "Cart updated",
            description: `Decreased ${item.name} quantity`,
          });
          
          return updatedItems;
        } else {
          // If quantity is 1, remove the item
          toast({
            title: "Item removed",
            description: `${item.name} has been removed from your cart`,
          });
          
          return prevItems.filter(cartItem => cartItem.id !== id);
        }
      }
      
      return prevItems;
    });
  };
  
  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mediwrap-cart');
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  // Calculate total items and subtotal
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default useCart;
