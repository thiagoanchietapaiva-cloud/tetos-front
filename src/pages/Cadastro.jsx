import { App, Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router";
import { useCriarUsuario } from "../hooks/usuarioHooks";
import { useBuscarNiveis } from "../hooks/niveisHooks";

const Cadastro = () => {

    const navigate = useNavigate();
    const { notification } = App.useApp();
    const { data: niveis = [] } = useBuscarNiveis();
    const { mutate: criarUsuario, isPending: criarPending } = useCriarUsuario();
    const [form] = Form.useForm();

    function cadastrar(dados) {
        criarUsuario(dados, {
            onSuccess: ({ type, description }) => {
                notification[type]({ description });
                if (type == "success") {
                    form.resetFields();
                    navigate("/");
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
                    onFinish={cadastrar}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="Digite seu nome" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="Digite seu email" />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.Password placeholder="**********" />
                    </Form.Item>

                    <Form.Item
                        label="Nível"
                        name="nivel_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Escolha um nível"
                            options={(niveis || []).map(nivel => {
                                return {
                                    label: nivel.nome,
                                    value: nivel.id
                                }
                            })}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full mt-4"
                        loading={criarPending}
                    >Cadastrar</Button>

                    <div className="flex justify-center mt-4">
                        <Button
                            type="link"
                            onClick={() => navigate("/")}
                        >
                            Já tem conta? Fazer login
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Cadastro;