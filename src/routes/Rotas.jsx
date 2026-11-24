import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "../pages/Login";
import Home from "../pages/Home";
import RotaProtegida from "./RotaProtegida";
import Niveis from "../pages/Niveis";
import PageLayout from "../layouts/PageLayout";
import { useContext } from "react";
import { AdminContext } from "../contexts/AdminProvider";
import ImoveisTipo from "../pages/ImoveisTipo";
import Locatarios from "../pages/Locatarios";
import Imoveis from "../pages/Imoveis";
import HistoricoManutencoes from "../pages/HistoricoManuntencao";
import HistoricoImovel from "../pages/HistoricoImovel";
import Usuario from "../pages/Usuarios";
import Cadastro from "../pages/Cadastro";

const Rotas = () => {
   const { token } = useContext(AdminContext);
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            {
               token && (
                  <Route path="/painel" element={<RotaProtegida><PageLayout /></RotaProtegida>}>
                     <Route index element={<Home />} />
                     <Route path="niveis" element={<Niveis />} />
                     <Route path="imoveis-tipo" element={<ImoveisTipo />} />
                     <Route path="locatarios" element={<Locatarios />} />
                     <Route path="usuarios" element={<Usuario />} />
                     <Route path="imoveis" element={<Imoveis />} />
                     <Route path="historico-manutencoes" element={<HistoricoManutencoes />} />
                     <Route path="historico-imovel" element={<HistoricoImovel />} />
                  </Route>
               )
            }
           <Route path="*" element={<VoltarPraLogin/>}/> 
         </Routes>
      </BrowserRouter>
   );
}

const VoltarPraLogin = () => {
   return <Navigate to="/" />
}

export default Rotas;