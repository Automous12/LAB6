import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

// ─── Reducer ─────────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {

    case "ADD_TO_CART": {
      const existing = state.find((i) => i._id === action.payload._id);
      if (existing)
        return state.map((i) =>
          i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "REMOVE_FROM_CART":
      return state.filter((i) => i._id !== action.payload);

    case "UPDATE_QUANTITY":
      return state.map((i) =>
        i._id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart      = (product)       => dispatch({ type: "ADD_TO_CART",      payload: product });
  const removeFromCart = (id)            => dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const updateQuantity = (id, quantity)  => dispatch({ type: "UPDATE_QUANTITY",  payload: { id, quantity } });
  const clearCart      = ()              => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useCart = () => useContext(CartContext);