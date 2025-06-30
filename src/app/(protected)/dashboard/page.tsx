import { useSession } from "@/app/_components/providers/session";
import { Page } from "admiral";
import { Button } from "antd";
import { FC, ReactElement } from "react";

const Component: FC = (): ReactElement => {
  const { signout } = useSession();
  const handleLogout = () => {
    signout();
  };
  return (
    <Page title="Dashboard">
      <h1>Dashboard</h1>
      <img
        src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200"
        alt="cat"
      />
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Page>
  );
};

export default Component;
