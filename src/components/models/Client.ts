export interface CustomerAddress {
  id: number;
  address: string;
  label: string | null;
  latitude: number | null;
  longitude: number | null;
  reference: string | null;
  isPrimary: boolean;
}

export interface CustomerActivity {
  id: number;
  description: string;
  createdAt: string;
}

export interface CustomerNote {
  id: number;
  content: string;
  createdAt: string;
}

export interface CustomerSale {
  id: number;
  date: string;
  total: number;
  typeSale: string | null;
  status: string;
  employee: { name: string; lastName: string } | null;
  location: { name: string } | null;
}

export interface CustomerDetail {
  id: number;
  name: string;
  nitCi: string | null;
  businessName: string | null;
  code: string | null;
  phone: string | null;
  whatsapp: string | null;
  occupation: string | null;
  originChannel: string | null;
  reserveAmount: number;
  createdAt: string;
  addresses: CustomerAddress[];
  activities: CustomerActivity[];
  notes: CustomerNote[];
  sales: CustomerSale[];
  favoritePaymentMethod: string | null;
  purchaseFrequencyDays: number | null;
  pendingActivities: string[];
}