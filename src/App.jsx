import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyle } from "./components/ui/GlobalStyle";
import { useLoginStore } from "./components/store/loginStore";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products"
import Cart from "./pages/Cart";
import Receipts from "./pages/Receipts";
import Customer from "./pages/Customer";
import Locations from "./pages/Locations";
import Transfer from "./pages/Transfer";
import Users from "./pages/Users";

function App() {
  const { isLoggedIn } = useLoginStore();
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/receipts" element={<Receipts/>} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/transfers" element={<Transfer />} />
            <Route path="/users" element={<Users />} />
          </>
        )}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
        {isLoggedIn && (
          <Route path="*" element={<Navigate to="/dashboard" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
