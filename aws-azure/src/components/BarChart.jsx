// import * as React from 'react';
// import { BarChart } from '@mui/x-charts';

// export default function ResponsiveBarChart({ data }) {
//   const chartData = {
//     xAxis: [{ scaleType: 'band', data: data && data.length > 0 && data?.map((data) => data.month) }],
//     series: [
//       {
//         data: data && data.length > 0 && data?.map((data) => data.amount),
//       },
//     ],
//   };

//   return (
//     <div className="chart-container">
//       <BarChart {...chartData} />
//     </div>
//   );
// }


import * as React from 'react';
import { BarChart } from '@mui/x-charts';

export default function ResponsiveBarChart({ data }) {
  let chartData = {
    xAxis: [],
    series: [],
  };

  if (data && data.length > 0) {
    chartData.xAxis = [
      {
        scaleType: 'band',
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
    <div className="chart-container">
        
      <BarChart {...chartData} />
    </div>
  );
}
