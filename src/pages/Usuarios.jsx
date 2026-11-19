import { App, Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarUsuario, useCriarUsuario, useDeletarUsuario, useEditarUsuario } from "../hooks/usuarioHooks";
import { useState } from "react";
import { useBuscarNiveis } from "../hooks/niveisHooks";


const Usuarios = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const { data: usuarios, isLoading: loadingUsuario } = useBuscarUsuario();
    const { data: niveis = [] } = useBuscarNiveis();
    const { mutate: criarUsuario, isLoading: loadingCriar } = useCriarUsuario();
    const { mutate: editarUsuario, isLoading: loadingEditar } = useEditarUsuario();
    const { mutate: deletarUsuario } = useDeletarUsuario();
    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarUsuario(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarCriar(false);
                formCriar.resetFields();
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    function editar(dados) {
        editarUsuario(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    function deletar(id) {
        deletarUsuario(id, {
            onSuccess: ({ type, description }) => {
                notification[type]({
                    description,
                    placement: "bottomRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    const formatPhone = (value) => {
        if (!value) return '';
        const digits = value.replace(/\D/g, '').slice(0, 11);

        if (digits.length <= 2) return digits.length ? `(${digits}` : '';
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Usuários</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Novo usuário</Button>
            </div>

            <div>
                <Table
                    dataSource={usuarios || []}
                    loading={loadingUsuario}
                    rowKey={"id"}
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
                    />
                    <Table.Column
                        title="Email"
                        dataIndex="email"
                    />
                    <Table.Column
                        title="Nível"
                        dataIndex={["nivel", "nome"]}
                    />
                    <Table.Column
                        title="Ações"
                        className="w-25"
                        render={(_, linha) => (
                            <div className="flex gap-2">
                                <Button
                                    icon={<LuPencil />}
                                    type="primary"
                                    onClick={() => {
                                        formEditar.setFieldValue("id", linha.id);
                                        formEditar.setFieldValue("nome", linha.nome);
                                        formEditar.setFieldValue("email", linha.email);
                                        formEditar.setFieldValue("nivel_id", linha.nivel_id);
                                        setMostrarEditar(true);
                                    }}
                                />
                                <Popconfirm
                                    title="Aviso:"
                                    description="Deseja realmente apagar?"
                                    okText="Sim"
                                    cancelText="Não"
                                    onConfirm={() => deletar(linha.id)}
                                >
                                    <Button
                                        icon={<LuTrash2 />}
                                        type="primary"
                                    />
                                </Popconfirm>
                            </div>
                        )}
                    />
                </Table>
            </div>

            <Drawer
                title="Criar"
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                    form={formCriar}
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="nome do nível" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>
                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="********" />
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
                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadingCriar}
                        >
                            Enviar
                        </Button>
                    </div>
                </Form>
            </Drawer>

            <Drawer
                title="Editar"
                open={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="nome do nível" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>
                    <Form.Item
                        label="Senha"
                        name="senha"
                    >
                        <Input placeholder="********" />
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
                    
                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadingEditar}
                        >
                            Enviar
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </div>
    );
}

export default Usuarios;