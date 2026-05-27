import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GlobalStyle } from "./components/ui/GlobalStyle";
import { useLoginStore } from "./components/store/loginStore";

import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Receipts from "./pages/Receipts";
import MarginProfit from "./pages/MarginProfit";
import Customer from "./pages/Customer";
import DetailCustomer from "./pages/DetailCustomer";
import Locations from "./pages/Locations";
import Transfer from "./pages/Transfer";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import InventoryFisico from "./pages/InventoryFisico";
import MatrizVenta from "./pages/MatrizVenta";
import Brands from "./pages/Brands";

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn } = useLoginStore();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />

      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        {isLoggedIn && (
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/profits" element={<MarginProfit />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/customer/:id" element={<DetailCustomer />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/transfers" element={<Transfer />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/kardex" element={<InventoryFisico />} />
            <Route path="/sales-matrix" element={<MatrizVenta />} />
            <Route path="/brands" element={<Brands />} />
          </Route>
        )}

        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
        {isLoggedIn && <Route path="*" element={<Navigate to="/dashboard" />} />}
      </Routes>
    </QueryClientProvider>
  );
}

export default App;