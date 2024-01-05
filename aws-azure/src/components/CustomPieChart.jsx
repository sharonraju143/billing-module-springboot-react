import React from 'react'
import { Cell, Legend, Pie, Tooltip, PieChart, ResponsiveContainer } from 'recharts';

// import CardSkeleton from '../../../../ReactComponents/SkeletonLoaders/CardSkeleton';



const CustomPieChart = ({ data, height, outerRadius, innerRadius, color, findData, total }) => {
    const COLORS = ['#048DAD', '#10B981', '#FEA37C', '#FE6476', 'rgb(72 192 194)', '#8dc2f7', 'rgb(128, 128, 128)'];
    const RADIAN = Math.PI / 180;
    // const { currentColor } = useColor();
   const totalNum = data && data?.reduce((acc, entry) => acc + entry.value, 0);
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const formattedValue = data[index]?.value > 0 && data[index]?.value?.toLocaleString('en-IN');
       
        return (
            <>
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'middle' : 'middle'} dominantBaseline="central">
                    {formattedValue}
                </text>
                <text x={cx} y={cy}  textAnchor="middle" fontSize={16} fontWeight={900}>
                    {total ? total.toLocaleString('en-IN') : totalNum.toLocaleString('en-IN')}
                </text>
            </>
        );
    };

 
    const customTooltip = (
        <Tooltip
            contentStyle={{
                padding: 4,
                fontSize: 12,
            }}
            formatter={(value, name) => [value?.toLocaleString('en-IN'), name]}
        />
    );

    console.log(data , "jhgsdvkgajvhadhbv")

    return (
        <>
            {data ?
                <ResponsiveContainer width="100%" height={height}>
                    {totalNum == 0 ?
                        <div className='d-flex justify-content-center align-items-center' >No Data Avalible</div>
                        :
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                innerRadius={innerRadius ? innerRadius : 40}
                                outerRadius={outerRadius ? outerRadius : 90}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data?.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={color ? color[index % color.length] : COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            {data && <Legend iconType="circle" />}
                            {customTooltip}
                        </PieChart>
                    }
                </ResponsiveContainer>
                : <div className=''>Loading...</div> 
                // <Skeleton variant="circular" height={height} width={height} sx={{ mx: "auto" }} />
                }
        </>
    )
}

export default CustomPieChart