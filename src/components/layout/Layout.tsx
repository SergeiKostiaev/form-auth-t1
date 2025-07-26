import { useEffect, useState } from 'react';
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import styles from './Layout.module.css';
import axios from 'axios';

export default function Layout() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        axios.get('/api/v1/auth/me', { withCredentials: true })
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }, []);

    if (isAuth === null) return null;
    if (!isAuth && !isLoginPage) return <Navigate to="/login" replace />;

    return (
        <div className={styles.wrapper}>
            <Sidebar />
            <div className={styles.main}>
                <Header />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
