import AuthForm from "@/components/AuthForm";

const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AuthForm type="sign-up" />
    </div>
  );
};

export default page;
