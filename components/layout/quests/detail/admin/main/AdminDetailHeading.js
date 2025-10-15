"use client";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminDetailHeading = memo(({ name, isNew = false, className = "" }) => {
  const dispatch = useDispatch();

  const currentQuest = useSelector(
    (state) => state.quest.currentQuest,
    shallowEqual,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(
    name || currentQuest?.name || "",
  );

  const debounceTimeoutRef = useRef(null);

  // Sync editing state with external changes when not actively editing
  useEffect(() => {
    if (!isEditing) {
      setEditingName(currentQuest?.name || name || "");
    }
  }, [currentQuest?.name, name, isEditing]);

  const debouncedUpdateName = useCallback(
    (newName) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (newName.trim()) {
          dispatch(setCurrentQuest({ name: newName.trim() }));
        }
      }, 300);
    },
    [dispatch],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleNameClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleNameChange = useCallback(
    (e) => {
      const newName = e.target.value;
      setEditingName(newName);
      debouncedUpdateName(newName);
    },
    [debouncedUpdateName],
  );

  const handleNameSubmit = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (editingName.trim()) {
      dispatch(setCurrentQuest({ name: editingName.trim() }));
    } else {
      setEditingName(currentQuest?.name || name || "");
    }
    setIsEditing(false);
  }, [editingName, dispatch, currentQuest?.name, name]);

  const handleNameKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleNameSubmit();
      } else if (e.key === "Escape") {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        setEditingName(currentQuest?.name || name || "");
        setIsEditing(false);
      }
    },
    [handleNameSubmit, currentQuest?.name, name],
  );

  const handleNameBlur = useCallback(() => {
    handleNameSubmit();
  }, [handleNameSubmit]);

  const handleInputFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const baseClassName = useMemo(
    () => `mb-6 text-3xl font-bold ${className}`,
    [className],
  );

  const editableClassName = useMemo(
    () => "cursor-pointer hover:text-gray-200 transition-colors",
    [],
  );

  const displayName = useMemo(
    () => currentQuest?.name || name || "Your New Quest Name",
    [currentQuest?.name, name],
  );

  const inputClassName = useMemo(
    () =>
      `${baseClassName} w-full border-b-2 border-gray-300 bg-transparent outline-none focus:border-[#FF006B]`,
    [baseClassName],
  );

  const headingClassName = useMemo(
    () => `${baseClassName} ${editableClassName}`,
    [baseClassName, editableClassName],
  );

  return (
    <>
      {isEditing ? (
        <input
          type="text"
          value={editingName}
          onChange={handleNameChange}
          onKeyDown={handleNameKeyDown}
          onBlur={handleNameBlur}
          onFocus={handleInputFocus}
          className={inputClassName}
          placeholder="Enter quest name..."
          aria-label="Quest name"
          role="textbox"
          autoFocus
        />
      ) : (
        <h1
          className={headingClassName}
          onClick={handleNameClick}
          tabIndex={0}
          role="button"
          title="Click to edit name"
          aria-label="Click to edit quest name"
        >
          {displayName}
        </h1>
      )}
    </>
  );
});

AdminDetailHeading.displayName = "AdminDetailHeading";

export default AdminDetailHeading;
