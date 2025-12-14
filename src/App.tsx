import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./modules/auth/presentation/store/auth-provider";
import { ProtectedRoute } from "./modules/auth/presentation/components/protected-route";
import { LoginPage } from "./modules/auth/presentation/pages/login.page";
import { RegisterPage } from "./modules/auth/presentation/pages/register.page";
import { HomePage } from "./modules/home/presentation/pages/home.page";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route
            path="*"
            caseSensitive={false}
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
