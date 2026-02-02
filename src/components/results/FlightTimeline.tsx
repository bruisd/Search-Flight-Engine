import { Box, Typography } from '@mui/material';
import Icon from '../common/Icon';
import { formatDuration } from '../../utils/formatters';

interface FlightTimelineProps {
  duration: number; // in minutes
  stops: number; // 0, 1, 2+
  stopLocations?: readonly string[]; // ["BOS"] or ["BOS", "FRA"]
  variant?: 'desktop' | 'mobile';
}

function FlightTimeline({
  duration,
  stops,
  stopLocations = [],
  variant = 'desktop',
}: FlightTimelineProps) {
  const durationText = formatDuration(duration);
  const isDirect = stops === 0;

  // Stop label text
  const getStopLabel = (): { text: string; color: string } => {
    if (stops === 0) {
      return {
        text: variant === 'mobile' ? 'Non-stop' : 'Direct',
        color: '#16a34a', // green-600
      };
    }

    if (stops === 1 && stopLocations.length > 0) {
      if (variant === 'mobile') {
        // On mobile, show layover time if available (placeholder for now)
        return {
          text: `1 Stop (${stopLocations[0]})`,
          color: '#ef4444', // red-500
        };
      }
      return {
        text: `1 Stop (${stopLocations[0]})`,
        color: '#6b7280', // gray-500
      };
    }

    if (stops === 1) {
      return {
        text: '1 Stop',
        color: variant === 'mobile' ? '#ef4444' : '#6b7280',
      };
    }

    return {
      text: `${stops} Stops`,
      color: '#6b7280', // gray-500
    };
  };

  const stopLabel = getStopLabel();

  // Desktop variant
  if (variant === 'desktop') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {/* Duration text */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            fontWeight: 500,
          }}
        >
          {durationText}
        </Typography>

        {/* Timeline */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '4px',
          }}
        >
          {/* Line with dots */}
          <Box
            sx={{
              position: 'relative',
              height: '2px',
              width: '100%',
              backgroundColor: '#e5e7eb', // gray-200
            }}
          >
            {/* Start dot */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db', // gray-300
              }}
            />

            {/* Stop dots */}
            {stops === 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444', // red-500
                  border: '1px solid #ffffff',
                  zIndex: 10,
                }}
              />
            )}

            {stops === 2 && (
              <>
                {/* First stop at 1/3 */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '33.33%',
                    transform: 'translate(-50%, -50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444', // red-500
                    border: '1px solid #ffffff',
                    zIndex: 10,
                  }}
                />
                {/* Second stop at 2/3 */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '66.67%',
                    transform: 'translate(-50%, -50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444', // red-500
                    border: '1px solid #ffffff',
                    zIndex: 10,
                  }}
                />
              </>
            )}

            {stops > 2 && (
              // Multiple stops - show dots evenly distributed
              Array.from({ length: stops }).map((_, index) => {
                const position = ((index + 1) / (stops + 1)) * 100;
                return (
                  <Box
                    key={index}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: `${position}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444', // red-500
                      border: '1px solid #ffffff',
                      zIndex: 10,
                    }}
                  />
                );
              })
            )}

            {/* End dot */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db', // gray-300
              }}
            />
          </Box>

          {/* Flight icon */}
          <Icon
            name="flight"
            size="sm"
            className={`flight-icon-timeline ${isDirect ? 'direct' : 'stops'}`}
          />
          <style>
            {`
              .flight-icon-timeline {
                font-size: 14px !important;
                transform: rotate(90deg);
              }
              .flight-icon-timeline.direct {
                color: #135bec;
              }
              .flight-icon-timeline.stops {
                color: #9ca3af;
              }
            `}
          </style>
        </Box>

        {/* Stop label */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: stopLabel.color,
            fontWeight: isDirect ? 700 : 500,
          }}
        >
          {stopLabel.text}
        </Typography>
      </Box>
    );
  }

  // Mobile variant
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingX: '16px',
      }}
    >
      {/* Duration text */}
      <Typography
        sx={{
          fontSize: '10px',
          color: '#6b7280', // gray-500
          fontWeight: 500,
          marginBottom: '4px',
        }}
      >
        {durationText}
      </Typography>

      {/* Timeline */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Start dot */}
        <Box
          sx={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db', // gray-300
          }}
        />

        {/* First line segment */}
        <Box
          sx={{
            flex: 1,
            height: '2px',
            backgroundColor: '#d1d5db', // gray-300
            marginX: '4px',
          }}
        />

        {/* Stop indicator for 1 stop (hollow circle) */}
        {stops === 1 && (
          <>
            <Box
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: '2px solid #ef4444', // red-500
                backgroundColor: '#ffffff',
              }}
            />
            <Box
              sx={{
                flex: 1,
                height: '2px',
                backgroundColor: '#d1d5db', // gray-300
                marginX: '4px',
              }}
            />
          </>
        )}

        {/* Flight icon */}
        <Icon name="flight" size="sm" className="flight-icon-mobile" />
        <style>
          {`
            .flight-icon-mobile {
              font-size: 16px !important;
              color: #9ca3af;
              transform: rotate(90deg);
            }
          `}
        </style>

        {/* Second line segment */}
        <Box
          sx={{
            flex: 1,
            height: '2px',
            backgroundColor: '#d1d5db', // gray-300
            marginX: '4px',
          }}
        />

        {/* End dot */}
        <Box
          sx={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db', // gray-300
          }}
        />
      </Box>

      {/* Stop label */}
      <Typography
        sx={{
          fontSize: '10px',
          color: stopLabel.color,
          fontWeight: 700,
          marginTop: '4px',
        }}
      >
        {stopLabel.text}
      </Typography>
    </Box>
  );
}

export default FlightTimeline;
