import React from "react";

import AuthProvider from "@/providers/AuthProvider";

const MainLayout = async ({ children }) => {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-[url('/hero-background.png')] bg-cover">
        {children}
      </div>
    </AuthProvider>
  );
};

export default MainLayout;
