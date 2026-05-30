import styled from "styled-components";
import { theme } from "./Theme";

export const TableContainer = styled.div`
  width: 100%;
  min-height: 420px;

  background: ${theme.colors.background};
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  padding: 0px 20px;

  .MuiDataGrid-root {
    min-height: 420px;
    border: none;
    font-family: inherit;
    background: ${theme.colors.background};
  }

  .MuiDataGrid-columnHeaders {
    background: ${theme.colors.background};
    border-bottom: 1px solid #eef0f3;
  }

  .MuiDataGrid-columnHeaderTitle {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.colors.textSecondary};
  }

  .MuiDataGrid-cell {
    font-size: 14px;
    color: ${theme.colors.textPrimary};
    border-bottom: 1px solid #eef0f3;
    display: flex;
    align-items: center;
  }

  .MuiDataGrid-row:hover {
    background: #fffafa;
  }

  /* color CELDAS */
  .MuiDataGrid-cell.percent-cell-danger {
    background: rgba(220, 38, 38, 0.26);
  }
  .MuiDataGrid-cell.percent-cell-warning {
    background: rgba(245, 158, 11, 0.32);
  }
  .MuiDataGrid-cell.percent-cell-success {
    background: rgba(34, 197, 94, 0.28);
  }

  .MuiDataGrid-footerContainer {
    border-top: 1px solid #eef0f3;
  }

  .MuiDataGrid-virtualScroller {
    background: ${theme.colors.background};
  }

  .MuiDataGrid-cell:focus,
  .MuiDataGrid-columnHeader:focus,
  .MuiDataGrid-cell:focus-within,
  .MuiDataGrid-columnHeader:focus-within {
    outline: none;
  }
`;

export const TableActionGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

export const TableIconButton = styled.button`
  width: 34px;
  height: 34px;

  border: none;
  border-radius: 50%;
  background: transparent;
  color: #30425f;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${theme.colors.primary};
    background: #fff3f4;
    border-color: #ffd2d6;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const TableLocationButton = styled(TableIconButton)`
  color: ${({ $active }) => ($active ? theme.colors.primary : "#9cabc1")};
  background: ${({ $active }) => ($active ? "#fff3f4" : "#f8fafc")};
  border-color: ${({ $active }) => ($active ? "#ffd2d6" : "#edf0f5")};
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    color: ${({ $active }) => ($active ? theme.colors.primary : "#9cabc1")};
    background: ${({ $active }) => ($active ? "#fff3f4" : "#f8fafc")};
    border-color: ${({ $active }) => ($active ? "#ffd2d6" : "#edf0f5")};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }
`;

export const tooltipProps = {
  arrow: true,
  placement: "top-start",
  slotProps: {
    popper: {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, -15],
          },
        },
      ],
    },

    tooltip: {
      sx: {
        backgroundColor: theme.colors.primary,
        color: "#fff",
        fontSize: "13px",
        padding: "8px 12px",
        borderRadius: "10px",
        fontWeight: 500,
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        textAlign: "left",
      },
    },

    arrow: {
      sx: {
        color: theme.colors.primary,
        marginLeft: "-25%",
      },
    },
  },
};

export const actionTooltipProps = {
  arrow: true,
  placement: "top",
  slotProps: {
    tooltip: {
      sx: {
        backgroundColor: theme.colors.primary,
        color: "#fff",
        fontSize: "13px",
        padding: "8px 12px",
        borderRadius: "10px",
        fontWeight: 500,
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        textAlign: "left",
        marginTop: "4px",
      },
    },
    arrow: {
      sx: {
        color: theme.colors.primary,
      },
    },
  },
};