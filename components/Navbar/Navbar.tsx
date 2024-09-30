"use client";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthDialog } from "../auth/AuthDialog";
import Logo from "../icons/Logo";
import { MaxWidth } from "../MaxWidth";

const Navbar = () => {
  const { data } = useSession();

  const { name } = data?.user || {};

  const [firstName, lastName, ...rest] = name?.split(" ") || [];

  return (
    <nav className="sticky top-0 z-10 bg-white/75 backdrop-blur-lg shadow-md px-5 ">
      <MaxWidth className="flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {name ? (
            <>
              <span className="text-gray-700">
                {firstName}
                {lastName && (
                  <span className="hidden ml-1 sm:inline-block">
                    {lastName}
                  </span>
                )}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              >
                Logga ut
              </Button>
            </>
          ) : (
            <AuthDialog />
          )}
        </div>
      </MaxWidth>
    </nav>
  );
};

export default Navbar;
/* <Button onClick={() => signIn("google")}>Login</Button> */
