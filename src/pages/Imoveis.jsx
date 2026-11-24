import { App, Button, Drawer, Form, Image, Input, Popconfirm, Select, Table } from "antd";
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
    const [imovelParaEditar, setImovelParaEditar] = useState(null);

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
        if (!imovelParaEditar) return;
        editarImovel({ id: imovelParaEditar.id, ...dados }, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);
                setImovelParaEditar(null);
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

    function abrirEditar(linha) {
        setImovelParaEditar(linha);
        formEditar.setFieldsValue({
            logradouro: linha.logradouro,
            numero: linha.numero,
            complemento: linha.complemento,
            bairro: linha.bairro,
            cidade: linha.cidade,
            estado: linha.estado,
            quartos: linha.quartos,
            banheiros: linha.banheiros,
            garagens: linha.garagens,
            imagem: linha.imagem,
            imoveis_tipo_id: linha.imoveis_tipo_id,
            locatario_id: linha.locatario_id
        });
        setMostrarEditar(true);
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

    const camposForm = (
        <>
            <Form.Item label="Logradouro" name="logradouro" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input placeholder="ex: Rua cidade ecologica" />
            </Form.Item>
            <Form.Item label="Número" name="numero" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input placeholder="ex: 00" />
            </Form.Item>
            <Form.Item label="Complemento" name="complemento">
                <Input placeholder="ex: Apto 101" />
            </Form.Item>
            <Form.Item label="Bairro" name="bairro" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input placeholder="ex: Edson Queiroz" />
            </Form.Item>
            <Form.Item label="Cidade" name="cidade" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input placeholder="ex: Fortaleza" />
            </Form.Item>
            <Form.Item label="Estado" name="estado" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input placeholder="ex: CE" />
            </Form.Item>
            <Form.Item label="Quartos" name="quartos" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input type="number" placeholder="ex: 2" />
            </Form.Item>
            <Form.Item label="Banheiros" name="banheiros" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Input type="number" placeholder="ex: 1" />
            </Form.Item>
            <Form.Item label="Garagens" name="garagens">
                <Input type="number" placeholder="ex: 1" />
            </Form.Item>
            <Form.Item label="Imagem" name="imagem">
                <Input placeholder="URL da imagem" />
            </Form.Item>
            <Form.Item label="Tipo" name="imoveis_tipo_id" rules={[{ required: true, message: "Campo obrigatório" }]}>
                <Select placeholder="Selecione o tipo">
                    {tipos?.map((tipo) => (
                        <Select.Option key={tipo.id} value={tipo.id}>{tipo.nome}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Locatário" name="locatario_id">
                <Select placeholder="Selecione o locatário" allowClear>
                    {locatarios?.map((locatario) => (
                        <Select.Option key={locatario.id} value={locatario.id}>{locatario.nome}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );

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
                                    
                                    onClick={() => abrirEditar(linha)}
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
                    {camposForm}
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
                    {camposForm}
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