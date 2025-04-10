import React from "react";

import EmailSignUp from "./EmailSignUp";
import AuthMainContainer from "./AuthMainContainer";

import ContinueWithSocial from "./button/ContinueWithSocial";
import ContinueWithWallet from "./button/ContinueWithWallet";

const LoginMain = ({ email, setEmail, isLoading, handleEmailSubmit }) => {
  return (
    <AuthMainContainer
      title="Welcome"
      description="Access your account and start completing quests to earn rewards!"
    >
      <div className="space-y-2">
        <ContinueWithSocial />
        <ContinueWithWallet />
      </div>

      <div className="text-gray-500 flex items-center gap-2">
        <hr className="border-gray-500 flex-1"></hr>
        or
        <hr className="border-gray-500 flex-1"></hr>
      </div>

      <EmailSignUp
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
        handleEmailSubmit={handleEmailSubmit}
      />
    </AuthMainContainer>
  );
};

export default LoginMain;
