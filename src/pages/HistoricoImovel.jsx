import { App, Button, Drawer, Form, Popconfirm, Table } from "antd";
import { LuHistory, LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useBuscarHistoricoImovel, useCriarHistoricoImovel, useDeletarHistoricoImovel, useEditarHistoricoImovel } from "../hooks/historicoImovelHooks";
import { useBuscarImovel } from "../hooks/imoveisHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { useState } from "react";

const HistoricoImovel = () => {

    const [monstrarCriar, setMostrarCriar] = useState(false);
    const { notification } = App.useApp();
    const { data: historicos, isLoading: loadingHistoricos } = useBuscarHistoricoImovel();
    const { data: imoveis } = useBuscarImovel();
    const { data: locatarios } = useBuscarLocatarios();
    const { mutate: criarHistorico, isLoading: loadingCriar } = useCriarHistoricoImovel();
    const { mutate: deletarHistorico } = useDeletarHistoricoImovel();
    const { mutate: editarHistorico, isLoading: loadingEditar } = useEditarHistoricoImovel();
    const [monstrarEditar, setMostrarEditar] = useState(false);
    const [historicoParaEditar, setHistoricoParaEditar] = useState(null);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarHistorico(dados, {
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
        if (!historicoParaEditar) return;
        editarHistorico({ id: historicoParaEditar.id, ...dados }, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);
                setHistoricoParaEditar(null);
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
        setHistoricoParaEditar(linha);
        formEditar.setFieldsValue({
            descricao: linha.descricao,
            data_entrada: linha.data_entrada ? linha.data_entrada.split("T")[0] : "",
            data_saida: linha.data_saida ? linha.data_saida.split("T")[0] : "",
            valor_aluguel: linha.valor_aluguel,
            valor_iptu: linha.valor_iptu,
            valor_condominio: linha.valor_condominio,
            imovel_id: linha.imovel_id,
            locatario_id: linha.locatario_id
        });
        setMostrarEditar(true);
    }

    function deletar(id) {
        deletarHistorico(id, {
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

    function nomeLocatario(id) {
        return locatarios?.find((l) => l.id === id)?.nome || "-";
    }

    function formatarData(data) {
        if (!data) return "-";
        return new Date(data).toLocaleDateString("pt-BR");
    }

    const camposForm = (
        <>
            <Form.Item label="Descrição" name="descricao" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="ex: Locação residencial" />
            </Form.Item>
            <Form.Item label="Data Entrada" name="data_entrada" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input type="date" />
            </Form.Item>
            <Form.Item label="Data Saída" name="data_saida" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input type="date" />
            </Form.Item>
            <Form.Item label="Valor Aluguel" name="valor_aluguel">
                <input placeholder="valor do aluguel" type="number" />
            </Form.Item>
            <Form.Item label="Valor IPTU" name="valor_iptu">
                <input placeholder="valor do iptu" type="number" />
            </Form.Item>
            <Form.Item label="Valor Condomínio" name="valor_condominio">
                <input placeholder="valor do condomínio" type="number" />
            </Form.Item>
            <Form.Item label="Imóvel" name="imovel_id" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <select>
                    <option value="">Selecione o imóvel</option>
                    {imoveis?.map((imovel) => (
                        <option key={imovel.id} value={imovel.id}>{imovel.logradouro}, {imovel.numero} - {imovel.bairro}</option>
                    ))}
                </select>
            </Form.Item>
            <Form.Item label="Locatário" name="locatario_id" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <select>
                    <option value="">Selecione o locatário</option>
                    {locatarios?.map((locatario) => (
                        <option key={locatario.id} value={locatario.id}>{locatario.nome}</option>
                    ))}
                </select>
            </Form.Item>
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap">

                <h2 className="text-3xl font-bold flex gap-2 items-center text-blue-900"><LuHistory />Histórico Imóveis</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Novo Histórico
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table
                    dataSource={historicos || []}
                    loading={loadingHistoricos}
                    rowKey={"id"}
                    scroll={{ x: 800 }}
                >
                    <Table.Column title="Descrição" dataIndex="descricao" />
                    <Table.Column title="Entrada" dataIndex="data_entrada" render={(data) => formatarData(data)} />
                    <Table.Column title="Saída" dataIndex="data_saida" render={(data) => formatarData(data)} />
                    <Table.Column title="Aluguel" dataIndex="valor_aluguel" render={(valor) => `R$ ${valor}`} />
                    <Table.Column title="IPTU" dataIndex="valor_iptu" render={(valor) => `R$ ${valor}`} />
                    <Table.Column title="Condomínio" dataIndex="valor_condominio" render={(valor) => `R$ ${valor}`} />
                    <Table.Column title="Imóvel" dataIndex="imovel_id" render={(id) => nomeImovel(id)} />
                    <Table.Column title="Locatário" dataIndex="locatario_id" render={(id) => nomeLocatario(id)} />
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
                                    description="Deseja realmente apagar histórico?"
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

export default HistoricoImovel;