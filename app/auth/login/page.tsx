import { Social } from "../components/social";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// For now only supports social login
const LoginPage = () => {
  return (
    <main className="flex flex-col items-center justify-start w-full h-full pt-16">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
          <p className="text-gray-500 ">Sign in to your account to continue</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm ">
          <Suspense>
            <Social />
          </Suspense>
        </div>
        {/* <Alert className=" bg-yellow-200">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            We are looking for early adopters to join our waitlist. Join our waitlist
            to get access to use the application.
          </AlertDescription>
        </Alert> */}
      </div>
      {/* <div>
        <div className="text-xl">Sign In</div>
        <div>Sign in to access your account</div>
      </div>
      <Card className="w-1/2">
        <CardContent>
          <Social />
        </CardContent>
      </Card> */}
    </main>
  );
};

export default LoginPage;
