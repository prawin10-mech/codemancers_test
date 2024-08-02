"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";
import { useAdminContext } from "@/lib/useGlobalContext";
import toast, { Toaster } from "react-hot-toast";

import Cookies from "js-cookie";

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

interface ProductsTable {
  showDialog: (product: Product) => void;
}

export default function ProductsTable({ showDialog }: ProductsTable) {
  const { products, fetchAllProducts } = useAdminContext();
  const token = Cookies.get("accessToken") || "";

  const handleDelete = async (id: string) => {
    try {
      toast
        .promise(
          axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/product/delete_product/${id}`,
            { headers: { Authorization: token } }
          ),
          {
            loading: "Product Deleting...",
            success: "Product was deleted",
            error: "Whoops, it burnt",
          }
        )
        .then(() => {
          fetchAllProducts();
        });
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableCaption>A list of Products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length ? (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="font-medium">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell className="text-right">{product.price}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.description}
                </TableCell>
                <TableCell className="text-right flex gap-4 justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => showDialog(product)}>
                          <CiEdit />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleDelete(product._id)}>
                          <MdDeleteForever color="red" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Product</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Products Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  );
}
