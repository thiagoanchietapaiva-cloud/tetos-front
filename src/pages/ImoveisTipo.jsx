import { App, Button, Drawer, Form, Popconfirm, Table } from "antd";
import { LuLayers, LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useBuscarImoveisTipo, useCriarImoveisTipo, useDeletarImoveisTipo, useEditarImoveisTipo } from "../hooks/imoveisTipoHooks";
import { useState } from "react";

const ImoveisTipo = () => {

    const [monstrarCriar, setMostrarCriar] = useState(false);
    const { notification } = App.useApp();
    const { data: tipos, isLoading: loadingImoveisTipo } = useBuscarImoveisTipo();
    const { mutate: criarImoveisTipo, isLoading: loadingCriar } = useCriarImoveisTipo();
    const { mutate: deletarImoveisTipo } = useDeletarImoveisTipo();
    const { mutate: editarImoveisTipo, isLoading: loadingEditar } = useEditarImoveisTipo();
    const [monstrarEditar, setMostrarEditar] = useState(false);
    const [nivelParaEditar, setImoveisTipoParaEditar] = useState(null);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarImoveisTipo(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarCriar(false);
                notification[type]({
                    description,
                    placement: "bottonRight"
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
        if (!nivelParaEditar) return;
        editarImoveisTipo({ id: nivelParaEditar.id, ...dados }, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);
                setImoveisTipoParaEditar(null);
                notification[type]({
                    description,
                    placement: "bottonRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    function abrirEditar(linha) {
        setImoveisTipoParaEditar(linha);
        formEditar.setFieldsValue({ nome: linha.nome });
        setMostrarEditar(true);
    }

    function deletar(id) {
        deletarImoveisTipo(id, {
            onSuccess: ({ type, description }) => {
                notification[type]({
                    description,
                    placement: "bottonRight"
                })
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description
                });
            }
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap">

                <h2 className="text-3xl font-bold flex gap-2 items-center text-blue-900"><LuLayers />Tipos</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Novo Tipo
                </Button>
            </div>

            <div >
                <Table
                    dataSource={tipos || []}
                    loading={loadingImoveisTipo}
                    rowKey={"id"}
                    scroll={{ x: 800 }}
                >
                    <Table.Column
                        title="Nome"
                        dataIndex="nome"
                    />
                    <Table.Column
                        title="Ações"
                        className="w-25"
                        render={(_, linha) => (
                            <div className="flex gap-2">
                                <Button
                                    icon={<LuPencil />}
                                    onClick={() => abrirEditar(linha)}
                                />
                                <Popconfirm
                                    title="Aviso"
                                    description="Deseja realmente apagar nivel?"
                                    okText="Sim"
                                    cancelText="Não"
                                    onConfirm={() => deletar(linha.id)}
                                >
                                    <Button
                                        icon={<LuTrash />}

                                    />
                                </Popconfirm>
                            </div>
                        )}
                    />
                </Table>

            </div>

            <Drawer
                title="Criar"
                open={monstrarCriar}
                onClose={() => setMostrarCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo Obrigatorio" }]}
                    >
                        <input placeholder="nome do Tipo" />

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
                open={monstrarEditar}
                onClose={() => setMostrarEditar(false)}
            >
                <Form
                    form={formEditar}
                    layout="vertical"
                    onFinish={editar}
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo Obrigatorio" }]}
                    >
                        <input placeholder="nome do nivel" />

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

export default ImoveisTipo;