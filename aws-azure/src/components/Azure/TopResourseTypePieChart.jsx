import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const TopResourceTypePieChart = ({ top5ResourceTypes }) => {
  if (!top5ResourceTypes || top5ResourceTypes.length === 0) {
    return (
      <div className="chart-container">
        <div className="headtag">
          <h3>Top 5 Resource Types</h3>
          <div>No data available</div>
        </div>
      </div>
    );
  }

  const transformedData = top5ResourceTypes.map((item, index) => ({
    name: item.resourseData,
    value: parseFloat(item.totalCost.toFixed(2)), // Round to 2 decimal places
    id: index + 1,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="chart-pie">
      <div className="headtag">
        <h3>Top 5 Resource Types</h3>
      </div>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          data={transformedData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TopResourceTypePieChart;
