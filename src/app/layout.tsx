import { Fragment } from "react/jsx-runtime";
import SessionProvider from "./_components/providers/session";
import AntDProvider from "./_components/providers/theme";
import CookieConsent from "@/app/_components/ui/cookie-consent";

function MainLayout() {
  return (
    <Fragment>
      <SessionProvider>
        <AntDProvider />
      </SessionProvider>
      <CookieConsent />
    </Fragment>
  );
}
export default MainLayout;
