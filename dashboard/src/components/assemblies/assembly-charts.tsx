import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StatusBreakdown } from "../../lib/types";

const COLORS = ["#00e5ff", "#ffab00", "#ff1744", "#00e676"];

interface AssemblyChartsProps {
  data: StatusBreakdown[];
}

export const AssemblyCharts = ({ data }: AssemblyChartsProps) => {
  const pieData = data.map((d) => ({
    name: d.label,
    value: d.total,
    color: d.color,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Type Distribution */}
      <div className="glass-card p-4">
        <p className="text-xs text-secondary uppercase tracking-wider mb-3">
          Type Distribution
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, i) => (
                <Cell key={entry.name} fill={entry.color || COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0c1220",
                border: "1px solid rgba(0, 229, 255, 0.2)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e8eaf6",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: d.color }}
              />
              <span className="text-[10px] text-muted">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Online vs Offline */}
      <div className="glass-card p-4">
        <p className="text-xs text-secondary uppercase tracking-wider mb-3">
          Online / Offline
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" barGap={2}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={60}
              tick={{ fill: "#7986cb", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0c1220",
                border: "1px solid rgba(0, 229, 255, 0.2)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e8eaf6",
              }}
            />
            <Bar dataKey="online" fill="#00e676" radius={[0, 4, 4, 0]} barSize={12} name="Online" />
            <Bar dataKey="offline" fill="#37474f" radius={[0, 4, 4, 0]} barSize={12} name="Offline" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
