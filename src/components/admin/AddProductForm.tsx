"use client";

import { useAdminContext } from "@/lib/useGlobalContext";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Product } from "./ProductsTable";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

type Inputs = {
  title: string;
  image: FileList;
  description: string;
  price: number;
};

interface IAddProductForm {
  onClose: () => void;
  product?: Product;
}

export default function AddProductForm({ onClose, product }: IAddProductForm) {
  const { fetchAllProducts } = useAdminContext();
  const token = Cookies.get("accessToken") || "";
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product ? product.image : null
  );

  const defaultValues: Inputs = {
    title: product ? product.title : "",
    image: new DataTransfer().files, // Empty FileList
    description: product ? product.description : "",
    price: product ? product.price : 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ defaultValues });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      if (values.image.length > 0) {
        formData.append("image", values.image[0]);
      }
      if (product) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/product/edit_product/${product._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data) {
          onClose();
          fetchAllProducts();
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/product/add_product`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data) {
          onClose();
          fetchAllProducts();
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.title && "border-red-500"
              }`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Image
            </label>
            {product?.image && selectedImage ? (
              <div className="mb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={50}
                  height={50}
                  className="w-20 h-auto mb-2"
                />
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setSelectedImage(null)}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <input
                type="file"
                id="image"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.image && "border-red-500"
                }`}
                {...register("image", {
                  required: !product?.image && "Image is required",
                })}
              />
            )}
            {errors.image && (
              <p className="text-red-500 text-xs italic">
                {errors.image.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.description && "border-red-500"
              }`}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.price && "border-red-500"
              }`}
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 0.01,
                  message: "Price must be greater than zero",
                },
              })}
            />
            {errors.price && (
              <p className="text-red-500 text-xs italic">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isSubmitting ? "Adding" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
