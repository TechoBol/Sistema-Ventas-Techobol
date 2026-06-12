import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";
import { socket } from "../services/SocketIOConnection";
import { notificationToast } from "../services/toasts";
import { useNavigate } from "react-router-dom";

const useInventory = () => {
  const { token } = useLoginStore();

  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const data = await getProducts(token);
      setProducts(data);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product: any) =>
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.code || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  const goToInventory = () => navigate("/inventory");

  useEffect(() => {
    const handleRefresh = async () => {
      await fetchProducts();
    };

    const handleTransfer = async (mensaje: string) => {
      //notificationToast(mensaje);

      await fetchProducts();
    };

    socket.on("newProduct", handleRefresh);

    socket.on("cartProduct", handleRefresh);

    socket.on("transfer", handleTransfer);
    socket.on("updateProductMargin", (updatedProduct) => {
  setProducts((prev) =>
    prev.map((item) => {
      if (item.id !== updatedProduct.id) {
        return item;
      }

      return {
        ...item,

        salePrice: updatedProduct.salePrice,
        porcentajeGanancia: updatedProduct.porcentajeGanancia,
        quantityDiscount: updatedProduct.quantityDiscount,
        bossDiscount: updatedProduct.bossDiscount,

        // IMPORTANTE
        productUnits: updatedProduct.productUnits,

        // opcional
        inventories: updatedProduct.inventories,
      };
    }),
  );
});
    return () => {
      socket.off("newProduct", handleRefresh);

      socket.off("cartProduct", handleRefresh);

      socket.off("transfer", handleTransfer);
      socket.off("updateProductMargin");
    };
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [token]);

  return {
    products: filteredProducts,

    search,

    setSearch,

    isLoading,

    onFilterTextBoxChanged,

    refresh: fetchProducts,

    goToInventory,
  };
};

export default useInventory;
