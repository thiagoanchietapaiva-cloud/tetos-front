import { App, Button, Drawer, Form, Image, Input, Popconfirm, Select, Table, Upload } from "antd";
import { LuHouse, LuImageOff, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarImovel, useDeletarImovel } from "../hooks/imoveisHooks";
import { useState } from "react";
import { useBuscarImoveisTipo } from './../hooks/imoveisTipoHooks';
import { useBuscarLocatarios } from './../hooks/locatariosHooks';
import { APIURL, AXIOS, QUERYCLIENT } from "../services";

const Imoveis = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const { data: imoveis, isLoading: loadingImovel } = useBuscarImovel("?tipo=true&locatario=true");
    const { data: tipos } = useBuscarImoveisTipo();
    const { data: locatarios } = useBuscarLocatarios();
    const { mutate: deletarImovel } = useDeletarImovel();
    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();
    const [imovelParaEditar, setImovelParaEditar] = useState(null);
    const [loadingCriar, setLoadingCriar] = useState(false);
    const [loadingEditar, setLoadingEditar] = useState(false);

    function mostrarNotificacao(type, description) {
        const mostrar = notification[type] || notification.error;
        mostrar({
            description: description || "Ocorreu um erro",
            placement: "bottomRight"
        });
    }

    function pegarErro(erro) {
        return Array.isArray(erro?.response?.data)
            ? erro.response.data[0]
            : erro?.response?.data;
    }

    function montarFormData(dados) {
        const formData = new FormData();
        Object.entries(dados).forEach(([chave, valor]) => {
            if (chave === "imagem") {
                return;
            }
            if (valor === undefined || valor === null || valor === "") {
                return;
            }
            formData.append(chave, String(valor));
        });
      
        if (dados.imoveis_tipo_id) {
            formData.append("tipo_id", String(dados.imoveis_tipo_id));
        }
        if (dados.tipo_id) {
            formData.append("tipo_id", String(dados.tipo_id));
        }
       
        const arquivo = Array.isArray(dados.imagem) ? dados.imagem[0] : null;
        if (arquivo?.originFileObj) {
            formData.append("imagem", arquivo.originFileObj);
        } else if (arquivo?.url) {
            let urlAntiga = arquivo.url;
            if (urlAntiga.startsWith(APIURL)) {
                urlAntiga = urlAntiga.replace(APIURL, "");
            }
            formData.append("imagem", urlAntiga);
        }
        return formData;
    }
    async function criar(dados) {
        setLoadingCriar(true);
        try {
            const res = await AXIOS.post("/imoveis", montarFormData(dados), {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (Array.isArray(res.data)) {
                throw { response: { data: res.data } };
            }
            formCriar.resetFields();
            setMostrarCriar(false);
            QUERYCLIENT.invalidateQueries({ queryKey: ["imoveis"] });
            mostrarNotificacao(res.data?.type || "success", res.data?.description || "Imóvel criado com sucesso");
        } catch (erro) {
            const dadosErro = pegarErro(erro);
            mostrarNotificacao(dadosErro?.type, dadosErro?.description || dadosErro?.message || erro?.message || "Erro ao criar imóvel");
        } finally {
            setLoadingCriar(false);
        }
    }

    async function editar(dados) {
        if (!imovelParaEditar) {
            return;
        }
        setLoadingEditar(true);
        try {
            const res = await AXIOS.put(`/imoveis/${imovelParaEditar.id}`, montarFormData(dados), {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (Array.isArray(res.data)) {
                throw { response: { data: res.data } };
            }
            setMostrarEditar(false);
            setImovelParaEditar(null);
            QUERYCLIENT.invalidateQueries({ queryKey: ["imoveis"] });
            mostrarNotificacao(res.data?.type || "success", res.data?.description || "Imóvel editado com sucesso");
        } catch (erro) {
            const dadosErro = pegarErro(erro);
            mostrarNotificacao(dadosErro?.type, dadosErro?.description || dadosErro?.message || erro?.message || "Erro ao editar imóvel");
        } finally {
            setLoadingEditar(false);
        }
    }

    function abrirEditar(linha) {
        setImovelParaEditar(linha);
        formEditar.setFieldsValue({
            cep: linha.cep || "",
            logradouro: linha.logradouro,
            numero: linha.numero,
            complemento: linha.complemento,
            bairro: linha.bairro,
            cidade: linha.cidade,
            estado: linha.estado,
            quartos: linha.quartos,
            banheiros: linha.banheiros,
            garagens: linha.garagens,
            suites: linha.suites,
            metragem: linha.metragem,
            valor_aluguel: linha.valor_aluguel,
            imagem: linha.imagem ? [{ uid: "-1", name: "imagem atual", status: "done", url: linha.imagem.startsWith("http") ? linha.imagem : `${APIURL}${linha.imagem}` }] : [],
            imoveis_tipo_id: linha.imoveis_tipo_id ?? linha.tipo_id,
            locatario_id: linha.locatario_id
        });
        setMostrarEditar(true);
    }

    function deletar(id) {
        deletarImovel(id, {
            onSuccess: ({ type, description }) => {
                mostrarNotificacao(type || "success", description || "Imóvel deletado com sucesso");
            },
            onError: (erro) => {
                const dadosErro = pegarErro(erro);
                mostrarNotificacao(dadosErro?.type, dadosErro?.description || dadosErro?.message || erro?.message || "Erro ao deletar imóvel");
            }
        })
    }

    const camposForm = (
        <>
            <Form.Item
                label="CEP"
                name="cep"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    placeholder="ex: 60000-000"
                    maxLength={10}
                />
            </Form.Item>
            <Form.Item
                label="Logradouro"
                name="logradouro"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    placeholder="ex: Rua cidade ecologica"
                />
            </Form.Item>
            <Form.Item
                label="Número"
                name="numero"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    placeholder="ex: 00"
                />
            </Form.Item>
            <Form.Item
                label="Complemento"
                name="complemento"
            >
                <Input
                    placeholder="ex: Apto 101"
                />
            </Form.Item>
            <Form.Item
                label="Bairro"
                name="bairro"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    placeholder="ex: Edson Queiroz"
                />
            </Form.Item>
            <Form.Item
                label="Cidade"
                name="cidade"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    placeholder="ex: Fortaleza"
                />
            </Form.Item>
            <Form.Item
                label="Estado"
                name="estado"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    placeholder="ex: CE"
                    maxLength={2}
                />
            </Form.Item>
            <Form.Item
                label="Valor do aluguel"
                name="valor_aluguel"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    type="number"
                    step="0.01"
                    placeholder="ex: 1500.00"
                />
            </Form.Item>
            <Form.Item
                label="Metragem (m²)"
                name="metragem"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    type="number"
                    step="0.01"
                    placeholder="ex: 65.5"
                />
            </Form.Item>
            <Form.Item
                label="Quartos"
                name="quartos"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    type="number"
                    placeholder="ex: 2"
                />
            </Form.Item>
            <Form.Item
                label="Banheiros"
                name="banheiros"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Input
                    type="number"
                    placeholder="ex: 1"
                />
            </Form.Item>
            <Form.Item
                label="Suítes"
                name="suites"
            >
                <Input
                    type="number"
                    placeholder="ex: 1"
                />
            </Form.Item>
            <Form.Item
                label="Garagens"
                name="garagens"
            >
                <Input
                    type="number"
                    placeholder="ex: 1"
                />
            </Form.Item>
            <Form.Item
                label="Imagem"
                name="imagem"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                        return e;
                    }
                    return e?.fileList;
                }}
            >
                <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    accept=".jpg,.jpeg,.png,.webp"
                >
                    <Button
                        icon={<LuPlus />}
                    >
                        Selecionar imagem do computador
                    </Button>
                </Upload>
            </Form.Item>
            <Form.Item
                label="Tipo"
                name="imoveis_tipo_id"
                rules={[{ required: true, message: "Campo obrigatório" }]}
            >
                <Select
                    placeholder="Selecione o tipo"
                >
                    {tipos?.map((tipo) => (
                        <Select.Option
                            key={tipo.id}
                            value={tipo.id}
                        >
                            {tipo.nome}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Locatário"
                name="locatario_id"
            >
                <Select
                    placeholder="Selecione o locatário"
                    allowClear
                >
                    {locatarios?.map((locatario) => (
                        <Select.Option
                            key={locatario.id}
                            value={locatario.id}
                        >
                            {locatario.nome}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold flex gap-2 items-center text-blue-900">
                    <LuHouse />
                    Imóveis
                </h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >
                    Novo imóvel
                </Button>
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
                            if (!linha.imagem) {
                                return (
                                    <div className="w-20 h-15 bg-slate-300 flex justify-center items-center">
                                        <LuImageOff />
                                    </div>
                                );
                            }
                            const src = linha.imagem.startsWith("http")
                                ? linha.imagem
                                : `${APIURL}${linha.imagem}`;
                            return (
                                <Image
                                    width={80}
                                    height={60}
                                    className="object-contain"
                                    src={src}
                                />
                            );
                        }}
                    />
                    <Table.Column
                        title="Endereço"
                        render={(_, linha) => (
                            `${linha.logradouro} ${linha.numero}${linha.complemento ? `, ${linha.complemento}` : ""}, ${linha.bairro}, ${linha.cidade}-${linha.estado}${linha.cep ? ` (${linha.cep})` : ""}`
                        )}
                    />
                    <Table.Column
                        title="Aluguel"
                        render={(_, linha) => linha.valor_aluguel != null ? `R$ ${Number(linha.valor_aluguel).toFixed(2)}` : "---"}
                        align="center"
                    />
                    <Table.Column
                        title="Metragem"
                        render={(_, linha) => linha.metragem != null ? `${Number(linha.metragem)} m²` : "---"}
                        align="center"
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
                        render={(_, linha) => (linha.locatarios ? linha.locatarios.nome : "Disponível")}
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
                    form={formCriar}
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