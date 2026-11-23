import { App, Button, Drawer, Form, Image, Input, Popconfirm, Table } from "antd";
import { LuImageOff, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarImovel, useCriarImovel, useDeletarImovel, useEditarImovel } from "../hooks/imoveisHooks";
import { useState } from "react";
import { useBuscarImoveisTipo } from './../hooks/imoveisTipoHooks';
import { useBuscarLocatarios } from './../hooks/locatariosHooks';
import { APIURL } from "../services";


const Imoveis = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const { data: imoveis, isLoading: loadingImovel } = useBuscarImovel("?tipo=true&locatario=true");
    const { data: tipos } = useBuscarImoveisTipo();
    const { data: locatarios } = useBuscarLocatarios();
    const { mutate: criarImovel, isLoading: loadingCriar } = useCriarImovel();
    const { mutate: editarImovel, isLoading: loadingEditar } = useEditarImovel();
    const { mutate: deletarImovel } = useDeletarImovel();
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarImovel(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarCriar(false);
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
        editarImovel(dados, {
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
        deletarImovel(id, {
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

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Imóveis</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Novo imóvel</Button>
            </div>

            <div>
                <Table
                    dataSource={imoveis || []}
                    loading={loadingImovel}
                    rowKey={"id"}
                >
                    <Table.Column
                        title="Foto"
                        render={(_, linha) => {
                            return linha.imagem ? (
                                <Image
                                    width={80}
                                    height={60}
                                    className="object-contain"
                                    src={`${APIURL}${linha?.imagem}`}
                                />
                            ) : (
                                <div className="w-20 h-15 bg-slate-300 flex justify-center items-center">
                                    <LuImageOff />
                                </div>
                            )
                        }}
                    />
                    <Table.Column
                        title="Endereço"
                        render={(_, linha) => (
                            `${linha.logradouro} ${linha.numero} ${linha.complemento ? linha.complemento : ""}, ${linha.bairro}, ${linha.cidade}-${linha.estado}`
                        )}
                    />
                    <Table.Column
                        title="Quartos"
                        dataIndex="quartos"
                        align="center"
                    />
                    <Table.Column
                        title="Banheiros"
                        dataIndex="banheiros"
                        align="center"
                    />
                    <Table.Column
                        title="Garagens"
                        render={(_, linha) => linha.garagens ?? "---"}
                        align="center"
                    />
                    <Table.Column
                        title="Tipo"
                        dataIndex={["imoveis_tipo", "nome"]}
                        align="center"
                    />
                    <Table.Column
                        title="Locatário"
                        render={(_, linha) => (linha.locatario ? linha.locatario.nome : "Disponível")}
                        align="center"
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
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="nome do nível" />
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

export default Imoveis;