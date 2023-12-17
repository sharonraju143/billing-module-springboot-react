// import React from "react";
// import { BarChart } from "@mui/x-charts/BarChart";

// const ServicesChart = ({ dataset }) => {
//   if (!dataset || dataset.length === 0) {
//     return (
//       <div className="chart-pie">
//         <div className="headtag">
//           <h3>Top 5 Consumers </h3>
//             <div> No data available</div>
//           {/* <BarChart dataset={[]} /> */}
//         </div>
//       </div>
//     );
//   }
//   const valueFormatter = (value) => `${value}mm`;

//   // Assuming dataset is in the format you provided
//   const transformedData = dataset?.map((item, index) => ({
//     serviceName: item.serviceName,
//     amount: item.amount,
//     // Adding a unique key for each item (required for React rendering)
//     id: index + 1,
//   }));

//   const chartSetting = {
//     // Your chart settings here
//     legend: {
//       position: "right", // Adjust the position of the legend as needed
//       label: {
//         fontSize: 12, // Set the desired font size for the legend labels
//         // You can include other label properties here if needed
//       },
//     },
//   };

//   return (
//     <div className="chart-pie">
//       {/* <div className=""style={{ padding: '0 50px' }}> */}

//       <div className="headtag">
//         <h3>Top 5 Consumers</h3>
//       </div>
//       <BarChart
//         dataset={transformedData}
//         yAxis={[{ scaleType: "band", dataKey: "serviceName" }]}
//         series={[{ dataKey: "amount", valueFormatter }]}
//         layout="horizontal"
//         {...chartSetting}
//       />
//       {/* </div> */}
//     </div>
//   );
// };

// export default ServicesChart;

import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const ServicesChart = ({ dataset }) => {
  if (!dataset || dataset.length === 0) {
    return (
      <div className="chart-pie">
        <div className="headtag">
          <h3>Top 5 Consumers </h3>
          <div> No data available</div>
        </div>
      </div>
    );
  }

  // Assuming dataset is in the format you provided
  const transformedData = dataset?.map((item, index) => ({
    serviceName: item.serviceName,
    amount: item.amount,
    id: index + 1,
  }));

  const chartSetting = {
    legend: {
      position: "right",
      label: {
        fontSize: 12,
      },
    },
  };

  const valueFormatter = (value) => `${value}mm`;

  return (
    <div className="chart-pie">
      <div className="headtag">
        <h3>Top 5 Consumers</h3>
      </div>
      <BarChart
        dataset={transformedData}
        yAxis={[{ scaleType: "band", dataKey: "serviceName" }]}
        series={[{ dataKey: "amount", valueFormatter }]}
        layout="horizontal"
        datalabels={[
          {
            display: true,
            anchor: "end", // Adjust the anchor as needed
            align: "end", // Align the labels to the end of the bars
            color: "black", // Adjust label color if needed
            formatter: (value) => value.serviceName, // Use serviceName as label
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
};

export default ServicesChart;
