import { useContext } from "react";
//
import { GlobalContext } from "./GlobalContext";

// ----------------------------------------------------------------------

export const useAdminContext = () => {
  const context = useContext(GlobalContext);

  if (!context) throw new Error("useAdminContext context must be provided");

  return context;
};
