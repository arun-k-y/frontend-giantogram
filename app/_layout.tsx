import React from "react";
import { AuthProvider } from "./providers/auth-context";
import RootLayout from "./components/RootLayout";

export default function App() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
