import * as React from "react";
import { BarChart } from "@mui/x-charts";

export default function GcpMonthlyTotalBillsChart({ monthlyTotalBills }) {
  let chartData = {
    xAxis: [],
    series: [],
  };

  if (monthlyTotalBills && Object.keys(monthlyTotalBills).length > 0) {
    chartData.xAxis = [
      {
        scaleType: "band",
        data: Object.keys(monthlyTotalBills),
      },
    ];

    chartData.series = [
      {
        data: Object.values(monthlyTotalBills),
      },
    ];
  }

  return (
    <div className="chart-container">
      <div className="headtag">
        <h4></h4>
      </div>
      <BarChart {...chartData} />
    </div>
  );
}
