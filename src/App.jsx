import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyle } from "./components/ui/GlobalStyle";
import { useLoginStore } from "./components/store/loginStore";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products"
import Cart from "./pages/Cart";
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
