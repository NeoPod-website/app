"use client";

import { DatePicker } from "@heroui/react";
import { addToast, Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useCallback, useEffect } from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { CalendarIcon, PlusIcon, TrashIcon, CheckIcon } from "lucide-react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminQuestDueDate = () => {
  const dispatch = useDispatch();

  const due_date = useSelector((state) => state.quest.currentQuest.due_date);

  const [isActive, setIsActive] = useState(!!due_date);
  const [selectedDate, setSelectedDate] = useState(
    due_date ? parseDate(due_date.split("T")[0]) : null,
  );

  const [hasChanged, setHasChanged] = useState(false);
  const [originalDate, setOriginalDate] = useState(
    due_date ? parseDate(due_date.split("T")[0]) : null,
  );

  const handleDateChange = useCallback(
    (date) => {
      setSelectedDate(date);

      // Check if date has changed from original
      if (!originalDate && !date) {
        setHasChanged(false);
      } else if (!originalDate && date) {
        setHasChanged(true);
      } else if (originalDate && !date) {
        setHasChanged(true);
      } else if (originalDate && date) {
        // Compare dates
        const isChanged = !(
          originalDate.year === date.year &&
          originalDate.month === date.month &&
          originalDate.day === date.day
        );
        setHasChanged(isChanged);
      } else {
        setHasChanged(false);
      }
    },
    [originalDate],
  );

  const handleAdd = useCallback(() => {
    setIsActive(true);
    setHasChanged(false);

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = new CalendarDate(
      tomorrow.getFullYear(),
      tomorrow.getMonth() + 1,
      tomorrow.getDate(),
    );
    setSelectedDate(defaultDate);
    setOriginalDate(null); // No original date when adding new
    setHasChanged(true); // Show check button immediately for new dates
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      // Convert CalendarDate to ISO string
      const isoString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}T23:59:59.999Z`;

      dispatch(setCurrentQuest({ due_date: isoString }));

      // Update original date and reset changed state
      setOriginalDate(selectedDate);
      setHasChanged(false);

      addToast({
        title: "Due Date Added",
        description: "The due date has been successfully added.",
        color: "default",
      });
    }
  }, [selectedDate, dispatch]);

  const handleRemove = useCallback(() => {
    setIsActive(false);
    setSelectedDate(null);
    setOriginalDate(null);
    setHasChanged(false);

    dispatch(setCurrentQuest({ due_date: null }));
  }, [dispatch]);

  // Update original date when component mounts with existing due_date
  useEffect(() => {
    if (due_date) {
      const existingDate = parseDate(due_date.split("T")[0]);
      setOriginalDate(existingDate);
      setSelectedDate(existingDate);

      setIsActive(true);
      setHasChanged(false);
    } else {
      setOriginalDate(null);
      setSelectedDate(null);

      setIsActive(false);
      setHasChanged(false);
    }
  }, [due_date]);

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-3 flex items-center gap-12">
        <p className="flex w-32 items-center gap-2 text-gray-100">
          <CalendarIcon size={20} />
          Due Date
        </p>

        <Button
          size="lg"
          onPress={handleAdd}
          variant="bordered"
          disabled={isActive}
          className="h-8 w-fit gap-2 rounded border border-gray-400 bg-gradient-dark px-3 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          endContent={<PlusIcon size={16} />}
        >
          Add Due Date
        </Button>
      </div>

      {isActive && (
        <div className="flex items-center gap-3">
          <DatePicker
            size="sm"
            variant="bordered"
            value={selectedDate}
            onChange={handleDateChange}
            aria-label="Quest Due Date"
            placeholderValue={new CalendarDate(2024, 12, 31)}
            className="max-w-xs"
            classNames={{
              inputWrapper:
                "border border-gray-400 bg-gradient-dark text-white",
            }}
          />

          <div className="flex">
            {hasChanged && (
              <Button
                isIconOnly
                onPress={handleConfirm}
                disabled={!selectedDate}
                className="h-8 w-8 min-w-0 bg-green-600/20 text-green-400 hover:bg-green-600/30 hover:text-green-300 disabled:opacity-50"
              >
                <CheckIcon size={16} />
              </Button>
            )}

            <Button
              isIconOnly
              onPress={handleRemove}
              className="h-8 w-8 min-w-0 bg-transparent text-red-700 hover:bg-red-400/10 hover:text-red-500"
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminQuestDueDate);
