"use client";

import React, { useEffect } from "react";
import { useAdminContext } from "@/lib/useGlobalContext";
import ProductCard from "./Product";

export default function Products() {
  const { products, fetchAllProducts } = useAdminContext();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </div>
  );
}
