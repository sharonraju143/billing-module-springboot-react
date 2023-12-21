import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GcpTable({ data, months, serviceDescription, fromDate, toDate }) {
  let rows = [];

  if (
    Array.isArray(data) &&
    months !== 0 &&
    serviceDescription !== 0 &&
    fromDate !== 0 &&
    toDate !== 0
  ) {
    rows = data.map((detail) => ({
      id: detail.id,
      date: detail.Date,
      serviceId: detail.serviceId,
      serviceDescription:detail.serviceDescription,
      cost: detail.cost,
      
    }));
  }

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 250,
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "serviceId",
      headerName: "Service ID",
      width: 200,
    },
    {
      field: "serviceDescription",
      headerName: "ServiceName",
      width: 400,
    },
    {
      field: "cost",
      headerName: "Amount",
      width: 110,
    }
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "20px" }}></div>
      <div style={{ flex: 1, height: "100%", width: "100% !important" }}>
        {rows.length > 0 ? (
          <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10,25,50]}
          disableSelectionOnClick
           slots={{ toolbar: GridToolbar }}
          experimentalFeatures={{ ariaV7: true }}
        />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No data available
          </div>
        )}
      </div>
    </Box>
  );
}