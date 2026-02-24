import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StackedBarChartProps {
    data: Array<any>,
    barNamesWithColor: Array<any>
}

export const StackedBarChart = ({ data, barNamesWithColor }: StackedBarChartProps) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 10,
                    left: 0,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                    barNamesWithColor.map(bar =>
                        <Bar key={bar.dataKey} dataKey={bar.dataKey} stackId="a" fill={bar.fill} />
                    )
                }
            </BarChart>
        </ResponsiveContainer>
    )
}
