"use client";

import React from "react";
import { Modal, ModalBody, ModalHeader, ModalContent } from "@heroui/react";

const MainModal = ({
  title,
  isOpen,
  footer,
  children,
  description,
  size = "2xl",
  handleOnClose,
  showFooter = false,
}) => {
  return (
    <>
      <Modal
        backdrop="blur"
        classNames={{
          body: "p-6",
          base: "border border-gray-400 bg-black text-white",
          closeButton: "hover:bg-white/20 p-2 mt-3 mr-3 rounded text-xl",
        }}
        isOpen={isOpen}
        size={size}
        onClose={handleOnClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-start justify-between">
                <div className="max-w-md space-y-2">
                  <h3 className="text-2xl">{title}</h3>

                  <p className="text-sm font-normal text-gray-100">
                    {description}
                  </p>
                </div>
              </ModalHeader>

              <ModalBody className="mx-auto w-full max-w-md pb-6">
                {children}
              </ModalBody>

              {showFooter && (
                <ModalFooter className="flex items-center justify-end gap-2.5">
                  {footer}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainModal;
