import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth.jsx';
import { ToastProvider, Spinner } from './components/ui.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Products, ProductDetail, Categories, Suppliers } from './pages/Catalogue.jsx';
import { Purchases, PurchaseOrders, PODetail, GoodsReceived } from './pages/Purchasing.jsx';
import { Inventory, Batches, Warehouses } from './pages/Stock.jsx';
import { WebsiteOrders, Sales, OrderDetail, Returns, Wastage } from './pages/Sales.jsx';
import { Finance, Reports, Notifications, Users, Settings, Audit } from './pages/Admin.jsx';
import { FinanceWorkspace } from '../components/finance/FinanceWorkspace';

function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Guard><Layout /></Guard>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="purchases/:id" element={<PODetail />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="goods-received" element={<GoodsReceived />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="batches" element={<Batches />} />
            <Route path="warehouses" element={<Warehouses />} />
            <Route path="website-orders" element={<WebsiteOrders />} />
            <Route path="integration" element={<Navigate to="/website-orders?tab=integration" replace />} />
            <Route path="sales" element={<Sales />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="finance-erp" element={<FinanceWorkspace />} />
            <Route path="finance" element={<Finance />} />
            <Route path="returns" element={<Returns />} />
            <Route path="wastage" element={<Wastage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit" element={<Audit />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export function ArshithFreshApp() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
}

export default ArshithFreshApp;
