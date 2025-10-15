"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToast, Button, DatePicker } from "@heroui/react";
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

  const [selectedTime, setSelectedTime] = useState("23:59");
  const [hasChanged, setHasChanged] = useState(false);
  const [originalDate, setOriginalDate] = useState(
    due_date ? parseDate(due_date.split("T")[0]) : null,
  );
  const [originalTime, setOriginalTime] = useState("23:59");

  const handleDateChange = useCallback(
    (date) => {
      setSelectedDate(date);

      const isDateChanged =
        !originalDate ||
        date.year !== originalDate.year ||
        date.month !== originalDate.month ||
        date.day !== originalDate.day;

      const isTimeChanged = selectedTime !== originalTime;

      setHasChanged(isDateChanged || isTimeChanged);
    },
    [originalDate, originalTime, selectedTime],
  );

  const handleTimeChange = useCallback(
    (e) => {
      const newTime = e.target.value;
      setSelectedTime(newTime);

      const isDateChanged =
        selectedDate &&
        (!originalDate ||
          selectedDate.year !== originalDate.year ||
          selectedDate.month !== originalDate.month ||
          selectedDate.day !== originalDate.day);

      const isTimeChanged = newTime !== originalTime;

      setHasChanged(isDateChanged || isTimeChanged);
    },
    [selectedDate, originalDate, originalTime],
  );

  const handleAdd = useCallback(() => {
    setIsActive(true);
    setHasChanged(false);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = new CalendarDate(
      tomorrow.getFullYear(),
      tomorrow.getMonth() + 1,
      tomorrow.getDate(),
    );

    setSelectedDate(defaultDate);
    setOriginalDate(null);
    setSelectedTime("23:59");
    setOriginalTime("23:59");
    setHasChanged(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      const [hour, minute] = selectedTime.split(":");
      const isoString = `${selectedDate.year}-${String(
        selectedDate.month,
      ).padStart(2, "0")}-${String(selectedDate.day).padStart(
        2,
        "0",
      )}T${hour}:${minute}:00.000Z`;

      dispatch(setCurrentQuest({ due_date: isoString }));

      setOriginalDate(selectedDate);
      setOriginalTime(selectedTime);
      setHasChanged(false);

      addToast({
        title: "Due Date Added",
        description: "The due date and time have been successfully set.",
        color: "default",
      });
    }
  }, [selectedDate, selectedTime, dispatch]);

  const handleRemove = useCallback(() => {
    setIsActive(false);
    setSelectedDate(null);
    setOriginalDate(null);
    setSelectedTime("23:59");
    setOriginalTime("23:59");
    setHasChanged(false);

    dispatch(setCurrentQuest({ due_date: null }));
  }, [dispatch]);

  useEffect(() => {
    if (due_date) {
      const [datePart, timePart] = due_date.split("T");
      const existingDate = parseDate(datePart);
      const existingTime = timePart?.slice(0, 5) || "23:59";

      setOriginalDate(existingDate);
      setSelectedDate(existingDate);
      setOriginalTime(existingTime);
      setSelectedTime(existingTime);

      setIsActive(true);
      setHasChanged(false);
    } else {
      setOriginalDate(null);
      setSelectedDate(null);
      setOriginalTime("23:59");
      setSelectedTime("23:59");

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

          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="h-8 rounded border border-gray-400 bg-gradient-dark px-2 text-white"
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
