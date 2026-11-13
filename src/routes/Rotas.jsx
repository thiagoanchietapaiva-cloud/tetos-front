import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";
import Home from "../pages/Home";
import RotaProtegida from "./RotaProtegida";
import Niveis from "../pages/Niveis";
import PageLayout from "../layouts/PageLayout";

const Rotas = () => {
   const token = sessionStorage.getItem("token");
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Login />} />
            {
               token && (
                  <Route path="/painel" element={<RotaProtegida><PageLayout /></RotaProtegida>}>
                     <Route index element={<Home />} />
                     <Route path="niveis" element={<Niveis />} />
                  </Route>
               )
            }
         </Routes>
      </BrowserRouter>
   );
}

export default Rotas;