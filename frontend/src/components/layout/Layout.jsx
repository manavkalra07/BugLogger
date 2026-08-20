import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;