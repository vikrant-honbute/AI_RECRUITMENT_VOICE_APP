import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Sift"
      subtitle="Access your candidate pipeline and AI voice interviews."
    >
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#171717",
            colorPrimaryForeground: "#ffffff",
            colorBackground: "#ffffff",
            colorForeground: "#404040",
            colorMuted: "#525252",
            colorInput: "#ffffff",
            colorInputForeground: "#0a0a0a",
            colorBorder: "#e5e5e5",
            borderRadius: "8px",
          },
          elements: {
            card: {
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgb(0 0 0 / 8%)",
            },
            formButtonPrimary: {
              backgroundColor: "#171717",
              fontSize: "14px",
              fontWeight: "600",
            },
            formButtonPrimaryHover: {
              backgroundColor: "#2b2b2b",
            },
            footerActionLink: {
              color: "#171717",
            },
            footerActionLinkHover: {
              color: "#2b2b2b",
            },
          },
        }}
      />
    </AuthShell>
  );
}
