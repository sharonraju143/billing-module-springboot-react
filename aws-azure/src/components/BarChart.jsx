import * as React from "react";
import { BarChart } from "@mui/x-charts";

export default function ResponsiveBarChart({ data }) {
  let chartData = {
    xAxis: [],
    series: [],
  };

  if (data && data.length > 0) {
    chartData.xAxis = [
      {
        scaleType: "band",
        data: data?.map((item) => item?.month),
      },
    ];

    chartData.series = [
      {
        data: data?.map((item) => item?.amount),
      },
    ];
  }

  return (
    <div className="card">
        
      <h4 >Billing Summary</h4>
     
      <BarChart {...chartData} />
      </div>
    
  );
}
