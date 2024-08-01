import React from "react";
import { Product } from "../admin/ProductsTable";
import Image from "next/image";
import { useAdminContext } from "@/lib/useGlobalContext";
import toast, { Toaster } from "react-hot-toast";

interface ProductInterface {
  product: Product;
}

export default function ProductCard({ product }: ProductInterface) {
  const { addToCart, getCart } = useAdminContext();

  const handleAddToCart = async () => {
    toast
      .promise(addToCart({ productId: product._id, quantity: 1 }), {
        loading: "Product Adding to Cart...",
        success: "Product was Added to Cart",
        error: "Whoops, it burnt",
      })
      .then(() => {
        getCart();
      });
  };

  return (
    <div
      key={product._id}
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {product.image && (
        <div className="mb-4">
          <Image
            src={`${product.image}`} // Ensure path starts with a leading "/"
            alt={product.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {product.title}
      </h3>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-bold text-gray-900 mb-4">${product.price}</p>
      <button
        onClick={handleAddToCart}
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Add To Cart
      </button>
      <Toaster />
    </div>
  );
}
