import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { basePath } from './api';
import { isAuthenticated } from './session';
import LoginPage from './pages/login';
import ReturnPage from './pages/return';
import HomePage from './pages/home';
import './App.css';
import { MainLayout } from './layout/layout';
import { BlankLayout } from './layout/blankLayout';
import { AccountPage } from './pages/account';
import { OrdersPage } from './pages/orders';
import { OrderDetailPage } from './pages/order-detail';
import { CustomersPage } from './pages/customers';
import { CustomerDetailPage } from './pages/customer-detail';

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route element={isAuthenticated() ? <MainLayout /> : <BlankLayout />}>
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate replace to="/home" />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/confirm" element={<ConfirmUserPage />} /> */}
          <Route
            path="/home"
            element={
              isAuthenticated() ? (
                <HomePage />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
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
            element={isAuthenticated() ? <AccountPage /> : <LoginPage />}
          />
          <Route path="/return" element={<ReturnPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
