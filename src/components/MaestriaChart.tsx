'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { StatsByString } from '@/types';

interface MaestriaChartProps {
  byString: StatsByString;
}

const STRING_LABELS: Record<number, string> = {
  1: 'Corda 1 (Mi)',
  2: 'Corda 2 (Si)',
  3: 'Corda 3 (Sol)',
  4: 'Corda 4 (Ré)',
  5: 'Corda 5 (Lá)',
  6: 'Corda 6 (Mi)',
};

const MaestriaChart = ({ byString }: MaestriaChartProps) => {
  const data = [1, 2, 3, 4, 5, 6].map((stringNum) => {
    const { correct, total } = byString[stringNum] ?? { correct: 0, total: 0 };
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      stringNum,
      name: STRING_LABELS[stringNum] ?? `Corda ${stringNum}`,
      acertos: correct,
      total,
      pct,
    };
  });

  return (
    <div className="w-full h-64 sm:h-80" role="img" aria-label="Gráfico de maestria por corda">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={{ stroke: '#52525b' }}
            axisLine={{ stroke: '#52525b' }}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={{ stroke: '#52525b' }}
            axisLine={{ stroke: '#52525b' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#262626',
              border: '1px solid #52525b',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#a1a1aa' }}
            formatter={(value, _name, props) => {
              const payload = props?.payload as { acertos: number; total: number; pct: number } | undefined;
              if (!payload) return [value ?? 0, 'Acertos'];
              return [`${payload.acertos} acertos de ${payload.total} (${payload.pct}%)`, 'Maestria'];
            }}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="acertos" name="Acertos" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.total === 0 ? '#3f3f46' : entry.pct >= 80 ? '#22c55e' : entry.pct >= 50 ? '#eab308' : '#e11d48'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaestriaChart;
