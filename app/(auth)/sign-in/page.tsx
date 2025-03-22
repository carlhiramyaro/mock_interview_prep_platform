import React from "react";
import AuthForm from "@/components/AuthForm";

const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default page;
