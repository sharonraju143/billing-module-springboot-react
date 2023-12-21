import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const TopResourseTypeBarChart = ({ top5ServiceDescriptions }) => {
  if (!top5ServiceDescriptions || top5ServiceDescriptions.length === 0) {
    return (
      <div className="chart-container">
        <div className="headtag">
          <h3>Top 5 Consumers</h3>
          <div>No data available</div>
        </div>
      </div>
    );
  }

  const transformedData = top5ServiceDescriptions?.map((item) => ({
    serviceDescription: item.serviceDescription,
    totalCost: parseFloat(item.totalCost.toFixed(2)), // Round to 2 decimal places
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
            <YAxis dataKey="serviceDescription" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalCost" fill="#02B2AF" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default TopResourseTypeBarChart;
