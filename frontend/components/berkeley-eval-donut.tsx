import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BerkeleyEvalRating } from "@/lib/types";

interface BerkeleyEvalDonutProps {
  rating: BerkeleyEvalRating;
}

export default function BerkeleyEvalDonut({ rating }: BerkeleyEvalDonutProps) {
  const data = [
    {
      name: "Overall Rating",
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toFixed(1)}/5.0
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={50}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <p className="text-sm font-medium">Course Ratings</p>
        <p className="text-xs text-muted-foreground">
          {rating.review_count} reviews
        </p>
      </div>
    </div>
  );
} 