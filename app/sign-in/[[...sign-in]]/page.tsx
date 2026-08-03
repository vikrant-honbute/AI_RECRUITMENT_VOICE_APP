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
        fallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#171717",
            colorPrimaryForeground: "#DEE2E6",
            colorBackground: "#CED4DA",
            colorForeground: "#343A40",
            colorMuted: "#495057",
            colorInput: "#DEE2E6",
            colorInputForeground: "#0a0a0a",
            colorBorder: "#6C757D",
            borderRadius: "8px",
          },
          elements: {
            card: {
              border: "1px solid #6C757D",
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
