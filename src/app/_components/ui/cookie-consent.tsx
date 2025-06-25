import AskCookie from "react-cookie-consent";
import { Button } from "antd";
import { env } from "@/libs/env";

export default function CookieConsent() {
  const withConsent = env.VITE_COOKIE_CONSENT;

  if (!withConsent) return null;

  return (
    <AskCookie
      ButtonComponent={Button}
      disableButtonStyles
      debug
      customButtonProps={{ style: { margin: "1rem" } }}
    >
      This website uses cookies to enhance the user experience.
    </AskCookie>
  );
}
