import { useRef, useState, useEffect } from "react";
import { Box, ClickAwayListener, Portal } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Icon from "../common/Icon";
import { formatDate, formatDateWithDay } from "../../utils/formatters";

interface DatePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  icon?: string;
  variant?: "desktop" | "mobile";
  departureDate?: Date | null;
  returnDate?: Date | null;
}

function DatePickerInput({
  label,
  value,
  onChange,
  placeholder = "Add date",
  minDate,
  icon,
  variant = "desktop",
  departureDate,
  returnDate,
}: DatePickerInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClick = () => {
    setOpen(true);
  };

  const handleDateChange = (newDate: Date | null) => {
    // Validate date before passing to parent
    const validDate = newDate instanceof Date && !isNaN(newDate.getTime()) ? newDate : null;
    onChange(validDate);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Validate the value prop
  const safeValue = value instanceof Date && !isNaN(value.getTime()) ? value : null;
  const safeMinDate = minDate instanceof Date && !isNaN(minDate.getTime()) ? minDate : undefined;

  // Calculate position when opening the calendar
  useEffect(() => {
    if (open && inputRef.current && variant === "desktop") {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4 + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, variant]);

  const displayValue = safeValue
    ? variant === "mobile"
      ? formatDateWithDay(safeValue.toISOString())
      : formatDate(safeValue.toISOString())
    : "";

  // Custom day component for range highlighting
  const CustomDay = (props: PickersDayProps) => {
    const { day, ...other } = props;

    if (!departureDate || !returnDate || !day) {
      return <PickersDay day={day} {...other} />;
    }

    // Normalize dates to compare only year, month, and day (ignore time)
    const dayTime = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    const departureTime = new Date(
      departureDate.getFullYear(),
      departureDate.getMonth(),
      departureDate.getDate()
    ).getTime();
    const returnTime = new Date(
      returnDate.getFullYear(),
      returnDate.getMonth(),
      returnDate.getDate()
    ).getTime();

    // Check if this day is the departure date
    const isDeparture = dayTime === departureTime;
    // Check if this day is the return date
    const isReturn = dayTime === returnTime;
    // Check if this day is between departure and return
    const isBetween = dayTime > departureTime && dayTime < returnTime;

    return (
      <PickersDay
        {...other}
        day={day}
        sx={{
          ...(isDeparture && {
            backgroundColor: "#135bec !important",
            color: "#ffffff !important",
            "&:hover": {
              backgroundColor: "#0e4bce !important",
            },
          }),
          ...(isReturn && {
            backgroundColor: "transparent !important",
            color: "#135bec !important",
            border: "2px solid #135bec !important",
            "&:hover": {
              backgroundColor: "rgba(19, 91, 236, 0.08) !important",
            },
          }),
          ...(isBetween && {
            backgroundColor: "rgba(19, 91, 236, 0.12) !important",
            color: "#111318 !important",
            borderRadius: "0 !important",
            "&:hover": {
              backgroundColor: "rgba(19, 91, 236, 0.2) !important",
            },
          }),
        }}
      />
    );
  };

  if (variant === "mobile") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Label */}
        <Box
          component="label"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#64748b",
            marginBottom: "4px",
            marginLeft: "4px",
          }}>
          {label}
        </Box>

        {/* Input container */}
        <Box
          ref={inputRef}
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            height: "48px",
            paddingX: "12px",
            backgroundColor: "#f9fafb",
            border: `1px solid ${open ? "#135bec" : "#e5e7eb"}`,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}>
          {icon && (
            <>
              <Icon name={icon} size="md" className="date-icon-mobile" />
              <style>
                {`
                  .date-icon-mobile {
                    color: #94a3b8;
                    margin-right: 8px;
                  }
                `}
              </style>
            </>
          )}

          {/* Display value */}
          <Box
            component="span"
            sx={{
              flex: 1,
              fontSize: "0.875rem",
              fontWeight: 600,
              color: safeValue ? "#111318" : "#94a3b8",
            }}>
            {displayValue || placeholder}
          </Box>
        </Box>

        {/* Calendar Popup */}
        {open && (
          <ClickAwayListener onClickAway={handleClose}>
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1400,
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "& .MuiDateCalendar-root": {
                  maxHeight: "none",
                },
              }}>
              <DateCalendar
                value={safeValue}
                onChange={handleDateChange}
                minDate={safeMinDate}
                slots={{
                  day: CustomDay,
                }}
                sx={{
                  "& .MuiPickersDay-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#135bec",
                      "&:hover": {
                        backgroundColor: "#0d47a1",
                      },
                    },
                  },
                }}
              />
            </Box>
          </ClickAwayListener>
        )}

        {/* Backdrop */}
        {open && (
          <Box
            onClick={handleClose}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1300,
            }}
          />
        )}
      </Box>
    );
  }

  // Desktop variant
  return (
    <>
      <Box
        ref={inputRef}
        onClick={handleClick}
        sx={{
          position: "relative",
          backgroundColor: "#ffffff",
          height: "68px",
          cursor: "pointer",
          transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
          border: open ? "2px solid #135bec" : "none",
          borderRadius: open ? "12px" : "0",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
        }}>
        {/* Floating label */}
        <Box
          component="label"
          sx={{
            position: "absolute",
            left: "16px",
            top: "10px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#616f89",
            pointerEvents: "none",
          }}>
          {label}
        </Box>

        {/* Display value */}
        <Box
          component="div"
          sx={{
            width: "100%",
            height: "100%",
            paddingLeft: "16px",
            paddingRight: "8px",
            paddingTop: "32px",
            paddingBottom: "8px",
            display: "flex",
            alignItems: "flex-end",
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: safeValue ? "#111318" : "#9ca3af",
          }}>
          {displayValue || placeholder}
        </Box>
      </Box>

      {/* Calendar Popup - rendered in Portal at document body */}
      {open && (
        <Portal>
          <ClickAwayListener onClickAway={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 1400,
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border: "1px solid #e5e7eb",
                "& .MuiDateCalendar-root": {
                  maxHeight: "none",
                },
              }}>
              <DateCalendar
                value={safeValue}
                onChange={handleDateChange}
                minDate={safeMinDate}
                slots={{
                  day: CustomDay,
                }}
                sx={{
                  "& .MuiPickersDay-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#135bec",
                      "&:hover": {
                        backgroundColor: "#0d47a1",
                      },
                    },
                  },
                }}
              />
            </Box>
          </ClickAwayListener>
        </Portal>
      )}
    </>
  );
}

export default DatePickerInput;
