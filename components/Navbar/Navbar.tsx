"use client";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { AuthDialog } from "../auth/AuthDialog";
import Logo from "../icons/Logo";

const Navbar = () => {
  const { data } = useSession();

  const { name } = data?.user || {};

  const [firstName, lastName, ...rest] = name?.split(" ") || [];

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {name ? (
              <>
                <Link href="/assignments">Projekt</Link>
                <Separator
                  orientation="vertical"
                  className="self-stretch h-auto"
                />
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
/* <Button onClick={() => signIn("google")}>Login</Button> */
