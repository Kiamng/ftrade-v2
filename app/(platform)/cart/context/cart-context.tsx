"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "@/types/product";

export interface CartItems extends Product {
  cartQuantity: number;
  creatorName: string;
}

interface CartContextType {
  cartItems: CartItems[];
  addToCart: (product: CartItems) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, cartQuantity: number) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  clearCart: () => void;
  removeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItems[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: CartItems) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.productId
    );

    if (existingItem) {
      updateQuantity(existingItem.productId, existingItem.cartQuantity + 1);
    } else {
      const newItem: CartItems = {
        ...product,
        cartQuantity: 1,
      };
      setCartItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, cartQuantity: number) => {
    if (cartQuantity <= 0) {
      removeItem(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, cartQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeCart = () => {
    localStorage.removeItem("cart");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    let total = subtotal;
    return Math.max(0, total);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        updateQuantity,
        calculateSubtotal,
        calculateTotal,
        clearCart,
        removeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
