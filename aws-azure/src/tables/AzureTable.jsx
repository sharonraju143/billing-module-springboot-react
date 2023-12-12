import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "Id", width: 90 },
  { field: "usageDate", headerName: "Date", width: 150 },
  { field: "resourceType", headerName: "ResourceType", width: 150 },
  { field: "resourceLocation", headerName: "ResourceLocation", width: 200 },
  { field: "resourceGroupName", headerName: "ResourceGroupName", width: 200 },
  { field: "serviceName", headerName: "ServiceName", width: 150 },
  { field: "meter", headerName: "Meter", width: 150 },
  { field: "tags", headerName: "Tags", width: 150 },
  { field: "costUSD", headerName: "CostUSD", width: 150 },
  { field: "cost", headerName: "Cost", width: 150 },
  { field: "currency", headerName: "Currency", width: 150 },
];

const AzureTable = ({ details, duration }) => {
  const rows = details.map((detail) => ({
    id: detail.id,
    usageDate: detail.usageDate,
    resourceType: detail.resourceType,
    resourceLocation: detail.resourceLocation,
    resourceGroupName: detail.resourceGroupName,
    serviceName: detail.serviceName,
    meter: detail.meter,
    tags: detail.tags,
    costUSD: detail.costUSD,
    cost: detail.cost,
    currency: detail.currency,
  }));

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        sx={{ border: "1px solid black", marginTop: 4 }}
        rows={duration !== 0 ? rows : []}
        columns={columns}
        pageSize={5}
        //checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default AzureTable;
