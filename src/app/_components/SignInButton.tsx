import { UserCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SignInButton as RootSignInButton } from "@clerk/nextjs";

type SignInButtonProps = {
  variant?: "icon" | "default";
};
export default function SignInButton({
  variant = "default",
}: SignInButtonProps) {
  return (
    <RootSignInButton>
      <Button
        variant={variant === "icon" ? "ghost" : "secondary"}
        size={variant === "default" ? "lg" : "icon"}
      >
        {variant === "icon" ? <UserCircle size={24} /> : "Sign In"}
      </Button>
    </RootSignInButton>
  );
}
