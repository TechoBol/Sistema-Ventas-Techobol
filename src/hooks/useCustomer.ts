import { useMemo, useState } from "react";
import useSWR from "swr";

import { useLoginStore } from "../components/store/loginStore";
import { getCustomersService } from "../services/customerService";

const fetcher = ([_, token]: [string, string]) => getCustomersService(token);

const mapCustomerToTable = (customer: any) => ({
  id: customer.id,
  name: customer.name ?? "",
  ci: customer.nitCi ?? "",
  phone: customer.phone ?? "",
  address: customer.address ?? "",
  businessName: customer.businessName ?? "",
  latitude: customer.latitude ?? null,
  longitude: customer.longitude ?? null,
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

    return customers.filter((customer: any) =>
      [
        customer.name,
        customer.ci,
        customer.phone,
        customer.address,
        customer.businessName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
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
