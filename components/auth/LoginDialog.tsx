// components/LoginDialog.js
import { signIn } from "next-auth/react";
import GoogleIcon from "../icons/Google";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader } from "../ui/dialog";

export default function LoginDialog() {
  const googleLogin = async () => {
    await signIn("google");
  };

  return (
    <DialogContent>
      <DialogHeader>
        <h3 className="text-xl font-semibold">Logga in</h3>
      </DialogHeader>
      <Button onClick={googleLogin} variant="outline">
        <GoogleIcon className="mr-2" />
        Sign in with Google
      </Button>
    </DialogContent>
  );
}
