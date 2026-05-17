import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const { isAuthenticated, user } = useAuth();

  // Sync cart with backend when user logs in
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (isAuthenticated && cart.length > 0) {
        try {
          // Get current backend cart
          const backendCart = await cartService.getCart();
          
          // Merge local cart with backend cart
          const mergedCart = [...backendCart];
          
          for (const localItem of cart) {
            const existingItem = mergedCart.find(item => item.productId === localItem.id);
            if (existingItem) {
              // Update quantity
              await cartService.addItem(localItem.id, localItem.quantity);
            } else {
              // Add new item
              await cartService.addItem(localItem.id, localItem.quantity);
            }
          }
          
          // Fetch updated cart from backend
          const updatedCart = await cartService.getCart();
          setCart(updatedCart.map(item => ({
            id: item.productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
            nameFr: item.product?.nameFr || '',
            nameEn: item.product?.nameEn || '',
            nameAr: item.product?.nameAr || '',
            imageUrl: item.product?.imageUrl || '',
          })));
          
          // Clear local cart after sync
          localStorage.removeItem('cart');
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    syncCartWithBackend();
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Only save to localStorage if not authenticated (authenticated users use backend)
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (product) => {
    if (isAuthenticated) {
      try {
        await cartService.addItem(product.id, 1);
        // Refresh cart from backend
        const backendCart = await cartService.getCart();
        const existingItem = backendCart.find(item => item.productId === product.id);
        
        if (existingItem) {
          setCart(backendCart.map(item => ({
            id: item.productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
            nameFr: item.product?.nameFr || '',
            nameEn: item.product?.nameEn || '',
            nameAr: item.product?.nameAr || '',
            imageUrl: item.product?.imageUrl || '',
          })));
        } else {
          setCart(prev => [...prev, { ...product, quantity: 1 }]);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local cart
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id === product.id);
          if (existingItem) {
            return prevCart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prevCart, { ...product, quantity: 1 }];
        });
      }
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartService.removeItem(productId);
        setCart(prev => prev.filter(item => item.id !== productId));
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (isAuthenticated) {
      try {
        await cartService.updateItemQuantity(productId, quantity);
        setCart(prev => prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        ));
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
