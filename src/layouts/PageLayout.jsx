import { Outlet } from "react-router";
import Menu from "../components/Menu";

const PageLayout = () => {
    return ( 
        <div className="h-screen flex bg-slate-200">
            <Menu />
            <div className="h-screen flex-1 overflow-auto p-4">
                <Outlet />
            </div>
        </div>
     );
}
 
export default PageLayout;