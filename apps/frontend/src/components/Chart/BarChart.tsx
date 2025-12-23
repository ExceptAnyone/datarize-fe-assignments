import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '@emotion/react'

/** 차트 기본 높이 (픽셀) */
const DEFAULT_CHART_HEIGHT_PX = 400

/** 바 차트 애니메이션 지속 시간 (밀리초) */
const BAR_ANIMATION_DURATION_MS = 800

export interface BarChartProps {
  /** 차트 데이터 배열 */
  data: Array<Record<string, string | number>>
  /** X축에 표시할 데이터 키 */
  xKey: string
  /** Y축에 표시할 데이터 키 */
  yKey: string
  /** 바 색상 (단일 색상 또는 배열) */
  barColor?: string | string[]
  /** 차트 높이 (px) */
  height?: number
  /** X축 라벨 */
  xLabel?: string
  /** Y축 라벨 */
  yLabel?: string
}

export function BarChart({
  data,
  xKey,
  yKey,
  barColor,
  height = DEFAULT_CHART_HEIGHT_PX,
  xLabel,
  yLabel,
}: BarChartProps) {
  const theme = useTheme()

  const defaultBarColor = theme.colors.primary

  // 색상 배열인 경우 각 바마다 다른 색상 적용
  const isColorArray = Array.isArray(barColor)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        {/* 그리드 */}
        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border.default} opacity={0.3} />

        {/* X축 */}
        <XAxis
          dataKey={xKey}
          stroke={theme.colors.text.secondary}
          style={{
            fontSize: theme.typography.fontSize.sm,
            fill: theme.colors.text.secondary,
          }}
          label={
            xLabel
              ? {
                  value: xLabel,
                  position: 'insideBottom',
                  offset: -10,
                  style: {
                    fill: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                  },
                }
              : undefined
          }
        />

        {/* Y축 */}
        <YAxis
          stroke={theme.colors.text.secondary}
          style={{
            fontSize: theme.typography.fontSize.sm,
            fill: theme.colors.text.secondary,
          }}
          label={
            yLabel
              ? {
                  value: yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: {
                    fill: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                  },
                }
              : undefined
          }
        />

        {/* 툴팁 */}
        <Tooltip
          contentStyle={{
            backgroundColor: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
          }}
          cursor={{ fill: theme.colors.background.secondary }}
        />

        {/* 바 */}
        <Bar
          dataKey={yKey}
          fill={isColorArray ? undefined : barColor || defaultBarColor}
          radius={[8, 8, 0, 0]}
          animationDuration={BAR_ANIMATION_DURATION_MS}
        >
          {isColorArray &&
            data.map((_, index) => <Cell key={`cell-${index}`} fill={barColor[index % barColor.length]} />)}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
