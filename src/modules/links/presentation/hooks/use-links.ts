import { useContext } from "react";
import { LinksContext, type LinksContextType } from "../store/links-context";

export const useLinks = (): LinksContextType => {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error("useLinks must be used within a LinksProvider");
  }
  return context;
};
