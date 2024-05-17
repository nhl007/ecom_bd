"use client";

import { useToast } from "@/components/ui/use-toast";
import { orders, products } from "@/db/products.schema";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type TCartProduct = Pick<
  typeof products.$inferInsert,
  | "category"
  | "discountPercentage"
  | "image"
  | "discountPrice"
  | "id"
  | "name"
  | "price"
  | "quantity"
  | "stock"
>;

type TInitialCartState = Pick<
  typeof orders.$inferInsert,
  "products" | "shipping" | "total" | "count" | "delivery"
>;

interface ICartContextProps {
  cart: TInitialCartState;
  addToCart: (product: TCartProduct) => void;
  removeFromCart: (id: string, amount: number) => void;
  updateQuantity: (id: string, count: number) => void;
  updateShipping: (name: string, cost: number) => void;
  clearCart: () => void;
  updateShipDetails: (name: string, delivery: number) => void;
}

const CartContext = createContext<ICartContextProps>({
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  updateShipping: () => {},
  clearCart: () => {},
  updateShipDetails: () => {},
  cart: {
    products: [],
    count: 0,
    total: 0,
    shipping: "Inside Dhaka",
    delivery: 0,
  },
});

export const CartContextProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<TInitialCartState>({
    products: [],
    total: 0,
    shipping: "Inside Dhaka",
    count: 0,
    delivery: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const ls = localStorage.getItem("cart");

    if (ls) {
      const data = JSON.parse(ls);
      setState(() => data);
    }
  }, []);

  const addToCart = (product: TCartProduct) => {
    const exists = state.products.find((p) => p.id === product.id);

    if (exists) {
      if (exists.stock < 1)
        return toast({
          variant: "destructive",
          title: "This product is currently out of stock!",
        });

      return toast({
        variant: "destructive",
        title: "Product Already on Cart!",
      });
    }

    const newProducts = [...state.products, product];

    const total = newProducts.reduce((acc, p) => {
      return (
        90 + acc + (p.discountPrice ? p.discountPrice : p.price) * p.quantity!
      );
    }, 0);

    setState({
      ...state,
      products: newProducts,
      count: newProducts.length,
      total: total,
    });

    localStorage.setItem(
      "cart",
      JSON.stringify({
        products: newProducts,
        count: newProducts.length,
        total: total,
      })
    );

    toast({
      variant: "success",
      title: "Product Added to Cart!",
      description: `${product.name} added!`,
    });
  };

  const removeFromCart = (id: string, amount: number) => {
    const newCart = state.products.filter((p) => p.id !== id);
    const total = newCart.reduce((acc, p) => {
      return (
        (state.delivery ? state.delivery : 60) +
        acc +
        (p.discountPrice ? p.discountPrice : p.price) * p.quantity!
      );
    }, 0);

    setState({
      ...state,
      products: newCart,
      count: newCart.length,
      total: total,
    });

    if (newCart.length)
      localStorage.setItem(
        "cart",
        JSON.stringify({
          products: newCart,
          count: newCart.length,
          total: total,
        })
      );
    else localStorage.removeItem("cart");
  };

  const updateQuantity = (id: string, count: number) => {
    if (!count)
      return toast({
        variant: "destructive",
        title: "Invalid Quantity!",
        description: "Quantity can not be negative!",
      });

    const existing = state.products.find((p) => p.id === id);
    if (!existing) return;

    if (existing.stock < count)
      return toast({
        title: "Error stock exceeds!",
        description: `Only ${existing.stock} available. Please reduce the quantity!`,
        variant: "destructive",
      });

    const newProduct = [...state.products].map((p) => {
      if (p.id === id) return { ...p, quantity: count };
      else return p;
    });

    const total = newProduct.reduce((acc, p) => {
      return (
        (state.delivery ? state.delivery : 60) +
        acc +
        (p.discountPrice ? p.discountPrice : p.price) * p.quantity!
      );
    }, 0);

    setState({
      ...state,
      products: newProduct,
      total: total,
    });

    localStorage.setItem(
      "cart",
      JSON.stringify({
        products: newProduct,
        count: newProduct.length,
        total: total,
      })
    );
  };

  const updateShipping = (name: string, cost: number) => {
    const total = state.products.reduce((acc, p) => {
      return (
        cost + acc + (p.discountPrice ? p.discountPrice : p.price) * p.quantity!
      );
    }, 0);

    setState({
      ...state,
      total: total,
      shipping: name,
      delivery: cost,
    });

    localStorage.setItem(
      "cart",
      JSON.stringify({
        ...state,
        total: total,
        shipping: name,
      })
    );
  };

  const updateShipDetails = (name: string, delivery: number) => {
    setState((prev) => ({
      ...prev,
      shipping: name,
      delivery: delivery,
    }));
  };

  const clearCart = () => {
    setState({
      count: 0,
      products: [],
      total: 0,
      shipping: "Inside Dhaka",
    });
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateQuantity: updateQuantity,
        updateShipping: updateShipping,
        clearCart: clearCart,
        updateShipDetails: updateShipDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => useContext(CartContext);

export default useCartContext;
