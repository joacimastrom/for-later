// components/LoginDialog.js
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import GoogleIcon from "../icons/Google";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function LoginDialog({ openRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const credentialsLogin = async (e) => {
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
        Logga in med Google
      </Button>
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-muted-foreground">Eller</span>
        <Separator className="flex-1" />
      </div>
      <span className="text-center">Logga in med lösenord</span>
      {/* Email/Password Login Form */}
      <form onSubmit={credentialsLogin} className="flex flex-col gap-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lösenord"
          required
        />
        <Button type="submit">Logga in</Button>
      </form>
      <div className="text-center">
        <span>Inget konto?</span>
        <Button
          variant="link"
          onClick={openRegister}
          className="underline px-1"
        >
          Registrera
        </Button>
      </div>
    </DialogContent>
  );
}
