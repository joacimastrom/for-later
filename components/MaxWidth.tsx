import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export const MaxWidth = ({
  children,
  className,
}: PropsWithChildren & { className: string }) => {
  return (
    <div className={cn("max-w-screen-sm mx-auto", className)}>{children}</div>
  );
};
