"use client";

import { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminDetailHeading = memo(({ name, isNew = false, className = "" }) => {
  const dispatch = useDispatch();

  const currentQuest = useSelector(
    (state) => state.quest.currentQuest,
    shallowEqual,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(
    name || currentQuest.name || "",
  );

  const debounceTimeoutRef = useRef(null);

  // Sync editing state with external changes when not actively editing
  useEffect(() => {
    if (!isEditing) {
      setEditingName(currentQuest.name || name || "");
    }
  }, [currentQuest.name, name, isEditing]);

  const debouncedUpdateName = useCallback(
    (newName) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (newName.trim()) {
          dispatch(setCurrentQuest({ name: newName.trim() }));
        }
      }, 300); // 300ms debounce delay
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
    if (isNew) {
      setIsEditing(true);
    }
  }, [isNew]);

  const handleNameChange = useCallback(
    (e) => {
      const newName = e.target.value;
      setEditingName(newName);
      // Debounce the Redux update while typing
      debouncedUpdateName(newName);
    },
    [debouncedUpdateName],
  );

  const handleNameSubmit = useCallback(() => {
    // Clear any pending debounced updates
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Immediately update on submit/blur
    if (editingName.trim()) {
      dispatch(setCurrentQuest({ name: editingName.trim() }));
    } else {
      // Revert to previous valid name if empty
      setEditingName(currentQuest.name || name || "");
    }
    setIsEditing(false);
  }, [editingName, dispatch, currentQuest.name, name]);

  const handleNameKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleNameSubmit();
      } else if (e.key === "Escape") {
        // Clear pending debounced updates
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        setEditingName(currentQuest.name || name || "");
        setIsEditing(false);
      }
    },
    [handleNameSubmit, currentQuest.name, name],
  );

  const handleNameBlur = useCallback(() => {
    handleNameSubmit();
  }, [handleNameSubmit]);

  const handleInputFocus = useCallback((e) => {
    // Select all text when entering edit mode for better UX
    e.target.select();
  }, []);

  const baseClassName = useMemo(
    () => `mb-6 text-3xl font-bold ${className}`,
    [className],
  );

  const editableClassName = useMemo(
    () => (isNew ? "cursor-pointer hover:text-gray-200 transition-colors" : ""),
    [isNew],
  );

  const displayName = useMemo(
    () => currentQuest.name || name || "Untitled Quest",
    [currentQuest.name, name],
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
      {isNew && isEditing ? (
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
          title={isNew ? "Click to edit name" : ""}
          role={isNew ? "button" : "heading"}
          aria-label={isNew ? "Click to edit quest name" : "Quest name"}
          tabIndex={isNew ? 0 : -1}
        >
          {displayName}
        </h1>
      )}
    </>
  );
});

AdminDetailHeading.displayName = "AdminDetailHeading";

export default AdminDetailHeading;
