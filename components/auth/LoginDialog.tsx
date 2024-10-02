// components/Sign inDialog.js
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import GoogleIcon from "../icons/Google";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader } from "../ui/dialog";

export default function Sign inDialog({ openRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const credentialsSign in = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (!res?.ok) {
      toast.error(res?.error);
    }
  };

  const googleSign in = async () => {
    await signIn("google");
  };

  return (
    <DialogContent>
      <DialogHeader>
        <h3 className="text-xl font-semibold">Logga in</h3>
      </DialogHeader>
      <Button onClick={googleSign in} variant="outline">
        <GoogleIcon className="mr-2" />
        Sign in with Google
      </Button>
    </DialogContent>
  );
}
