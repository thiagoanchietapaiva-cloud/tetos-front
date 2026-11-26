import { Button, Card, Col, Input, Row, Table } from "antd";
import { LuBuilding, LuHistory, LuHouse, LuPlus, LuSearch, LuUser, LuUsers } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useBuscarImovel } from "../hooks/imoveisHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { useBuscarHistoricoImovel } from "../hooks/historicoImovelHooks";
import { useBuscarUsuario } from "../hooks/usuarioHooks";
import { useBuscarImoveisTipo } from "../hooks/imoveisTipoHooks";

const Home = () => {
  const navigate = useNavigate();
  const [termo, setTermo] = useState("");

  const { data: imoveis, isLoading: carregandoImoveis } = useBuscarImovel();
  const { data: locatarios, isLoading: carregandoLocatarios } = useBuscarLocatarios();
  const { data: historicos, isLoading: carregandoHistoricos } = useBuscarHistoricoImovel();
  const { data: usuarios, isLoading: carregandoUsuarios } = useBuscarUsuario();
  const { data: tipos } = useBuscarImoveisTipo();

  const mapaTipos = {};
  (tipos || []).forEach((t) => {
    mapaTipos[t.id] = t.nome;
  });

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

  function textoImovel(item) {
    return `${item.logradouro || ""}, ${item.numero || ""} - ${item.bairro || ""}`;
  }

  const imoveisFiltrados = (imoveis || []).filter((item) => {
    return textoImovel(item).toLowerCase().includes(termo.toLowerCase());
  });

  const mostrarResultado = termo.length > 0;

  const irParaImoveis = () => {
    navigate("/painel/imoveis");
    setTermo("");
  };

  const contarPorTipo = () => {
    const contagem = {};
    (imoveis || []).forEach((item) => {
      const tipo = mapaTipos[item.tipo_id] || item.tipo?.nome || item.imoveis_tipo?.nome || "Sem tipo";
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });
    return Object.entries(contagem);
  };

  const dadosGrafico = contarPorTipo();
  const maiorValor = Math.max(...dadosGrafico.map((item) => item[1]), 1);

  const colunasImoveis = [
    {
      title: "Imovel",
      key: "imovel",
      render: (_, linha) => textoImovel(linha),
    },
    {
      title: "Bairro",
      dataIndex: "bairro",
      key: "bairro",
    },
  ];

  const colunasHistorico = [
    {
      title: "Descricao",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Imovel",
      dataIndex: "imovel_id",
      key: "imovel_id",
      render: (id) => nomeImovel(id),
    },
    {
      title: "Locatario",
      dataIndex: "locatario_id",
      key: "locatario_id",
      render: (id) => nomeLocatario(id),
    },
    {
      title: "Entrada",
      dataIndex: "data_entrada",
      key: "data_entrada",
      render: (data) => formatarData(data),
    },
    {
      title: "Aluguel",
      dataIndex: "valor_aluguel",
      key: "valor_aluguel",
      render: (valor) => `R$ ${valor}`,
    },
  ];

  const colunasUsuarios = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nivel",
      dataIndex: ["nivel", "nome"],
      key: "nivel",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold flex gap-2 items-center text-blue-900">
        <LuHouse />
        Home
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Button type="primary" icon={<LuPlus />} size="large" block onClick={() => navigate("/painel/imoveis")}>
              Novo Imovel
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button type="primary" icon={<LuPlus />} size="large" block onClick={() => navigate("/painel/locatarios")}>
              Novo Locatario
            </Button>
          </Col>
        </Row>

        <Card title="Pesquisar Imovel">
          <Input
            prefix={<LuSearch />}
            placeholder="Digite logradouro ou bairro..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            size="large"
            allowClear
          />
          {mostrarResultado && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {imoveisFiltrados.length === 0 && <div>Nenhum imovel encontrado</div>}
              {imoveisFiltrados.map((item) => (
                <Button
                  key={item.id}
                  type="text"
                  style={{ textAlign: "left", justifyContent: "flex-start", height: "auto", padding: "8px 12px" }}
                  onClick={irParaImoveis}
                >
                  {textoImovel(item)}
                </Button>
              ))}
            </div>
          )}
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={carregandoImoveis}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <LuBuilding size={28} />
                <div>
                  <div>Imoveis</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>{imoveis?.length || 0}</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card loading={carregandoLocatarios}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <LuUsers size={28} />
                <div>
                  <div>Locatarios</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>{locatarios?.length || 0}</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card loading={carregandoHistoricos}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <LuHistory size={28} />
                <div>
                  <div>Historico</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>{historicos?.length || 0}</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card loading={carregandoUsuarios}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <LuUser size={28} />
                <div>
                  <div>Usuarios</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>{usuarios?.length || 0}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Imoveis por Tipo" loading={carregandoImoveis}>
          {dadosGrafico.length === 0 && <div>Nenhum imovel cadastrado</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {dadosGrafico.map(([tipo, quantidade]) => (
              <div key={tipo}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{tipo}</span>
                  <span style={{ fontWeight: "bold" }}>{quantidade}</span>
                </div>
                <div style={{ background: "#f0f0f0", height: 12, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${(quantidade / maiorValor) * 100}%`, background: "#1677ff", height: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Ultimos Imoveis">
              <Table dataSource={imoveis?.slice(-5).reverse() || []} columns={colunasImoveis} loading={carregandoImoveis} pagination={false} rowKey="id" size="small" />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Ultimos Historicos">
              <Table dataSource={historicos?.slice(-5).reverse() || []} columns={colunasHistorico} loading={carregandoHistoricos} pagination={false} rowKey="id" size="small" />
            </Card>
          </Col>
        </Row>

        <Card title="Ultimos Usuarios">
          <Table dataSource={usuarios?.slice(-5).reverse() || []} columns={colunasUsuarios} loading={carregandoUsuarios} pagination={false} rowKey="id" size="small" />
        </Card>
      </div>
    </div>
  );
};

export default Home;