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
import Costs from "./pages/Costs";
import Locations from "./pages/Locations";
import Transfer from "./pages/Transfer";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import InventoryFisico from "./pages/InventoryFisico";
import MatrizVenta from "./pages/MatrizVenta";
import Brands from "./pages/Brands";
import Quotations from "./pages/Quotations";

import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn, level } = useLoginStore();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* APP PROTECTED */}
        {isLoggedIn && (
          <Route element={<AppLayout />}>
            {/* ADMIN + MANAGER */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Roles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/locations"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Locations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transfers"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Transfer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/costs"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Costs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/kardex"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <InventoryFisico />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sales-matrix"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <MatrizVenta />
                </ProtectedRoute>
              }
            />

            <Route
              path="/brands"
              element={
                <ProtectedRoute allowedLevels={[1, 2]}>
                  <Brands />
                </ProtectedRoute>
              }
            />

            {/* SOLO ADMIN */}

            <Route
              path="/profits"
              element={
                <ProtectedRoute allowedLevels={[1]}>
                  <MarginProfit />
                </ProtectedRoute>
              }
            />

            {/* ADMIN + MANAGER + VENDEDOR */}

            <Route
              path="/products"
              element={
                <ProtectedRoute allowedLevels={[1, 2, 4]}>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedLevels={[1, 2, 4]}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/receipts"
              element={
                <ProtectedRoute allowedLevels={[1, 2, 4]}>
                  <Receipts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quotations"
              element={
                <ProtectedRoute allowedLevels={[1, 2, 4]}>
                  <Quotations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedLevels={[1, 2, 4]}>
                  <Customer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/:id"
              element={
                <ProtectedRoute allowedLevels={[1, 2, 4]}>
                  <DetailCustomer />
                </ProtectedRoute>
              }
            />
          </Route>
        )}

        {/* FALLBACK */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
        {isLoggedIn && <Route path="*" element={<Navigate to="/products" />} />}
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
