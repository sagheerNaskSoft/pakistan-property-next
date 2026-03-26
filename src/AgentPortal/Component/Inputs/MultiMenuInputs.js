import React, { useState, useRef, useEffect } from "react";
import "./Inputs.css";

function MultiMenuInputs({ label, width, data, setData, varName, type, subType, menuData, errors }) {
  const [menu, setMenu] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [selectedParent, setSelectedParent] = useState("");
  const [tempSubType, setTempSubType] = useState(data?.[varName]?.[subType] || ""); // single value
  const [highlightedParentIndex, setHighlightedParentIndex] = useState(-1);
  const [highlightedSubIndex, setHighlightedSubIndex] = useState(-1);

  const inputRef = useRef(null);
  const parentMenuRef = useRef(null);
  const subMenuRef = useRef(null);
  const highlightedParentIndexRef = useRef(-1);
  const highlightedSubIndexRef = useRef(-1);

  // Update refs when highlighted indices change
  useEffect(() => {
    highlightedParentIndexRef.current = highlightedParentIndex;
  }, [highlightedParentIndex]);

  useEffect(() => {
    highlightedSubIndexRef.current = highlightedSubIndex;
  }, [highlightedSubIndex]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setMenu(false);
        setSubMenu(false);
        setHighlightedParentIndex(-1);
        setHighlightedSubIndex(-1);
        highlightedParentIndexRef.current = -1;
        highlightedSubIndexRef.current = -1;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Sync temp state when menu opens
  useEffect(() => {
    if (menu) {
      const savedParent = data?.[varName]?.[type] || "";
      const savedSubType = data?.[varName]?.[subType] || "";

      setTempSubType(savedSubType);
      setSelectedParent(savedParent);
      // ✅ Keep submenu open if both parent & sub option exist
      if (savedParent && savedSubType) {
        setSubMenu(true);
      } else {
        setSubMenu(false);
      }
      // Reset highlighted indices when menu opens
      setHighlightedParentIndex(-1);
      setHighlightedSubIndex(-1);
      highlightedParentIndexRef.current = -1;
      highlightedSubIndexRef.current = -1;
    }
  }, [menu, data, varName, subType, type]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!menu) return;

    const scrollToParentOption = (index) => {
      if (parentMenuRef.current) {
        const menuItems = parentMenuRef.current.querySelectorAll(".menu");
        if (menuItems[index]) {
          menuItems[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    const scrollToSubOption = (index) => {
      if (subMenuRef.current) {
        const subMenuItems = subMenuRef.current.querySelectorAll(".sub-menu");
        if (subMenuItems[index]) {
          subMenuItems[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    const handleKeyDown = (event) => {
      // If submenu is open, handle submenu navigation (grid layout: 3 columns)
      if (subMenu) {
        const currentParent = menuData?.find((item) => item?.id === selectedParent);
        const subCategories = currentParent?.sub_categories || [];
        const subOptionsLength = subCategories.length;
        const gridColumns = 3; // Based on CSS grid layout

        if (subOptionsLength === 0) return;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedSubIndex((prev) => {
              if (prev < 0) return 0;
              // Move to next row (add 3 columns)
              const nextIndex = prev + gridColumns;
              const finalIndex = nextIndex < subOptionsLength ? nextIndex : prev;
              highlightedSubIndexRef.current = finalIndex;
              setTimeout(() => scrollToSubOption(finalIndex), 0);
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
              highlightedSubIndexRef.current = finalIndex;
              setTimeout(() => scrollToSubOption(finalIndex), 0);
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
                const finalIndex = nextIndex < subOptionsLength ? nextIndex : prev;
                highlightedSubIndexRef.current = finalIndex;
                setTimeout(() => scrollToSubOption(finalIndex), 0);
                return finalIndex;
              } else {
                // At end of row, wrap to start of same row
                const wrappedIndex = currentRow * gridColumns;
                highlightedSubIndexRef.current = wrappedIndex;
                setTimeout(() => scrollToSubOption(wrappedIndex), 0);
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
                highlightedSubIndexRef.current = finalIndex;
                setTimeout(() => scrollToSubOption(finalIndex), 0);
                return finalIndex;
              } else {
                // At start of row, wrap to end of same row
                const rowEnd = Math.min((currentRow + 1) * gridColumns - 1, subOptionsLength - 1);
                highlightedSubIndexRef.current = rowEnd;
                setTimeout(() => scrollToSubOption(rowEnd), 0);
                return rowEnd;
              }
            });
            break;

          case "Enter":
            event.preventDefault();
            event.stopPropagation();
            const currentSubIndex = highlightedSubIndexRef.current;
            if (currentSubIndex >= 0 && currentSubIndex < subOptionsLength) {
              handleSubTypeChange(subCategories[currentSubIndex]);
            }
            break;

          case "Escape":
            event.preventDefault();
            event.stopPropagation();
            setMenu(false);
            setSubMenu(false);
            setHighlightedParentIndex(-1);
            setHighlightedSubIndex(-1);
            highlightedParentIndexRef.current = -1;
            highlightedSubIndexRef.current = -1;
            break;

          default:
            break;
        }
      } else {
        // Handle parent menu navigation
        const parentOptionsLength = menuData?.length || 0;
        if (parentOptionsLength === 0) return;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedParentIndex((prev) => {
              const nextIndex = prev < parentOptionsLength - 1 ? prev + 1 : 0;
              highlightedParentIndexRef.current = nextIndex;
              setTimeout(() => scrollToParentOption(nextIndex), 0);
              return nextIndex;
            });
            break;

          case "ArrowUp":
            event.preventDefault();
            event.stopPropagation();
            setHighlightedParentIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : parentOptionsLength - 1;
              highlightedParentIndexRef.current = nextIndex;
              setTimeout(() => scrollToParentOption(nextIndex), 0);
              return nextIndex;
            });
            break;

          case "ArrowRight":
          case "Enter":
            event.preventDefault();
            event.stopPropagation();
            const currentParentIndex = highlightedParentIndexRef.current;
            if (currentParentIndex >= 0 && currentParentIndex < parentOptionsLength) {
              const selectedItem = menuData[currentParentIndex];
              setSelectedParent(selectedItem?.id);
              setSubMenu(true);
              setHighlightedParentIndex(-1);
              setHighlightedSubIndex(-1);
              highlightedParentIndexRef.current = -1;
              highlightedSubIndexRef.current = -1;
            }
            break;

          case "Escape":
            event.preventDefault();
            event.stopPropagation();
            setMenu(false);
            setSubMenu(false);
            setHighlightedParentIndex(-1);
            setHighlightedSubIndex(-1);
            highlightedParentIndexRef.current = -1;
            highlightedSubIndexRef.current = -1;
            break;

          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menu, subMenu, selectedParent, menuData, highlightedParentIndex, highlightedSubIndex]);


  // Reset button handler
  const handleReset = () => {
    setTempSubType("");
    setSelectedParent("");
    setData((prev) => ({
      ...prev,
      [varName]: {
        ...prev[varName],
        [type]: "",
        [subType]: "",
      },
    }));
  };

  // Change subtype (single value)
  const handleSubTypeChange = (opt) => {
    setTempSubType(opt?.id);
  };

  // Apply button handler
  const handleApply = () => {
    setData((prev) => ({
      ...prev,
      [varName]: {
        ...prev[varName],
        [type]: selectedParent,   // ✅ save parent
        [subType]: tempSubType,   // ✅ save subType
      },
    }));
    setMenu(false);
    setSubMenu(false);
  };

  const selectedValue = data?.[varName]?.[subType] || "";
  const savedParent = data?.[varName]?.[type] || "";

  return (
    <div className="global-input-box" ref={inputRef}>
      <label>{label}</label>
      <div className="input">
        {/* Main Dropdown */}
        <div
          style={{ minWidth: width ? `${width}px` : "286px" }}
          className={`display 
  ${menu || selectedValue ? "active" : ""} 
  ${errors?.propertyTypeType || errors?.propertyTypeSubType ? "error" : ""}`}
          onClick={() => {
            setMenu((prev) => !prev);
            if (!menu) {
              setHighlightedParentIndex(-1);
              setHighlightedSubIndex(-1);
              highlightedParentIndexRef.current = -1;
              highlightedSubIndexRef.current = -1;
            }
          }}
          onFocus={() => setMenu(true)}
          tabIndex={0}
        >
          {savedParent && selectedValue
            ? `${menuData?.find((item) => item?.id === savedParent)?.name}: ${menuData?.find((item) => item?.id === savedParent)?.sub_categories?.find((items) => items?.id === selectedValue)?.name}`   // ✅ show both parent + subType
            : savedParent
              ? savedParent                          // ✅ if only parent selected
              : "Select"}
          <svg style={{ transform: menu ? "rotate(180deg)" : "rotate(0deg)" }}
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              d="M0.714355 0.85714L5.00007 5.14285L9.28578 0.85714"
              stroke={menu ? "#698B75" : "#737678"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Parent Menu */}
        {menu && (
          <div className="menu-box" ref={parentMenuRef}>
            {menuData?.map((item, index) => {
              const isSelected = selectedParent === item?.id;
              const isHighlighted = highlightedParentIndex === index;
              return (
                <div
                  key={index}
                  className={`menu ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubMenu(true);
                    setSelectedParent(item?.id);
                    setHighlightedParentIndex(-1);
                    setHighlightedSubIndex(-1);
                    highlightedParentIndexRef.current = -1;
                    highlightedSubIndexRef.current = -1;
                  }}
                  onMouseEnter={() => setHighlightedParentIndex(index)}
                >
                  {item?.name}
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

        {/* Sub Menu */}
        {menu && subMenu && (
          <div className="sub-menu-box">
            <div className="menu-tabs" ref={subMenuRef}>
              {menuData?.find((item) => item?.id === selectedParent)
                ?.sub_categories?.map((opt, idx) => {
                  const isSelected = tempSubType === opt?.id;
                  const isHighlighted = highlightedSubIndex === idx;
                  return (
                    <div
                      key={opt}
                      className={`sub-menu ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`}
                      onClick={() => handleSubTypeChange(opt)}
                      onMouseEnter={() => setHighlightedSubIndex(idx)}
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
        {errors?.propertyTypeType || errors.propertyTypeSubType ?
          <div className="error-message">{errors?.propertyTypeType}</div> : ""
        }
      </div>
    </div>
  );
}

export default MultiMenuInputs;
