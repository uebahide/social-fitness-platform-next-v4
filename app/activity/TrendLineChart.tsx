import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const TrendLineChart = ({
  trendData,
}: {
  trendData: { name: string; distance: number }[];
}) => {
  return (
    <LineChart width={400} height={250} data={trendData} className="">
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />
      <YAxis />

      <Tooltip />
      <Legend />

      <Line
        type="monotone"
        dataKey="distance"
        stroke="#8884d8"
        strokeWidth={2}
      />
    </LineChart>
  );
};
