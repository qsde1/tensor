import { useState } from "react";
import { apiAxios } from "../Api/api";
import { Button, Checkbox, Form, Input, Layout, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { faker } from "@faker-js/faker";

const styles = {
  layout: {
    height: "100%",
    width: "100%",
  },

  header: {
    borderBottom: "1px solid rgb(215, 215, 215)",
  },

  sider: {
    height: "100%",
    borderRight: "1px solid rgb(215, 215, 215)",
  },

  content: {},
};

const Registration = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});

  const onFinish = async (values) => {
    let result = await apiAxios.post("/registration", {
      ...values,
      img: faker.image.urlLoremFlickr({ category: "people" }),
    });
    if (result.status == 200) navigate("/auth");
  };

  return (
    <Layout style={styles.layout}>
      <Flex
        align="center"
        justify="center"
        style={{
          height: "100%",
        }}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={(changedValues, allValues) =>
            setFormValues(allValues)
          }
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[
              {
                required: true,
                message: "Это поле обязательное!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name="surname"
            rules={[
              {
                required: true,
                message: "Это поле обязательное!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Логин"
            name="login"
            rules={[
              {
                required: true,
                message: "Это поле обязательное!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: "Это поле обязательное!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Повторите пароль"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Это поле обязательное!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={
              {
                // offset: 5,
              }
            }
          >
            <Button
              type="primary"
              htmlType="submit"
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Layout>
  );
};

export default Registration;
