import { LoginPage } from "../pages/login.page";
import { RegisterPage } from "../pages/register.page";

export const authRoutes = [
  {
    path: "/auth/login",
    element: LoginPage,
  },
  {
    path: "/auth/register",
    element: RegisterPage,
  },
];
