import { NavLink } from "react-router";

const Menu = () => {
    return ( 
        <header className="w-55 h-screen bg-blue-400 p-4 text">
            <h1 className="text-4xl font-semibold text-white">Tetos</h1>
            <nav className="flex flex-col *:leading-10 *:font-semibold *:text-white! *:hover:bg-white/25! *:rounded *:duration-200! *:pl-4 *:[&.active]:bg-white/25! *:[&.active] ">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink end to="/painel/niveis">Niveis</NavLink>
            </nav>
        </header>
     );
}
 
export default Menu;