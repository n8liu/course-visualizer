import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BerkeleyEvalRating } from "@/lib/types";

interface BerkeleyEvalBarProps {
  rating: BerkeleyEvalRating;
}

export default function BerkeleyEvalBar({ rating }: BerkeleyEvalBarProps) {
  const data = [
    {
      name: "Overall",
      value: rating.overall_rating,
      color: "#10b981",
    },
    {
      name: "Difficulty",
      value: rating.difficulty,
      color: "#ef4444",
    },
    {
      name: "Workload",
      value: rating.workload,
      color: "#f59e0b",
    },
    {
      name: "Usefulness",
      value: rating.usefulness,
      color: "#3b82f6",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toFixed(1)}/5.0
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-48 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            domain={[0, 5]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 