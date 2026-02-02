import { useState } from 'react';
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import type { Flight } from '../../types';
import { formatPrice, formatDateShort } from '../../utils/formatters';
import Icon from '../common/Icon';

interface PriceTrendChartProps {
  flights: Flight[];
  dateRange?: {
    start: string;
    end: string;
  };
  variant?: 'desktop' | 'mobile';
}

interface ChartDataPoint {
  date: string;
  price: number;
  displayDate: string;
}

/**
 * Generate chart data from flights
 * Groups flights by date and finds lowest price per day
 */
function generateChartData(flights: Flight[]): ChartDataPoint[] {
  if (flights.length === 0) {
    return [];
  }

  // Group flights by date
  const pricesByDate = new Map<string, number[]>();

  flights.forEach((flight) => {
    const date = flight.departureTime.split('T')[0]; // Get YYYY-MM-DD
    if (!pricesByDate.has(date)) {
      pricesByDate.set(date, []);
    }
    pricesByDate.get(date)!.push(flight.price);
  });

  // If only one day, generate mock trend data for visual interest
  if (pricesByDate.size === 1) {
    const [singleDate, prices] = Array.from(pricesByDate.entries())[0];
    const basePrice = Math.min(...prices);
    const date = new Date(singleDate);

    // Generate 7 days of mock data around this price
    const mockData: ChartDataPoint[] = [];
    for (let i = -3; i <= 3; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Add variation to price (±10%)
      const variation = (Math.random() - 0.5) * 0.2;
      const price = Math.round(basePrice * (1 + variation));

      mockData.push({
        date: dateStr,
        price,
        displayDate: formatDateShort(currentDate.toISOString()),
      });
    }

    return mockData.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Convert to chart data points with lowest price per day
  const chartData: ChartDataPoint[] = Array.from(pricesByDate.entries())
    .map(([date, prices]) => ({
      date,
      price: Math.min(...prices),
      displayDate: formatDateShort(new Date(date).toISOString()),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
}

/**
 * Calculate price statistics
 */
function calculateStats(flights: Flight[]) {
  if (flights.length === 0) {
    return { lowestPrice: 0, averagePrice: 0, percentDrop: 0 };
  }

  const prices = flights.map((f) => f.price);
  const lowestPrice = Math.min(...prices);
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const percentDrop = Math.round(((averagePrice - lowestPrice) / averagePrice) * 100);

  return { lowestPrice, averagePrice, percentDrop };
}

/**
 * Custom tooltip for the chart
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>
          {data.displayDate}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#135bec' }}>
          {formatPrice(data.price)}
        </Typography>
      </Box>
    );
  }
  return null;
}

function PriceTrendChart({ flights, dateRange, variant = 'desktop' }: PriceTrendChartProps) {
  const [expanded, setExpanded] = useState(true);

  const chartData = generateChartData(flights);
  const stats = calculateStats(flights);

  // Find the lowest price point for highlighting
  const lowestDataPoint = chartData.reduce(
    (min, point) => (point.price < min.price ? point : min),
    chartData[0] || { price: Infinity, date: '', displayDate: '' }
  );

  // Date range text
  const dateRangeText = dateRange
    ? `Prices for ${formatDateShort(dateRange.start)} - ${formatDateShort(dateRange.end)}`
    : chartData.length > 0
    ? `Prices for ${chartData[0].displayDate} - ${chartData[chartData.length - 1].displayDate}`
    : 'Price Trend';

  // Chart component
  const ChartComponent = (
    <ResponsiveContainer width="100%" height={variant === 'desktop' ? 140 : 96}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#135bec" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#135bec" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" stroke="transparent" />
        <XAxis
          dataKey="displayDate"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          dy={10}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#135bec', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#135bec"
          strokeWidth={2.5}
          fill="url(#priceGradient)"
          animationDuration={500}
        />
        {/* Highlight dot on lowest price */}
        {lowestDataPoint && (
          <ReferenceDot
            x={lowestDataPoint.displayDate}
            y={lowestDataPoint.price}
            r={5}
            fill="#135bec"
            stroke="#ffffff"
            strokeWidth={2}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  // Desktop variant
  if (variant === 'desktop') {
    return (
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'flex-end' },
            justifyContent: 'space-between',
            marginBottom: '16px',
            gap: '16px',
          }}
        >
          <Box>
            {/* Label */}
            <Typography
              sx={{
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Price Trend
            </Typography>

            {/* Lowest price + badge */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <Typography
                component="h3"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                Lowest: {formatPrice(stats.lowestPrice)}
              </Typography>

              {stats.percentDrop > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#16a34a',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  <Icon name="trending_down" className="trend-icon" />
                  <style>
                    {`
                      .trend-icon {
                        font-size: 14px !important;
                        margin-right: 4px;
                      }
                    `}
                  </style>
                  {stats.percentDrop}% drop
                </Box>
              )}
            </Box>

            {/* Date range */}
            <Typography
              sx={{
                color: '#9ca3af',
                fontSize: '0.875rem',
                marginTop: '4px',
              }}
            >
              {dateRangeText}
            </Typography>
          </Box>

          {/* View Calendar Button */}
          <Button
            sx={{
              color: '#135bec',
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'none',
              padding: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            View Full Calendar
          </Button>
        </Box>

        {/* Chart */}
        {ChartComponent}
      </Box>
    );
  }

  // Mobile variant (collapsible)
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Icon name="expand_more" className="expand-icon" />
        }
        sx={{
          padding: '12px 16px',
          minHeight: 'auto',
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: '#9ca3af',
          },
        }}
      >
        <style>
          {`
            .expand-icon {
              font-size: 20px !important;
              transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}
        </style>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Icon */}
          <Box
            sx={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(19, 91, 236, 0.1)',
              color: '#135bec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="show_chart" className="chart-icon" />
            <style>
              {`
                .chart-icon {
                  font-size: 20px !important;
                }
              `}
            </style>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            Price Trend
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          padding: '8px 16px 20px 16px',
        }}
      >
        {/* Price info */}
        <Box sx={{ marginBottom: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              Lowest: {formatPrice(stats.lowestPrice)}
            </Typography>

            {stats.percentDrop > 0 && (
              <Typography
                sx={{
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                ↘ {stats.percentDrop}% drop
              </Typography>
            )}
          </Box>
        </Box>

        {/* Chart */}
        {ChartComponent}
      </AccordionDetails>
    </Accordion>
  );
}

export default PriceTrendChart;
