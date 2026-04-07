import { Button, Col, Row, Space, Typography, Form, Input, Divider, message } from "antd";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useIsMobileScreen } from "admiral";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/app/_components/providers/session";
import { usePostLogin } from "./_hooks/use-post-login";
import { AuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/libs/firebase/firebase";

const Component: React.FC = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobileScreen();
  const [socialLoading, setSocialLoading] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      navigate(searchParams.get("callbackUrl") || "/dashboard");
    }
  }, [session.status, navigate, searchParams]);

  const { mutate, isPending: loading } = usePostLogin();

  // Handler Login Email/Password
  const handleCredentialLogin = async (values: { email: string; password: string }) =>
    mutate(values);

  // Handler Social Login (Google & GitHub)
  const handleSocialLogin = async (provider: AuthProvider) => {
    setSocialLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      message.success(`Welcome, ${user.displayName}!`);
      session.signin({ provider: provider.providerId, token });
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };

      if (firebaseError.code !== "auth/popup-closed-by-user") {
        message.error("Social login failed. Please try again.");
      }
      console.error("Social Auth Error:", error);
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <Row align="middle" justify="center" style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Col
        xs={22}
        sm={16}
        md={12}
        lg={8}
        style={{
          backgroundColor: "#fff",
          padding: isMobile ? "2rem" : "3rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header Section */}
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center", marginBottom: "2rem" }}
        >
          <Typography.Title level={3} style={{ margin: 0 }}>
            Welcome back!
          </Typography.Title>
          <Typography.Text type="secondary">Please enter your details to sign in</Typography.Text>
        </Space>

        {/* Form Login Biasa */}
        <Form layout="vertical" onFinish={handleCredentialLogin} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Log in
            </Button>
          </Form.Item>
        </Form>

        {/* Divider Social Auth */}
        <Divider plain>
          <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
            OR CONTINUE WITH
          </Typography.Text>
        </Divider>

        {/* Social Buttons */}
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Button
            icon={<GoogleOutlined />}
            block
            size="large"
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={socialLoading || loading}
          >
            Google
          </Button>

          <Button
            icon={<GithubOutlined />}
            block
            size="large"
            onClick={() => handleSocialLogin(githubProvider)}
            disabled={socialLoading || loading}
          >
            GitHub
          </Button>
        </Space>
      </Col>
    </Row>
  );
};;

export default Component;