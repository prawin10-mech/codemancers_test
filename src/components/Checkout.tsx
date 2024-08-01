import { useAdminContext } from "@/lib/useGlobalContext";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

type Inputs = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export default function Checkout() {
  const { getCart, checkout } = useAdminContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    toast
      .promise(checkout(values), {
        loading: "Checking out...",
        success: "Checked out",
        error: "Whoops, it burnt",
      })
      .then(() => {
        setSubmitted(true);
        reset();
        getCart();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {submitted ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Checkout Success
          </h2>
          <FaCheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.name && "border-red-500"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.address && "border-red-500"
                }`}
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-red-500 text-xs italic">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.phone && "border-red-500"
                }`}
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs italic">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email && "border-red-500"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
