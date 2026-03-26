import { useEffect, useRef, useState, useMemo } from "react";
import "./MultiMenuField.css";

function MultiMenuField({
  label,
  filterData,
  setFilterData,
  varName,
  type,
  subType,
  menuData,
  design,
}) {
  const inputRef = useRef(null);
  const mainMenuRef = useRef(null);
  const subMenuRef = useRef(null);

  // raw applied values from filterData
  const appliedTypeId = filterData?.[varName]?.[type] || "";
  const appliedSubTypesRaw = filterData?.[varName]?.[subType] ?? [];

  // normalize applied subtypes to numbers for reliable comparisons
  const normalizeSubTypes = (arr) =>
    (arr || []).map((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v));

  // Memoize appliedSubTypes to prevent unnecessary re-renders
  const appliedSubTypes = useMemo(() => normalizeSubTypes(appliedSubTypesRaw), [appliedSubTypesRaw]);
  
  // Memoize the stringified version for comparison
  const appliedSubTypesKey = useMemo(() => JSON.stringify(appliedSubTypesRaw), [appliedSubTypesRaw]);

  const [categoryId, setCategoryId] = useState(
    appliedTypeId === "" ? "" : (typeof appliedTypeId === "string" ? Number(appliedTypeId) : appliedTypeId)
  );
  const [tempSubTypes, setTempSubTypes] = useState([]);
  const [focus, setFocus] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [highlightedMainIndex, setHighlightedMainIndex] = useState(-1);
  const [highlightedSubIndex, setHighlightedSubIndex] = useState(-1);

  // // Sync when filterData/menuData change
  // useEffect(() => {
  //   const normalizedType = appliedTypeId === "" ? "" : (typeof appliedTypeId === "string" ? Number(appliedTypeId) : appliedTypeId);
  //   setCategoryId(normalizedType);
  //   setTempSubTypes(appliedSubTypes || []);
  // }, [appliedTypeId, appliedSubTypesRaw, menuData]); // note: appliedSubTypesRaw included indirectly

  // If there are applied subtypes but no category set, find the category that contains them
  useEffect(() => {
    if ((appliedSubTypes || []).length > 0 && !categoryId && Array.isArray(menuData)) {
      // try to find a category that contains at least one applied subtype
      const found = menuData.find((cat) =>
        Array.isArray(cat?.sub_categories) &&
        cat.sub_categories.some((sub) => appliedSubTypes.includes(sub.id))
      );
      if (found) {
        setCategoryId(found.id);
      }
      setSubMenu(true); // open submenu if we have applied subtypes
    }
  }, [appliedSubTypes, categoryId, menuData]);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-open submenu on mobile when menu opens
  useEffect(() => {
    if (focus && isMobile && menuData && menuData.length > 0) {
      // If no category is selected, select the first category that has sub_categories
      if (!categoryId) {
        const firstCategoryWithSubs = menuData.find((cat) => 
          Array.isArray(cat?.sub_categories) && cat.sub_categories.length > 0
        );
        if (firstCategoryWithSubs) {
          const firstCategoryId = typeof firstCategoryWithSubs.id === "string" 
            ? Number(firstCategoryWithSubs.id) 
            : firstCategoryWithSubs.id;
          setCategoryId(firstCategoryId);
        }
      }
      // Always open submenu on mobile when menu opens
      setSubMenu(true);
    }
  }, [focus, isMobile, menuData, categoryId]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setFocus(false);
        setHighlightedMainIndex(-1);
        setHighlightedSubIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 Reset highlighted indices when menu state changes
  useEffect(() => {
    if (!focus) {
      setHighlightedMainIndex(-1);
      setHighlightedSubIndex(-1);
    }
  }, [focus]);

  useEffect(() => {
    if (!subMenu) {
      setHighlightedSubIndex(-1);
    }
  }, [subMenu]);

  // Toggle subtype selection locally (ensure IDs are numbers)
  const handleSubTypeChange = (opt) => {
    const optId = typeof opt.id === "string" ? Number(opt.id) : opt.id;
    setTempSubTypes((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
  };

  // Initialize tempSubTypes when menu opens or category changes
  useEffect(() => {
    if (focus && categoryId) {
      // When menu opens, initialize tempSubTypes with currently applied subtypes for this category
      const currentCategory = menuData?.find((item) => item?.id === categoryId);
      if (currentCategory?.sub_categories) {
        const normalizedApplied = normalizeSubTypes(appliedSubTypesRaw);
        const categorySubTypeIds = currentCategory.sub_categories
          .map((sub) => (typeof sub.id === "string" ? Number(sub.id) : sub.id))
          .filter((id) => normalizedApplied.includes(id));
        // Only update if the values actually changed
        setTempSubTypes((prev) => {
          const prevSorted = [...prev].sort((a, b) => a - b);
          const newSorted = [...categorySubTypeIds].sort((a, b) => a - b);
          const prevKey = JSON.stringify(prevSorted);
          const newKey = JSON.stringify(newSorted);
          return prevKey === newKey ? prev : categorySubTypeIds;
        });
      } else {
        setTempSubTypes((prev) => prev.length === 0 ? prev : []);
      }
    } else if (!focus) {
      // Reset tempSubTypes when menu closes
      setTempSubTypes((prev) => prev.length === 0 ? prev : []);
    }
  }, [focus, categoryId, menuData, appliedSubTypesKey]);

  // Change category → reset subtypes (local)
  const handleCategoryChange = (value) => {
    setSubMenu(true);
    setCategoryId(typeof value.id === "string" ? Number(value.id) : value.id);
    setHighlightedMainIndex(-1);
    // Set initial highlight to first item in submenu
    setHighlightedSubIndex(0);
    // Don't clear tempSubTypes here, let useEffect handle it
  };

  // Reset current category selections (local)
  const handleReset = () => {
    setTempSubTypes([]);
  };

  // Apply: write back to filterData (we keep numeric ids)
  const handleApply = () => {
    setFilterData((prev) => ({
      ...prev,
      [varName]: {
        ...(prev?.[varName] || {}),
        [type]: categoryId || "",
        [subType]: [...tempSubTypes],
      },
    }));

    if (tempSubTypes.length > 0) {
      setSubMenu(true);
    } else {
      setSubMenu(false);
      // If no subtypes selected, also clear the category
      setCategoryId("");
    }

    setFocus(false);
  };

  // Helper: check whether a category contains any currently applied subtypes (for highlighting)
  const categoryHasSelectedSubtypes = (cat) => {
    if (!cat?.sub_categories) return false;
    return cat.sub_categories.some((sub) => appliedSubTypes.includes(sub.id));
  };

  // Choose displayed selected values count (from appliedSubTypes)
  const selectedValues = appliedSubTypes || [];

  // Get current category's sub categories for navigation
  const currentCategory = menuData?.find((item) => item?.id === categoryId);
  const currentSubCategories = currentCategory?.sub_categories || [];

  // 🟢 Keyboard navigation handler
  useEffect(() => {
    if (!focus) return;

    const scrollToMainItem = (index) => {
      if (mainMenuRef.current) {
        const menuItems = mainMenuRef.current.querySelectorAll(".menu");
        if (menuItems[index]) {
          menuItems[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    const scrollToSubItem = (index) => {
      if (subMenuRef.current) {
        const menuItems = subMenuRef.current.querySelectorAll(".sub-menu");
        if (menuItems[index]) {
          menuItems[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    const handleKeyDown = (event) => {
      // If submenu is open, navigate in submenu (grid layout: 3 columns)
      if (subMenu && currentSubCategories.length > 0) {
        const gridColumns = 3; // Based on CSS grid-template-columns: repeat(3, 1fr)
        
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedSubIndex((prev) => {
              if (prev < 0) return 0;
              // Move to next row (add 3 columns)
              const nextIndex = prev + gridColumns;
              const finalIndex = nextIndex < currentSubCategories.length ? nextIndex : prev;
              setTimeout(() => scrollToSubItem(finalIndex), 0);
              return finalIndex;
            });
            break;

          case "ArrowUp":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedSubIndex((prev) => {
              if (prev < 0) return 0;
              // Move to previous row (subtract 3 columns)
              const nextIndex = prev - gridColumns;
              const finalIndex = nextIndex >= 0 ? nextIndex : prev;
              setTimeout(() => scrollToSubItem(finalIndex), 0);
              return finalIndex;
            });
            break;

          case "ArrowRight":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedSubIndex((prev) => {
              if (prev < 0) return 0;
              // Move to next column (add 1, wrap at row end)
              const currentRow = Math.floor(prev / gridColumns);
              const currentCol = prev % gridColumns;
              if (currentCol < gridColumns - 1) {
                // Not at end of row, move right
                const nextIndex = prev + 1;
                const finalIndex = nextIndex < currentSubCategories.length ? nextIndex : prev;
                setTimeout(() => scrollToSubItem(finalIndex), 0);
                return finalIndex;
              } else {
                // At end of row, wrap to start of same row
                const wrappedIndex = currentRow * gridColumns;
                setTimeout(() => scrollToSubItem(wrappedIndex), 0);
                return wrappedIndex;
              }
            });
            break;

          case "ArrowLeft":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedSubIndex((prev) => {
              if (prev < 0) return 0;
              // Move to previous column (subtract 1, wrap at row start)
              const currentRow = Math.floor(prev / gridColumns);
              const currentCol = prev % gridColumns;
              if (currentCol > 0) {
                // Not at start of row, move left
                const finalIndex = prev - 1;
                setTimeout(() => scrollToSubItem(finalIndex), 0);
                return finalIndex;
              } else {
                // At start of row, wrap to end of same row
                const rowEnd = Math.min((currentRow + 1) * gridColumns - 1, currentSubCategories.length - 1);
                setTimeout(() => scrollToSubItem(rowEnd), 0);
                return rowEnd;
              }
            });
            break;

          case "Backspace":
            event.preventDefault();
            event.stopPropagation();
            // Go back to main menu
            setSubMenu(false);
            setHighlightedSubIndex(-1);
            if (categoryId) {
              const categoryIndex = menuData?.findIndex((item) => item?.id === categoryId);
              if (categoryIndex >= 0) {
                setHighlightedMainIndex(categoryIndex);
              }
            }
            break;

          case "Enter":
            event.preventDefault();
            event.stopPropagation();
            // Only toggle the highlighted sub-category, don't close
            if (highlightedSubIndex >= 0 && highlightedSubIndex < currentSubCategories.length) {
              const selectedSub = currentSubCategories[highlightedSubIndex];
              handleSubTypeChange(selectedSub);
              // Keep the highlight on the same item
            }
            break;

          case "Escape":
            event.preventDefault();
            event.stopPropagation();
            setFocus(false);
            setHighlightedMainIndex(-1);
            setHighlightedSubIndex(-1);
            break;

          default:
            break;
        }
      } else {
        // Navigate in main menu (vertical list)
        const mainMenuLength = menuData?.length || 0;
        if (mainMenuLength === 0) return;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedMainIndex((prev) => {
              const nextIndex = prev < mainMenuLength - 1 ? prev + 1 : 0;
              setTimeout(() => scrollToMainItem(nextIndex), 0);
              return nextIndex;
            });
            break;

          case "ArrowUp":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedMainIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : mainMenuLength - 1;
              setTimeout(() => scrollToMainItem(nextIndex), 0);
              return nextIndex;
            });
            break;

          case "ArrowRight":
          case "Enter":
            event.preventDefault();
            event.stopPropagation();
            if (highlightedMainIndex >= 0 && highlightedMainIndex < mainMenuLength) {
              const selectedCategory = menuData[highlightedMainIndex];
              handleCategoryChange(selectedCategory);
              setHighlightedMainIndex(-1);
            }
            break;

          case "ArrowLeft":
            event.preventDefault();
            event.stopPropagation();
            // Same as ArrowUp for vertical list
            setHighlightedMainIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : mainMenuLength - 1;
              setTimeout(() => scrollToMainItem(nextIndex), 0);
              return nextIndex;
            });
            break;

          case "Escape":
            event.preventDefault();
            event.stopPropagation();
            setFocus(false);
            setHighlightedMainIndex(-1);
            setHighlightedSubIndex(-1);
            break;

          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focus, subMenu, highlightedMainIndex, highlightedSubIndex, menuData, currentSubCategories, categoryId, handleApply, handleSubTypeChange, handleCategoryChange]);

  return (
    <div
      className={
        design === "simple"
          ? focus || appliedTypeId
            ? "multi-input-field focus simple-design"
            : "multi-input-field simple-design"
          : focus || selectedValues.length > 0
            ? "multi-input-field focus"
            : "multi-input-field"
      }
      ref={inputRef}
    >
      <div className="new-parent" onClick={() => {
        setFocus(!focus);
        if (!focus) {
          setHighlightedMainIndex(-1);
          setHighlightedSubIndex(-1);
        }
      }}>
        <label>{label}</label>
        <div className="input-value">
          {focus && selectedValues.length === 0
            ? "Select Value"
            : selectedValues.length > 0
              ? `${selectedValues.length} value${selectedValues.length > 1 ? "s" : ""
              } selected`
              : ""}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
        >
          {focus ? (
            <>
              <rect
                width="18.8657"
                height="20"
                transform="translate(0.716309 0.714294)"
                fill="white"
              />
              <path
                d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572"
                stroke="#698B75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <path
              d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712"
              stroke="#737678"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      {/* MAIN MENU */}
      {focus && (
        <div className="menu-box" ref={mainMenuRef}>
          {menuData?.map((value, index) => {
            // category considered selected if it's the currently chosen category OR it contains applied subtypes
            // but only show selection when there are actual applied values or when focused with a category selected
            const isSelected =
              focus && (
                (categoryId !== "" && categoryId === (typeof value.id === "string" ? Number(value.id) : value.id)) ||
                (selectedValues.length > 0 && categoryHasSelectedSubtypes(value))
              );
            const isHighlighted = highlightedMainIndex === index;

            return (
              <div
                key={index}
                className={`menu ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""} ${isSelected && isHighlighted ? "selected-highlighted" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryChange(value);
                }}
                onMouseEnter={() => setHighlightedMainIndex(index)}
              >
                {value.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                >
                  <path
                    d="M0.857422 9.47559L5.14314 5.43294L0.857423 1.3903"
                    stroke="#2D2D2D"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB MENU */}
      {focus && subMenu && (
        <div className="sub-menu-box">
          <div className="menu-tabs" ref={subMenuRef}>
            {menuData
              ?.find((item) => item?.id === categoryId)
              ?.sub_categories?.map((opt, index) => {
                const optId = typeof opt.id === "string" ? Number(opt.id) : opt.id;
                // Only use tempSubTypes for visual selection, not appliedSubTypes
                const isSelected = tempSubTypes.includes(optId);
                const isHighlighted = highlightedSubIndex === index;
                return (
                  <div
                    key={opt?.id}
                    className={`sub-menu ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""} ${isSelected && isHighlighted ? "selected-highlighted" : ""}`}
                    onClick={() => handleSubTypeChange(opt)}
                    onMouseEnter={() => setHighlightedSubIndex(index)}
                  >
                    {opt?.name}
                  </div>
                );
              })}
          </div>

          <div className="btn-box">
            <div className="button btn-secondary-text-button" onClick={handleReset}>
              Reset
            </div>
            <div className="button btn-primary-button" onClick={handleApply}>
              Apply
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiMenuField;
