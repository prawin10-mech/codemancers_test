"use client";

import React, { useState } from "react";
import ProductsTable, { Product } from "./ProductsTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProductForm from "./AddProductForm";

export default function AdminPage() {
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  const handleClose = () => {
    setProductDialog(false);
    setSelectedProduct(undefined);
  };

  const handleDialogForEdit = (product: Product) => {
    setSelectedProduct(product);
    setProductDialog(true);
  };

  return (
    <div>
      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogTrigger asChild>
          <button
            className="absolute top-24 right-10"
            onClick={() => {
              setSelectedProduct(undefined);
              setProductDialog(true);
            }}
          >
            Add Product
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? (
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Edit Product
                </h2>
              ) : (
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Add Product
                </h2>
              )}
            </DialogTitle>
            <DialogDescription>
              <AddProductForm onClose={handleClose} product={selectedProduct} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <h1 className="text-xl text-center">Admin products table</h1>
      <ProductsTable showDialog={handleDialogForEdit} />
    </div>
  );
}
