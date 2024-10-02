import LoginDialog from "./LoginDialog";
// components/LoginDialog.js
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export const AuthDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign in</Button>
      </DialogTrigger>
      <LoginDialog />
    </Dialog>
  );
};
