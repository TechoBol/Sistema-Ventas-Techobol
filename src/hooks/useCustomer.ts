import { useMemo, useState } from "react";
import useSWR from "swr";

import { useLoginStore } from "../components/store/loginStore";
import { getCustomersService } from "../services/customerService";

const fetcher = ([_, token]: [string, string]) => getCustomersService(token);

const mapCustomerToTable = (customer: any) => ({
  id: customer.id,
  name: customer.name ?? "",
  phone: customer.phone ?? "",
  whatsapp: customer.whatsapp ?? "",
  occupation: customer.occupation ?? "",
  originChannel: customer.originChannel ?? "",
  address: customer.address ?? "",
  businessName: customer.businessName ?? "",
  latitude: customer.latitude ?? null,
  longitude: customer.longitude ?? null,
  addresses: customer.addresses ?? [],
  nits: customer.nits ?? [],
  isVisible: customer.isVisible,
  createdAt: customer.createdAt,
});

export const useCustomer = () => {
  const { token } = useLoginStore();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data = [],
    isLoading,
    error,
    mutate,
  } = useSWR(token ? ["customers", token] : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const customers = useMemo(() => {
    return data.map(mapCustomerToTable);
  }, [data]);

  const filteredCustomers = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return customers;

    return customers.filter((customer: any) => {
      // Busca también dentro de los NITs y nombres de empresa
      const nitsText = customer.nits
        .map((n: any) => `${n.number} ${n.companyName ?? ""}`)
        .join(" ");

      return [
        customer.name,
        customer.phone,
        customer.address,
        customer.businessName,
        nitsText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [customers, searchTerm]);

  return {
    customers: filteredCustomers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    refresh: mutate,
  };
};