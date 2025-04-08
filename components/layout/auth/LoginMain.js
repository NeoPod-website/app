import React from "react";

import AuthMainContainer from "./AuthMainContainer";

import EmailSignUp from "./button/EmailSignUp";
import ContinueWithSocial from "./button/ContinueWithSocial";
import ContinueWithWallet from "./button/ContinueWithWallet";

const LoginMain = ({ onStepChange }) => {
  return (
    <AuthMainContainer
      title="Welcome"
      description="Access your account and start completing quests to earn rewards!"
    >
      <div className="space-y-2">
        <ContinueWithSocial onStepChange={onStepChange} />
        <ContinueWithWallet onStepChange={onStepChange} />
      </div>

      <div className="text-gray-500 flex items-center gap-2">
        <hr className="border-gray-500 flex-1"></hr>
        or
        <hr className="border-gray-500 flex-1"></hr>
      </div>

      <EmailSignUp onStepChange={onStepChange} />
    </AuthMainContainer>
  );
};

export default LoginMain;
