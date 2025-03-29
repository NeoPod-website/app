"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const UiProviders = ({ children }) => {
  return (
    <HeroUIProvider>
      <NextThemesProvider>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
};

export default UiProviders;
