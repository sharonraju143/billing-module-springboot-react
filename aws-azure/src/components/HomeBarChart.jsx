import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
    },
  ],
  width: 1200,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const dataset = [
  {
    aws: 59,
    git: 86,
    azure: 57,
    gcp: 75,
    atlassian: 21,
    month: 'Jan',
  },
  {
    aws: 50,
    git: 78,
    azure: 52,
    gcp: 70,
    atlassian: 28,
    month: 'Feb',
  },
  {
    aws: 47,
    git: 106,
    azure: 53,
    gcp: 90,
    atlassian: 41,
    month: 'Mar',
  },
  {
    aws: 54,
    git: 92,
    azure: 56,
    gcp: 73,
    atlassian: 41,
    month: 'Apr',
  },
  {
    aws: 57,
    git: 92,
    azure: 69,
    gcp: 99,
    atlassian: 57,
    month: 'May',
  },
  {
    aws: 60,
    git: 103,
    azure: 63,
    gcp: 144,
    atlassian: 60,
    month: 'June',
  },
  {
    aws: 59,
    git: 105,
    azure: 60,
    gcp: 319,
    atlassian: 65,
    month: 'July',
  },
  {
    aws: 65,
    git: 106,
    azure: 60,
    gcp: 249,
    atlassian: 60,
    month: 'Aug',
  },
  {
    aws: 51,
    git: 95,
    azure: 51,
    gcp: 131,
    atlassian: 51,
    month: 'Sept',
  },
  {
    aws: 60,
    git: 97,
    azure: 65,
    gcp: 55,
    atlassian: 65,
    month: 'Oct',
  },
  {
    aws: 67,
    git: 76,
    azure: 64,
    gcp: 48,
    atlassian: 64,
    month: 'Nov',
  },
  {
    aws: 61,
    git: 103,
    azure: 70,
    gcp: 25,
    atlassian: 70,
    month: 'Dec',
  },
  // Add data for the fifth bar for the rest of the months as needed
];

const valueFormatter = (value) => `${value}mm`;

export default function BarsDataset() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'aws', label: 'Aws', valueFormatter },
        { dataKey: 'git', label: 'Git', valueFormatter },
        { dataKey: 'azure', label: 'Azure', valueFormatter },
        { dataKey: 'gcp', label: 'Gcp', valueFormatter },
        { dataKey: 'atlassian', label: 'Atlassian', valueFormatter }, // Add the fifth bar series
        // ... (rest of your series configurations remain unchanged)
      ]}
      {...chartSetting}
    />
  );
}
