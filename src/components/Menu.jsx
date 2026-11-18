import { MdRoofing } from "react-icons/md";
import { NavLink } from "react-router";

const Menu = () => {
    return (
        <header className="w-55 h-screen bg-blue-900 p-4 ">
            <div className="flex items-center text-white ">
                <MdRoofing size={80} />

                <h1 className="text-3xl font-semibold text-white flex relative top-3.5 flex-col items-center leading-none">

                    Tetos
                </h1>
            </div>
            <nav className="flex flex-col *:leading-10 *:font-semibold *:text-white! *:hover:bg-white/25! *:rounded *:duration-200! *:pl-4 *:[&.active]:bg-white/25! *:[&.active] ">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink end to="/painel/niveis">Niveis</NavLink>
                <NavLink end to="/painel/imoveis-tipo">Imóveis Tipo</NavLink>
            </nav>
        </header>
    );
}

export default Menu;