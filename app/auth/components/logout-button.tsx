"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = () => {
  const onClick = async () => {
    await signOut();
  };

  return (
    <Button className="w-full" onClick={onClick}>
      Logout
    </Button>
  );
};
