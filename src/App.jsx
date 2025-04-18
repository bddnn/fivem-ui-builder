import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WebEditor from "./pages/WebEditor.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PagePreview from "./pages/PagePreview.jsx";
import Auth from "./pages/Auth.jsx";
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageProvider } from './context/PageContext';
import { TemplateProvider } from "./context/TemplateContext.jsx";
import { ThemeToggle } from "./components/misc/ThemeToggle.jsx";
import { Spinner } from "./components/misc/Spinner.jsx";
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    return children;
};

const AppRoutes = () => {
    const { loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    return (
        <Routes>
            <Route path="/auth" element={
                <>
                    <ThemeToggle />
                    <Auth />
                </>
            } />
            <Route path="/" element={
                <ProtectedRoute>
                    <ThemeToggle />
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/editor/:pageId" element={
                <ProtectedRoute>
                    <WebEditor />
                </ProtectedRoute>
            } />
            <Route path="/preview/:pageId" element={
                <ProtectedRoute>
                    <PagePreview />
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <PageProvider>
                <TemplateProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </TemplateProvider>
            </PageProvider>
        </AuthProvider>
    );
};

export default App;
