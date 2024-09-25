// components/RegisterDialog.js
import axios from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";

export default function RegisterDialog({ openLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });

    signIn("credentials", { redirect: false, email, password });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <h3 className="text-xl font-semibold">Registrera</h3>
      </DialogHeader>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Namn"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="off"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lösenord"
          required
        />
        <Button type="submit" className="w-full">
          Registrera
        </Button>
      </form>

      <div className="mt-2 text-center">
        <span>Har du redan ett konto?</span>
        <Button variant="link" onClick={openLogin} className="underline px-2">
          Logga in
        </Button>
      </div>
    </DialogContent>
  );
}
