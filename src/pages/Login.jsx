import { App, Button, Form, Input } from "antd";
import { useLogin } from "../hooks/usuarioHooks";
import { useNavigate } from "react-router";


const Login = () => {

    const navigate = useNavigate();
    const { notification } = App.useApp();
    const { mutate: login, isPending: loginPending } = useLogin();

    function logar(dados) {
        login(dados, {
            onSuccess: ({ type, description, usuario, token }) => {
                notification[type]({ description });
                if (token) {
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("usuario", JSON.stringify(usuario));
                    navigate("/painel");
                }
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }

        })

    }
    return (
        <div className="h-screen flex justify-center items-center relative overflow-hidden bg-blue-950/60 backdrop-blur-md">

            <div className="relative z-10 w-95 p-4 bg-white rounded-2xl shadow-2xl">

                <Form
                    onFinish={logar}
                >
                    <Form.Item
                        label="Email"
                        name={"email"}
                        rules={[{ required: true, message: "Por favor, insira seu email!" }]}
                    >
                        <Input placeholder="Digite seu email" />
                    </Form.Item>
                    <Form.Item
                        label="Senha"
                        name={"senha"}
                        rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
                    >
                        <Input placeholder="**********" />

                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full mt-4"
                        loading={loginPending}
                    >Enviar</Button>
                </Form>
            </div>
        </div>

    );
}

export default Login;         