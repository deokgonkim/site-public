import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { basePath } from './api';
import LoginPage from './pages/login';
import ReturnPage from './pages/return';
import HomePage from './pages/home';
import './App.css';
import { MainLayout } from './layout/layout';
import { AccountPage } from './pages/account';
import { OrdersPage } from './pages/orders';
import { OrderDetailPage } from './pages/order-detail';
import { CustomersPage } from './pages/customers';
import { CustomerDetailPage } from './pages/customer-detail';
import { useAuth } from './provider/auth';
import ProtectedRoute from './route/protected';

function App() {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);

  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        {/* <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate replace to="/home" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        /> */}
        {/* <Route path="/confirm" element={<ConfirmUserPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/return" element={<ReturnPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route
            path="/:shopUid/customers/:customerId"
            element={<CustomerDetailPage />}
          />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/:shopUid/orders/:orderId"
            element={<OrderDetailPage />}
          />
          <Route
            path="/account"
            element={isAuthenticated ? <AccountPage /> : <LoginPage />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
