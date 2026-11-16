import { App, Button, Drawer, Form, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useBuscarNiveis, useCriarNivel } from "../hooks/niveisHooks";
import { useState } from "react";

const Niveis = () => {

    const [ monstrarCriar, setMostrarCriar ] = useState(false);
    const { notification } = App.useApp ();
    const { data: niveis, isLoading: loadingNiveis } = useBuscarNiveis();
    const { mutate: criarNivel, isLoading: loadingCriar } = useCriarNivel();

    function criar(dados){
        criarNivel(dados, {
            onSuccess: ({ type, description }) =>{
                setMostrarCriar(false);
                notification[type]({
                    description,
                    placement:"bottonRight"
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
                <h2 className="text-3xl font-bold">Níveis</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                >Novo Nível
                </Button>
            </div>
            <div >
                <Table
                    dataSource={niveis || []}
                    loading={loadingNiveis}
                    rowKey={"id"}
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
                                />
                                <Popconfirm
                                    title="Aviso"
                                    description="Deseja realmente apagar nivel?"
                                    okText="Sim"
                                    cancelText="Não"
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
                        <input placeholder="nome do nivel" />

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

        </div>

    );
}

export default Niveis;