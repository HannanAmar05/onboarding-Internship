import type { FC, ReactElement } from "react";
import { LayoutWithHeader } from "admiral";
import { Outlet } from "react-router";
import { SIDEBAR_ITEMS } from "@/commons/constants/sidebar";
import { filterPermission } from "@/utils/permission";
import { Flex, Typography, Avatar, Dropdown, Space } from "antd"; // Tambahkan Avatar & Dropdown
import { useSession } from "../_components/providers/session";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons"; // Tambahkan icon

const ProtectedLayout: FC = (): ReactElement => {
  const { session, signout } = useSession(); 
  const user = session?.user;
  const userPermissions =
    user?.roles?.map((role) => role.permissions?.map((perm) => perm.name)).flat() || [];

  const filteredItems = filterPermission(
    SIDEBAR_ITEMS,
    (item) =>
      item.permissions === undefined ||
      item.permissions.some((permission) => userPermissions.includes(permission)),
  );

  // Menu untuk dropdown profil
  const userMenuItems = [
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      onClick: signout,
    },
  ];

  return (
    <LayoutWithHeader
      header={{
        brandLogo: (
          <Flex align="center" gap={8}>
            <Typography.Title
              level={4}
              style={{
                marginBottom: 0,
                whiteSpace: "nowrap",
              }}
            >
              Vite Admiral
            </Typography.Title>
          </Flex>
        ),
        
        // TAMBAHKAN BAGIAN INI:
        menu: (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer", padding: "0 8px" }}>
              <div style={{ textAlign: "right", lineHeight: "1.2" }}>
                <Typography.Text strong style={{ display: "block" }}>
                  {user?.name || "User"}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                  {user?.roles?.[0]?.name || "Member"}
                </Typography.Text>
              </div>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
            </Space>
          </Dropdown>
        ),
      }}
      sidebar={{
        width: 250,
        menu: filteredItems,
        theme: "light",
      }}
    >
      <Outlet />
    </LayoutWithHeader>
  );
};

export default ProtectedLayout;
