"use client";

import React from "react";
import { Button } from "@heroui/react";
import { MenuIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { toggleMobileMenu } from "@/redux/slice/modalsSlice";

const BurgerMenuButton = () => {
  const dispatch = useDispatch();

  const openMenu = () => {
    dispatch(toggleMobileMenu());
  };

  return (
    <Button
      isIconOnly
      variant="ghost"
      onPress={openMenu}
      className="h-9 w-9 min-w-0 rounded-full border border-gray-400 bg-gradient-dark text-white hover:bg-gray-700 md:hidden"
      aria-label="Open navigation menu"
    >
      <MenuIcon size={18} />
    </Button>
  );
};

export default BurgerMenuButton;
