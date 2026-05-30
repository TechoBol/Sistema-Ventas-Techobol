import { useLoginStore } from "../components/store/loginStore";

export const LEVELS = {
  ADMIN: 1,
  MANAGER: 2,
  SELLER: 4,
  VIEWER: 5,
};

export const usePermissions = () => {
  const { level } = useLoginStore();

  const lvl = Number(level);

  const isAdmin = lvl === 1;
  const isManager = lvl === 2;
  const isSeller = lvl === 4;

  return {
    level: lvl,

    isAdmin,
    isManager,
    isSeller,

    canViewDashboard: isAdmin || isManager,

    canViewProducts: true,
    canSell: isAdmin || isManager || isSeller,

    canViewReceipts: true,
    canViewQuotations: true,

    canViewCustomers: true,

    canManageSales: isAdmin || isManager,
    canManageInventory: isAdmin || isManager,

    canManageUsers: isAdmin || isManager,
    canManageRoles: isAdmin || isManager,
    canManageBranches: isAdmin || isManager,
    canManageTransfers: isAdmin || isManager,
    canManageCosts: isAdmin || isManager,
    canCreateProduct: isAdmin || isManager,
    canEditProduct: isAdmin || isManager,
    // SOLO ADMIN
    canViewProfits: isAdmin,
  };
};
