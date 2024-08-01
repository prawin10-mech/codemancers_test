import axios from "axios";
import React, {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface Product {
  id?: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface Cart {
  productId: Product;
  quantity: number;
}

interface State {
  products: Product[];
  cart: Cart[];
}

type Action =
  | { type: "GET_PRODUCTS"; payload: { products: Product[] } }
  | { type: "ADD_TO_CART"; payload: { cart: Cart[] } }
  | { type: "GET_CART"; payload: { cart: Cart[] } }
  | { type: "REMOVE_PRODUCT_FROM_CART"; payload: { cart: Cart[] } };

const initialState: State = {
  products: [],
  cart: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        cart: action.payload.cart,
      };
    case "GET_CART":
      return {
        ...state,
        cart: action.payload.cart,
      };
    default:
      return state;
  }
};

interface GlobalContextType {
  products: Product[];
  fetchAllProducts: () => Promise<{ products?: Product[] }>;
  cart: Cart[];
  getCart: () => Promise<{ cart?: Cart[] }>;
  removeProductFromCart: (productId: string) => Promise<{ cart?: Cart }>;
  checkout: (values: any) => Promise<{ checkout?: any }>;
  addToCart: ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) => Promise<{ cart?: Cart[] | any }>;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

interface GlobalContextProviderProps {
  children: ReactNode;
}

export function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAllProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product/get_products`
      );

      const { products } = data;

      dispatch({
        type: "GET_PRODUCTS",
        payload: {
          products,
        },
      });

      return {
        products,
      };
    } catch (error) {
      return {};
    }
  }, []);

  const addToCart = useCallback(
    async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      try {
        const token = Cookies.get("accessToken") || "";
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/cart/add_product_to_cart`,
          { productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { cart } = data;

        return {
          cart,
        };
      } catch (error) {
        return {};
      }
    },
    []
  );

  const getCart = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken") || "";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/get_cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { cart } = data;
      dispatch({
        type: "GET_CART",
        payload: {
          cart: cart.products,
        },
      });

      return {
        cart,
      };
    } catch (error) {
      return {};
    }
  }, []);

  const removeProductFromCart = useCallback(async (productId: string) => {
    try {
      const token = Cookies.get("accessToken") || "";
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/remove_product`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { cart } = data;

      return {
        cart,
      };
    } catch (error) {
      return {};
    }
  }, []);

  const checkout = useCallback(async (values: any) => {
    try {
      const token = Cookies.get("accessToken") || "";
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { checkout } = data;

      return {
        checkout,
      };
    } catch (error) {
      return {};
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      products: state.products,
      fetchAllProducts,
      cart: state.cart,
      addToCart,
      getCart,
      removeProductFromCart,
      checkout,
    }),
    [
      state.products,
      fetchAllProducts,
      state.cart,
      addToCart,
      getCart,
      removeProductFromCart,
      checkout,
    ]
  );

  return (
    <GlobalContext.Provider value={memoizedValue}>
      {children}
    </GlobalContext.Provider>
  );
}
