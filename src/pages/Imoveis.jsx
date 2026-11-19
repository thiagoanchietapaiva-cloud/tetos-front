import { App, Button, Drawer, Form, Popconfirm, Table } from "antd";
import { LuHouse, LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useBuscarImoveis, useCriarImoveis, useDeletarImoveis, useEditarImoveis } from "../hooks/imoveisHooks";
import { useBuscarImoveisTipo } from "../hooks/imoveisTipoHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { useState } from "react";

const Imoveis = () => {

    const [monstrarCriar, setMostrarCriar] = useState(false);
    const { notification } = App.useApp();
    const { data: imoveis, isLoading: loadingImoveis } = useBuscarImoveis();
    const { data: tipos } = useBuscarImoveisTipo();
    const { data: locatarios } = useBuscarLocatarios();
    const { mutate: criarImoveis, isLoading: loadingCriar } = useCriarImoveis();
    const { mutate: deletarImoveis } = useDeletarImoveis();
    const { mutate: editarImoveis, isLoading: loadingEditar } = useEditarImoveis();
    const [monstrarEditar, setMostrarEditar] = useState(false);
    const [imovelParaEditar, setImovelParaEditar] = useState(null);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarImoveis(dados, {
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
        if (!imovelParaEditar) return;
        editarImoveis({ id: imovelParaEditar.id, ...dados }, {
            onSuccess: ({ type, description }) => {
                setMostrarEditar(false);
                setImovelParaEditar(null);
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
        setImovelParaEditar(linha);
        formEditar.setFieldsValue({
            matricula: linha.matricula,
            logradouro: linha.logradouro,
            numero: linha.numero,
            complemento: linha.complemento,
            bairro: linha.bairro,
            cidade: linha.cidade,
            estado: linha.estado,
            cep: linha.cep,
            valor_aluguel: linha.valor_aluguel,
            iptu: linha.iptu,
            valor_condominio: linha.valor_condominio,
            metragem: linha.metragem,
            quartos: linha.quartos,
            suites: linha.suites,
            banheiros: linha.banheiros,
            garagens: linha.garagens,
            imagem: linha.imagem,
            tipo_id: linha.tipo_id,
            locatario_id: linha.locatario_id
        });
        setMostrarEditar(true);
    }

    function deletar(id) {
        deletarImoveis(id, {
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

    const camposForm = (
        <>
            <Form.Item label="Matrícula" name="matricula">
                <input placeholder="matrícula do imóvel" />
            </Form.Item>
            <Form.Item label="Logradouro" name="logradouro" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="logradouro do imóvel" />
            </Form.Item>
            <Form.Item label="Número" name="numero" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="número do imóvel" />
            </Form.Item>
            <Form.Item label="Complemento" name="complemento">
                <input placeholder="complemento" />
            </Form.Item>
            <Form.Item label="Bairro" name="bairro" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="bairro" />
            </Form.Item>
            <Form.Item label="Cidade" name="cidade" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="cidade" />
            </Form.Item>
            <Form.Item label="Estado" name="estado" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="CE" />
            </Form.Item>
            <Form.Item label="CEP" name="cep" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="cep" />
            </Form.Item>
            <Form.Item label="Valor Aluguel" name="valor_aluguel" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="valor do aluguel" type="number" />
            </Form.Item>
            <Form.Item label="IPTU" name="iptu">
                <input placeholder="iptu" type="number" />
            </Form.Item>
            <Form.Item label="Valor Condomínio" name="valor_condominio">
                <input placeholder="valor do condomínio" type="number" />
            </Form.Item>
            <Form.Item label="Metragem" name="metragem" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="metragem" type="number" />
            </Form.Item>
            <Form.Item label="Quartos" name="quartos">
                <input placeholder="quartos" type="number" />
            </Form.Item>
            <Form.Item label="Suítes" name="suites">
                <input placeholder="suítes" type="number" />
            </Form.Item>
            <Form.Item label="Banheiros" name="banheiros" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <input placeholder="banheiros" type="number" />
            </Form.Item>
            <Form.Item label="Garagens" name="garagens">
                <input placeholder="garagens" type="number" />
            </Form.Item>
            <Form.Item label="Imagem" name="imagem">
                <input placeholder="url da imagem" />
            </Form.Item>
            <Form.Item label="Tipo" name="tipo_id" rules={[{ required: true, message: "Campo Obrigatorio" }]}>
                <select>
                    <option value="">Selecione o tipo</option>
                    {tipos?.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                    ))}
                </select>
            </Form.Item>
            <Form.Item label="Locatário" name="locatario_id">
                <select>
                    <option value="">Sem locatário / Vago</option>
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

                <h2 className="text-3xl font-bold flex gap-2 items-center text-blue-900"><LuHouse />Imóveis</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Novo Imóvel
                </Button>
            </div>

            <div >
                <Table
                    dataSource={imoveis || []}
                    loading={loadingImoveis}
                    rowKey={"id"}
                    scroll={{ x: 800 }}
                >
                    <Table.Column title="Matrícula" dataIndex="matricula" />
                    <Table.Column title="Logradouro" dataIndex="logradouro" />
                    <Table.Column title="Nº" dataIndex="numero" />
                    <Table.Column title="Bairro" dataIndex="bairro" />
                    <Table.Column title="Cidade" dataIndex="cidade" />
                    <Table.Column title="UF" dataIndex="estado" />
                    <Table.Column title="Aluguel" dataIndex="valor_aluguel" render={(valor) => `R$ ${valor}`} />
                    <Table.Column title="Tipo" dataIndex="tipo_id" render={(id) => tipos?.find((t) => t.id === id)?.nome || "-"} />
                    <Table.Column title="Locatário" dataIndex="locatario_id" render={(id) => locatarios?.find((l) => l.id === id)?.nome || "Vago"} />
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
                                    description="Deseja realmente apagar imóvel?"
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

export default Imoveis;