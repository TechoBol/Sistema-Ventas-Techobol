import styled from "styled-components";
import { theme } from "./Theme";

export const TableContainer = styled.div`
  width: 100%;
  min-height: 420px;
  background: ${theme.colors.background};
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
  overflow: hidden;

  .MuiDataGrid-root {
    min-height: 420px;
  }
`;
