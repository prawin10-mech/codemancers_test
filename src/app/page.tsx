"use client";

import AdminPage from "@/components/admin";
import Header from "@/components/header/Header";
import UserPage from "@/components/user";
import { GlobalContextProvider } from "@/lib/GlobalContext";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const stringifiedUser = localStorage.getItem("user");
    if (stringifiedUser) {
      const userData = JSON.parse(stringifiedUser);

      setUser(userData);
    }
  }, []);

  return (
    <>
      <GlobalContextProvider>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
          {user.role === "ADMIN" && <AdminPage />}
          {user.role === "USER" && <UserPage />}
        </main>
      </GlobalContextProvider>
    </>
  );
}
