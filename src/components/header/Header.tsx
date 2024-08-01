"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { FaCartPlus } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useAdminContext } from "@/lib/useGlobalContext";
import CartDrawer from "../Cart";

export default function Header() {
  const router = useRouter();
  const { cart, getCart } = useAdminContext();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const stringifiedUser = localStorage.getItem("user");
    if (stringifiedUser) {
      const userData = JSON.parse(stringifiedUser);
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    router.push("/login");
  };

  useEffect(() => {
    getCart();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="h-20 w-full bg-[#e48d85] text-white flex items-center justify-around px-10">
      <div className="flex gap-4 text-xl w-full">
        <p>Hello</p>
        <p>{user.name || "user"}</p>
      </div>

      <div className="flex flex-row gap-5 relative">
        {user.role === "USER" && (
          <div className="relative">
            <button className="text-2xl" onClick={toggleDrawer}>
              <FaCartPlus />
              {cart.length > 0 && (
                <div className="absolute top-0 z-5 right-0 bg-red-500 text-white rounded-full h-3 w-3 flex items-center justify-center text-xs">
                  {cart.length}
                </div>
              )}
            </button>
          </div>
        )}
        <button onClick={handleLogout}>
          <LuLogOut />
        </button>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } md:w-96`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex-grow overflow-y-auto divide-y  scrollbar-hide">
            <CartDrawer cartItems={cart} onClose={toggleDrawer} />
          </div>
        </div>
      </div>
    </div>
  );
}
