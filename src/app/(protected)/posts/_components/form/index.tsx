import { Button, Col, DatePicker, Form, FormProps, Input, Row, Select, Space, Switch, Typography } from "antd";
import { useNavigate } from "react-router";
import { Section } from "admiral";

import { useFormErrorHandling } from "@/app/_hooks/form/use-form-error-handling";
import { TResponseError } from "@/commons/types/response";
import { createZodSync } from "@/utils/zod-sync";

import { FAQSchema } from "./schema";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface Props {
  formProps: FormProps;
  loading?: boolean;
  loadingData?: boolean;
  error: TResponseError | null;
  editForm?: boolean;
}

const rule = createZodSync(FAQSchema);

const FormFaq = ({ formProps, loading, loadingData, error, editForm }: Props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useFormErrorHandling(error, ({ key, message }) =>
    form.setFields([{ name: key, errors: [message] }]),
  );

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Section loading={loadingData}>
        <Section title="General Information">
          <Row gutter={[16, 0]}>
            <Col span={24} sm={12}>
              <Form.Item label="Category" name="category" required rules={[rule]}>
                <Select
                  placeholder="Select category"
                  options={[
                    {
                      label: "General",
                      value: "general",
                    },
                    {
                      label: "Technical",
                      value: "technical",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Post Name" name="question" required rules={[rule]}>
                <Input placeholder="e.g. How to create file ?" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Post Description" name="answer" required rules={[rule]}>
                <Input.TextArea placeholder="e.g. Go to MS Office" />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Valid Until" name="valid_date" rules={[rule]} required>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Status" name="status" rules={[rule]}>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Typography.Title level={5} style={{ marginBottom: 16 }}>
                Contact Numbers
              </Typography.Title>
              <Form.List name="contacts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} align="middle">
                        <Col span={10}>
                          <Form.Item
                          label="Type"
                            {...restField}
                            name={[name, "type"]} // Path data: phone_numbers[index].type
                            rules={[{ required: true, message: "Type required" }]}
                          >
                            <Select
                              placeholder="Type (Home/Work)"
                              options={[
                                { label: "Home", value: "home" },
                                { label: "Work", value: "work" },
                                { label: "Mobile", value: "mobile" },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                          label="Phone Number"
                            {...restField}
                            name={[name, "phone_number"]} 
                            rules={[{ required: true, message: "Number required" }]}
                          >
                            <Input placeholder="Phone number" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <MinusCircleOutlined
                            style={{ color: "red", fontSize: "18px", marginTop:"10px"}}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    ))}

                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Phone Number
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
        </Section>
      </Section>

      <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
        <Space>
          <Button type="default" htmlType="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading || formProps.disabled}
            loading={loading}
          >
            {!editForm ? "Save" : "Save Changes"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default FormFaq;
