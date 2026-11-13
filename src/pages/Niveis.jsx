import { Button, Table } from "antd";
import { LuPlus } from "react-icons/lu";
import { useBuscarNiveis } from "../hooks/niveisHooks";

const Niveis = () => {

    const { data:niveis,isLoading:loadingNiveis } = useBuscarNiveis();

    return ( 
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Níveis</h2>
                <Button type="primary"
                icon={<LuPlus />}
                >Novo Nível
                </Button>
            </div>
            <div >
                <Table 
                     dataSource={niveis || []}
                     loading={loadingNiveis}
                >
                    <Table.Column
                         title="Nome"
                         dataIndex="nome"
                    />
                </Table>
            </div>
        </div>
     );
}
 
export default Niveis;