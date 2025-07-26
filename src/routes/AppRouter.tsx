import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import Layout from '../components/layout/Layout.tsx';
import HomePage from '../pages/HomePage.tsx';
import CreateUserFormik from '../pages/CreateUserFormik.tsx';
import CreateUserHook from '../pages/CreateUserHook.tsx';
import EditUserPage from '../pages/EditUserPage.tsx';

function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/user/create" element={<CreateUserHook />} />
                <Route path="/user/create/formik" element={<CreateUserFormik />} />
                <Route path="/user/edit/:id" element={<EditUserPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;
