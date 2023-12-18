// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// const ServicesChart = ({ dataset }) => {
//   if (!dataset || dataset.length === 0) {
//     return (
//       <div className="chart-pie">
//         <div className="headtag">
//           <h3>Top 5 Consumers </h3>
//           <div>No data available</div>
//         </div>
//       </div>
//     );
//   }

//   const transformedData = dataset?.map((item) => ({
//     serviceName: item.serviceName,
//     amount: item.amount,
//   }));

//   return (
//     <div className="chart-pie">
//       <div className="headtag">
//         <h3>Top 5 Consumers</h3>
//       </div>
//       <BarChart width={700} height={400} data={transformedData} layout="vertical">
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis type="number" />
//         <YAxis dataKey="serviceName" type="category"  width={150} />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="amount" fill="#02B2AF" />
//       </BarChart>
//     </div>
//   );
// };

// export default ServicesChart;


import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const ServicesChart = ({ dataset }) => {
  if (!dataset || dataset.length === 0) {
    return (
      <div className="chart-pie">
        <div className="headtag">
          <h3>Top 5 Consumers </h3>
          <div>No data available</div>
        </div>
      </div>
    );
  }

  const transformedData = dataset?.map((item) => ({
    serviceName: item.serviceName,
    amount: item.amount,
  }));

  return (
    <div className="chart-cont">
      <div className="chart-pie">
        <div className="headtag">
          <h3>Top 5 Consumers</h3>
        </div>
        <div className="responsive-chart">
          <BarChart width={700} height={400} data={transformedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="serviceName" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#02B2AF" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default ServicesChart;
