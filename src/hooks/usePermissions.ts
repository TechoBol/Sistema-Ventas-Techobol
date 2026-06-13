import { useLoginStore } from "../components/store/loginStore";
import { useLocationStore } from "../components/store/locationStore";

export const LEVELS = {
  ADMIN: 1,
  MANAGER: 2,
  BRANCH_MANAGER: 3, // ← nuevo, sucursal fija
  SELLER: 4,
  VIEWER: 5, // ← renombrado, puede ver pero no editar
};

export const usePermissions = () => {
  const { level, location, selectedLocationId, setSelectedLocationId } =
    useLoginStore();
  const { selectedLocation } = useLocationStore();

  const lvl = Number(level);

  const isAdmin = lvl === LEVELS.ADMIN;
  const isManager = lvl === LEVELS.MANAGER;
  const isBranchManager = lvl === LEVELS.BRANCH_MANAGER;
  const isSeller = lvl === LEVELS.SELLER;
  const isViewer = lvl === LEVELS.VIEWER;

  // Puede cambiar entre sucursales

  // Solo ve su sucursal asignada (no puede cambiar)
  const hasFixedBranch = isBranchManager;

  const canSwitchBranch = isAdmin || isManager || isViewer;

  const effectiveLocationId = canSwitchBranch
    ? selectedLocation?.id
    : location?.id;

  return {
    level: lvl,
    isAdmin,
    isManager,
    isBranchManager,
    isSeller,
    isViewer,

    canViewDashboard: isAdmin || isManager || isBranchManager || isViewer,
    canSwitchBranch,
    hasFixedBranch,
    effectiveLocationId,
    setSelectedLocationId, // para usar en el selector de sucursal

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
    canViewProfits: isAdmin,
    canViewCosts: isAdmin || isManager || isViewer,
    canApproveTransfers: isAdmin || isManager,
  };
};
