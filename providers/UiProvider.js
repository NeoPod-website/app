"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const UiProviders = ({ children }) => {
  return (
    <HeroUIProvider>
      <NextThemesProvider>
        <ToastProvider />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
};

export default UiProviders;
