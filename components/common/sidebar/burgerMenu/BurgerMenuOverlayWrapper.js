"use client";

import React from "react";
import { XIcon } from "lucide-react";
import { Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import LogoWithText from "@/components/ui/Logo";

import { toggleMobileMenu } from "@/redux/slice/modalsSlice";

const BurgerMenuOverlayWrapper = ({ children }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.modals.isMobileMenuOpen);

  const closeMenu = () => {
    dispatch(toggleMobileMenu());
  };

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div className="absolute left-0 top-0 h-full w-screen max-w-80 border-r border-gray-700 bg-black/95 backdrop-blur-lg">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <LogoWithText className="h-8 w-8" />

          <Button
            isIconOnly
            variant="ghost"
            onPress={closeMenu}
            className="h-8 w-8 min-w-0 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white"
            aria-label="Close navigation menu"
          >
            <XIcon size={18} />
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default BurgerMenuOverlayWrapper;
