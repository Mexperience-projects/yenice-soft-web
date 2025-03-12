"use client";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder,
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`dropdown ${
        isOpen ? "dropdown-open" : ""
      } w-full md:w-[300px] ${className || ""}`}
      ref={dropdownRef}
    >
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy-MM-dd")} -{" "}
                  {format(date.to, "yyyy-MM-dd")}
                </>
              ) : (
                format(date.from, "yyyy-MM-dd")
              )
            ) : (
              <span>{placeholder || t("analytics.filterByDate")}</span>
            )}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="dropdown-content z-[50] bg-base-100 shadow-xl rounded-box p-4 w-auto">
          <DayPicker
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate);
              if (newDate?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            className="rdp-daisy"
          />

          {date && (
            <div className="flex justify-end mt-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  onDateChange(undefined);
                  setIsOpen(false);
                }}
              >
                {t("analytics.clear")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
