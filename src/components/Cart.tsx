import { Cart } from "@/lib/GlobalContext";
import { useAdminContext } from "@/lib/useGlobalContext";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Checkout from "./Checkout";
import { IoMdClose } from "react-icons/io";

interface CartItem {
  cartItems: Cart[];
  onClose: () => void;
}

export default function CartDrawer({ cartItems, onClose }: CartItem) {
  const { removeProductFromCart, getCart } = useAdminContext();

  const handleRemoveFromCart = async ({ productId }: { productId: string }) => {
    toast
      .promise(removeProductFromCart(productId), {
        loading: "Product Removing from Cart...",
        success: "Product was Removed from Cart",
        error: "Whoops, it burnt",
      })
      .then(() => {
        getCart();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateTotalPrice = () => {
    return cartItems?.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full text-black bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative p-6 h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <button onClick={onClose} className="absolute right-4 top-4">
          <IoMdClose className="text-xl text-red-600" />
        </button>
        <div className="flex-grow overflow-y-auto ">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center py-4">
                <Image
                  src={item.productId.image}
                  alt={item.productId.title}
                  width={50}
                  height={35}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-semibold">
                    {item.productId.title}
                  </h3>
                  <p className="text-gray-600">{item.productId.description}</p>
                  <p className="text-lg font-bold mt-1">
                    ${item.productId.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() =>
                    handleRemoveFromCart({ productId: item.productId._id })
                  }
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Your cart is empty</p>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="mt-auto w-full">
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>

            <Drawer>
              <DrawerTrigger className="w-full">
                <button className="mt-4 w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
                  Checkout
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle />
                  <DrawerDescription>
                    <Checkout />
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>
    </div>
  );
}
