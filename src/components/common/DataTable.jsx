import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TableContainer } from "../ui/DataTable.styles";

function DataTable({
  rows = [],
  columns = [],
  getRowId,
  pageSize = 5,
  pageSizeOptions = [5, 10, 20],
  loading = false,
}) {
  return (
    <TableContainer>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={pageSizeOptions}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize,
              page: 0,
            },
          },
        }}
        sx={{
          border: "none",
          fontFamily: "inherit",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #eef0f3",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "#50627f",
            fontSize: "13px",
          },

          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #eef0f3",
            color: "#06132b",
            fontSize: "14px",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#fffafa",
          },

          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #eef0f3",
          },

          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
        }}
      />
    </TableContainer>
  );
}

export default DataTable;
