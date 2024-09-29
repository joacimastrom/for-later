import { useState } from "react";
import LoginDialog from "./LoginDialog";
// components/LoginDialog.js
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export const AuthDialog = () => {
  const [showLogin, setShowLogin] = useState(true);

  const openLogin = () => setShowLogin(true);
  const openRegister = () => setShowLogin(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign in</Button>
      </DialogTrigger>
      <LoginDialog openRegister={openRegister} />
    </Dialog>
  );
};
