// server component
import { Suspense } from "react";
import LoginClient from "./LoginClient";

const SigninPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
};

export default SigninPage;
