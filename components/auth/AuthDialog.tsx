import { useState } from "react";
import Sign inDialog from "./Sign inDialog";
// components/Sign inDialog.js
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export const AuthDialog = () => {
  const [showSign in, setShowSign in] = useState(true);

  const openSign in = () => setShowSign in(true);
  const openRegister = () => setShowSign in(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign in</Button>
      </DialogTrigger>
      <Sign inDialog openRegister={openRegister} />
    </Dialog>
  );
};
