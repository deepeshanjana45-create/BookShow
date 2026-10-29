import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { ShieldAlert, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Layout = () => {
    const { isAdmin, fetchIsAdmin } = useAppContext();
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const verify = async () => {
            const allowed = await fetchIsAdmin();
            if (isMounted) {
                setChecking(false);
                if (!allowed) {
                    toast.error("Access Denied: You are not authorized to access the admin panel.");
                }
            }
        };
        verify();
        return () => {
            isMounted = false;
        };
    }, []);

    if (checking) {
        return <Loading />;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30 mb-4 animate-pulse">
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Access Denied</h1>
                <p className="text-gray-400 max-w-md mb-6 text-sm">
                    You do not have administrative privileges to view this section. This area is strictly restricted to administrators.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dull transition text-white font-medium text-sm shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Home className="w-4 h-4" />
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <>
            <AdminNavbar />
            <div className='flex'>
                <AdminSidebar />
                <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Layout;
