import React from "react";

import EmailSignUp from "./EmailSignUp";
import AuthMainContainer from "./AuthMainContainer";

import ContinueWithSocial from "./button/ContinueWithSocial";
import ContinueWithWallet from "./button/ContinueWithWallet";

const LoginMain = ({
  email,
  setEmail,
  isLoading,
  isValidEmail,
  setShowWalletForm,
  handleEmailSubmit,
}) => {
  return (
    <AuthMainContainer
      title="Welcome"
      description="Access your account and start completing quests to earn rewards!"
    >
      <div className="space-y-2">
        <ContinueWithSocial />
        <ContinueWithWallet setShowWalletForm={setShowWalletForm} />
      </div>

      <div className="flex items-center gap-2 text-gray-500">
        <hr className="flex-1 border-gray-500"></hr>
        or
        <hr className="flex-1 border-gray-500"></hr>
      </div>

      <EmailSignUp
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
        isValidEmail={isValidEmail}
        handleEmailSubmit={handleEmailSubmit}
      />
    </AuthMainContainer>
  );
};

export default LoginMain;
