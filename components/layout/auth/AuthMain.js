"use client";

import React, { useState } from "react";

import OTPMain from "./OTPMain";
import LoginMain from "./LoginMain";
import SignUpMain from "./SignUpMain";

const AuthMain = () => {
  const [step, setStep] = useState(0);

  const onStepChange = (newStep) => {
    setStep(newStep);
  };

  return step === 0 ? (
    <LoginMain onStepChange={onStepChange} />
  ) : step === 1 ? (
    <SignUpMain onStepChange={onStepChange} />
  ) : (
    <OTPMain onStepChange={onStepChange} />
  );
};

export default AuthMain;
