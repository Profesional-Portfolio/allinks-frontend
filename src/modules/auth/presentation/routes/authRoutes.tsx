import { LoginPage } from "../pages/login.page";
import { RegisterPage } from "../pages/register.page";

export const authRoutes = [
  {
    path: "/login",
    element: LoginPage,
  },
  {
    path: "/register",
    element: RegisterPage,
  },
];
