import SessionProvider from "./_components/providers/session";
import AntDProvider from "./_components/providers/theme";
import CookieConsent from "./_components/ui/cookie-consent";

function MainLayout() {
  return (
    <SessionProvider>
      <AntDProvider />
      <CookieConsent />
    </SessionProvider>
  );
}
export default MainLayout;
