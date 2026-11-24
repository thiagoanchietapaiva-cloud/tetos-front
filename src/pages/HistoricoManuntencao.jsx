import { App, Button, Drawer, Form, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash, LuWrench } from "react-icons/lu";
import { useBuscarHistoricoManutencoes, useCriarHistoricoManutencoes, useDeletarHistoricoManutencoes, useEditarHistoricoManutencoes } from "../hooks/historicoManutencoesHooks";
import { useBuscarImovel } from "../hooks/imoveisHooks";
import { useState } from "react";

const HistoricoManutencoes = () => {

    const [monstrarCriar, setMostrarCriar] = useState(false);
    const { notification } = App.useApp();
    const { data: manutencoes, isLoading: loadingManutencoes } = useBuscarHistoricoManutencoes();
    const { data: imoveis } = useBuscarImovel();
    const { mutate: criarManutencoes, isLoading: loadingCriar } = useCriarHistoricoManutencoes();
    const { mutate: deletarManutencoes } = useDeletarHistoricoManutencoes();
    const { mutate: editarManutencoes, isLoading: loadingEditar } = useEditarHistoricoManutencoes();
    const [monstrarEditar, setMostrarEditar] = useState(false);
    const [manutencaoParaEditar, setManutencaoParaEditar] = useState(null);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarManutencoes(dados, {
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
        if (!manutencaoParaEditar) return;
        editarManutencoes({ id: manutencaoParaEditar.id, ...dados }, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);
                setManutencaoParaEditar(null);
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
        setManutencaoParaEditar(linha);
        formEditar.setFieldsValue({
            descricao: linha.descricao,
            valor: linha.valor,
            data: linha.data ? linha.data.split("T")[0] : "",
            imovel_id: linha.imovel_id
        });
        setMostrarEditar(true);
    }

    function deletar(id) {
        deletarManutencoes(id, {
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

    function nomeImovel(id) {
        const imovel = imoveis?.find((i) => i.id === id);
        if (!imovel) return "-";
        return `${imovel.logradouro}, ${imovel.numero} - ${imovel.bairro}`;
    }

    const camposForm = (
        <>
            <Form.Item label="Descrição" name="descricao" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="descrição da manutenção" />
            </Form.Item>
            <Form.Item label="Valor" name="valor" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="valor da manutenção" type="number" />
            </Form.Item>
            <Form.Item label="Data" name="data" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input type="date" />
            </Form.Item>
            <Form.Item label="Imóvel" name="imovel_id" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <select>
                    <option value="">Selecione o imóvel</option>
                    {imoveis?.map((imovel) => (
                        <option key={imovel.id} value={imovel.id}>{imovel.logradouro}, {imovel.numero} - {imovel.bairro}</option>
                    ))}
                </select>
            </Form.Item>
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap">

                <h2 className="text-3xl font-bold flex gap-2 items-center text-blue-900"><LuWrench />Manutenções</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Nova Manutenção
                </Button>
            </div>

            <div >
                <Table
                    dataSource={manutencoes || []}
                    loading={loadingManutencoes}
                    rowKey={"id"}
                    scroll={{ x: 800 }}
                >
                    <Table.Column title="Descrição" dataIndex="descricao" />
                    <Table.Column title="Valor" dataIndex="valor" render={(valor) => `R$ ${valor}`} />
                    <Table.Column title="Data" dataIndex="data" render={(data) => data ? new Date(data).toLocaleDateString("pt-BR") : "-"} />
                    <Table.Column title="Imóvel" dataIndex="imovel_id" render={(id) => nomeImovel(id)} />
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
                                    description="Deseja realmente apagar manutenção?"
                                    okText="Sim"
                                    cancelText="Não"
                                    onConfirm={() => deletar(linha.id)}
                                >
                                    <Button icon={<LuTrash />} />
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
                <Form layout="vertical" onFinish={criar}>
                    {camposForm}
                    <div className="flex justify-end">
                        <Button type="primary" htmlType="submit" loading={loadingCriar}>Enviar</Button>
                    </div>
                </Form>
            </Drawer>

            <Drawer
                title="Editar"
                open={monstrarEditar}
                onClose={() => setMostrarEditar(false)}
            >
                <Form form={formEditar} layout="vertical" onFinish={editar}>
                    {camposForm}
                    <div className="flex justify-end">
                        <Button type="primary" htmlType="submit" loading={loadingEditar}>Enviar</Button>
                    </div>
                </Form>
            </Drawer>

        </div>

    );
}

export default HistoricoManutencoes;