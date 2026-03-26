import { useEffect, useRef, useState } from "react";
import "./SingleMenuField.css";
import Checkbox from "@mui/material/Checkbox";
import { useAuth } from "../../../../Context/ContextProvider";
import { useLocation } from "react-router-dom";

function SingleMenuFeild({
  getVaiable,
  storeKey,
  filterData,
  setFilterData,
  varName,
  label,
  menuData,
  optionSelect,
  type,
  input,
  design,
  error,
  clearOnChange,
  newModified,
  placeholder,
}) {
  const { getLOcation, setLocationList,parseQueryParams } = useAuth();
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState(menuData);
  const [searchText, setSearchText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const location=useLocation()
  useEffect(() => {
    if (getVaiable) {
      // Object mode: get value from object property
      if (filterData?.[varName]?.[getVaiable]) {
        setSearchText(filterData?.[varName]?.[getVaiable]);
      } else if (clearOnChange && !filterData?.[varName]) {
        setSearchText("");
      }
    } else {
      // String mode: extract name from object or use string directly
      if (filterData?.[varName]) {
        const displayValue = typeof filterData[varName] === 'object' 
          ? (filterData[varName]?.agency_name || filterData[varName]?.name || "")
          : filterData[varName];
        setSearchText(displayValue);
      } else if (clearOnChange && !filterData?.[varName]) {
        setSearchText("");
      }
    }
  }, [filterData, varName, getVaiable, clearOnChange]);

  // 🟢 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        // Close dropdown
        setFocus(false);
        setHighlightedIndex(-1);

        // If user didn't select a value (just typed something)
        // → restore the value from filterData
        const storedValue = getVaiable 
          ? filterData?.[varName]?.[getVaiable]
          : (typeof filterData?.[varName] === 'object' 
              ? (filterData?.[varName]?.agency_name || filterData?.[varName]?.name || "")
              : filterData?.[varName]);

        if (storedValue && searchText.trim() !== storedValue) {
          setSearchText(storedValue);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchText, filterData, varName, getVaiable, optionSelect]);

  // 🟢 Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  const handleOptionClick = async (value) => {
    const key = storeKey || getVaiable;

    if (optionSelect === "single" || optionSelect === "singleSelect") {
      if (getVaiable) {
        // Object mode: store the entire object
        setFilterData((prev) => ({
          ...prev,
          [varName]: value,
        }));
        setSearchText(value?.[getVaiable] || "");
      } else {
        // String mode: store the entire object but display the name
        setFilterData((prev) => ({
          ...prev,
          [varName]: value,
        }));
        setSearchText(value?.agency_name || value?.name || "");
      }
      setFocus(false);

      // 🏙 Handle city logic
      if (varName === "city") {

        const locationResult = await getLOcation({
          city_code: value.app_code,
        });
        setLocationList(locationResult?.data || []);

        setFilterData((prev) => ({
          ...prev,
          city: value,
          location: "", // clear location when city changes
        }));
        return;
      }
    }

    // 🟢 Multiple select logic
    if (optionSelect === "multiple") {
      const currentArray = filterData?.[varName] || [];
      const rawValue = value?.[getVaiable];
      const alreadySelected = currentArray.includes(rawValue);

      let updatedArray = alreadySelected
        ? currentArray.filter((item) => item !== rawValue)
        : [...currentArray, rawValue];

      // Sort in ascending order for bedroom and bathroom
      if (varName === "bedroom" || varName === "bathroom") {
        updatedArray = updatedArray.sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);
          return numA - numB;
        });
      }

      setFilterData((prev) => ({
        ...prev,
        [varName]: updatedArray,
      }));
    }
  };

  // 🟢 Keyboard navigation handler
  useEffect(() => {
    if (!focus) return;

    const scrollToOption = (index) => {
      if (menuRef.current) {
        const menuItems = menuRef.current.querySelectorAll(".menu");
        if (menuItems[index]) {
          menuItems[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    const handleKeyDown = (event) => {
      const optionsLength = filteredOptions?.length || 0;
      if (optionsLength === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => {
            const nextIndex = prev < optionsLength - 1 ? prev + 1 : 0;
            setTimeout(() => scrollToOption(nextIndex), 0);
            return nextIndex;
          });
          break;

        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => {
            const nextIndex = prev > 0 ? prev - 1 : optionsLength - 1;
            setTimeout(() => scrollToOption(nextIndex), 0);
            return nextIndex;
          });
          break;

        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < optionsLength) {
            handleOptionClick(filteredOptions[highlightedIndex]);
          }
          break;

        case "Escape":
          event.preventDefault();
          setFocus(false);
          setHighlightedIndex(-1);
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focus, highlightedIndex, filteredOptions, handleOptionClick]);

  const onChange = (e) => {
    setFocus(true)
    const value = e.target.value;
    setSearchText(value);
    setHighlightedIndex(-1);
    
    // Update filterData immediately for string mode (when no getVaiable)
    if (!getVaiable) {
      // Find matching object in menuData by agency_name or name
      const matchingObject = menuData?.find(item => 
        item?.agency_name === value || item?.name === value
      );
      
      if (matchingObject) {
        // Store the entire object if found
        setFilterData((prev) => ({
          ...prev,
          [varName]: matchingObject,
        }));
      } else {
        // Store the string value if no match found (for partial typing)
        setFilterData((prev) => ({
          ...prev,
          [varName]: value,
        }));
      }
    }
    
    const searchValue = value.toLowerCase();
    if (getVaiable) {
      // Object mode: filter by the specified property
      const filtered = menuData.filter((item) =>
        item?.[getVaiable]?.toLowerCase().includes(searchValue)
      );
      setFilteredOptions(filtered);
    } else {
      // String mode: filter by the item itself (assuming menuData contains strings or objects with a searchable property)
      const filtered = menuData.filter((item) => {
        const searchableValue = typeof item === 'string' ? item : item?.agency_name || item?.name || Object.values(item)[0];
        return searchableValue?.toLowerCase().includes(searchValue);
      });
      setFilteredOptions(filtered);
    }
  };

  const getDisplayValue = () => {
    if (optionSelect === "multiple") {
      return (filterData?.[varName] || []).join(", ");
    }
    if (optionSelect === "singleSelect") {
      return filterData?.[varName] === 'Sell' ? 'Buy' : filterData?.[varName] || "";
    }
    const val = filterData?.[varName]?.[getVaiable];
    return val === 'Sell' ? 'Buy' : val || "";
  };

  useEffect(() => {
    const getLocationInput = async () => {
  
      let parse=await parseQueryParams(location?.search)

    if(varName === "city"){
        
        const locationResult = await getLOcation({
          city_code: filterData?.city?.app_code || parse?.city_code,
        });
        setLocationList(locationResult?.data || []);
      }
    }
    getLocationInput();
  }, [varName]);
  
  return (
    <div
      className={
        design === "simple"
          ? `${focus ||
            (optionSelect === "multiple"
              ? filterData?.[varName]?.length > 0
              : !!filterData?.[varName])
            ? "single-input-field focus align-items-center simple-design"
            : "single-input-field align-items-center simple-design"
          }${error ? " error focus" : error && focus ? "error focus" : ""}`
          : `${focus ||
            (optionSelect === "multiple"
              ? filterData?.[varName]?.length > 0
              : !!filterData?.[varName])
            ? "single-input-field focus align-items-center"
            : "single-input-field align-items-center"
          }${error ? " error" : error && focus ? "error" : ""}`
      }
      onClick={() => {
        setFocus(!focus);
        setFilteredOptions(menuData);
        setHighlightedIndex(-1);
      }}
      ref={inputRef}
    >
      {!newModified && <label>{label}</label>}
      {/* {newModified && <label>{placeholder}</label>} */}

      {input ? (
        <input
          type="text"
          className="input-value input-value-input"
          value={searchText}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <div 
          className={`input-value ${(() => {
            // Check if filterData has a value
            const hasValue = optionSelect === "multiple" 
              ? filterData?.[varName]?.length > 0
              : !!filterData?.[varName];
            return !hasValue ? 'show-placeholder' : '';
          })()}`}
          style={{opacity: newModified ? 1 : '' ,color: newModified && !focus ? ' #737678' : ''}}
        >
          {(() => {
            // Check if filterData has a value
            const hasValue = optionSelect === "multiple" 
              ? filterData?.[varName]?.length > 0
              : !!filterData?.[varName];
            
            if (hasValue) {
              return getDisplayValue();
            }
            
            if (focus && !filterData?.[varName]) {
              return "Select Value";
            }
            
            return placeholder || "";
          })()}
        </div>
      )}

      {/* 🔽 Arrow Icons */}
      {focus ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
        >
          <rect width="18.8657" height="20" transform="translate(0.716309 0.714294)" fill="white" />
          <path
            d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572"
            stroke={error ? "#C94444" : "#698B75"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712"
            stroke={error ? "#C94444" : "#737678"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* 🧾 Dropdown Menu */}
      {focus && (
        <div className="menu-box" ref={menuRef}>
          {filteredOptions?.map((value, index) => {
            const key = storeKey || getVaiable;
            const optionKey = value?.[key];
            const isSelected =
              optionSelect === "multiple"
                ? (filterData?.[varName] || []).includes(optionKey)
                : optionSelect === "singleSelect"
                  ? filterData?.[varName] === value
                  : getVaiable
                    ? filterData?.[varName]?.[key] === optionKey
                    : filterData?.[varName] === value || 
                      (typeof filterData?.[varName] === 'object' && 
                       filterData?.[varName]?.id === value?.id);
            const isHighlighted = highlightedIndex === index;

            return (
              <div
                key={index}
                className={`menu ${isSelected ? "selected" : ""} ${type ? "check" : ""} ${isHighlighted ? "highlighted" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(value);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {type === "check" && (
                  <Checkbox
                    checked={isSelected}
                    sx={{
                      color: "#737678",
                      padding: 0,
                      "&.Mui-checked": {
                        color: "#447158",
                        padding: "0px",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 16,
                        borderRadius: "8px",
                      },
                    }}
                  />
                )}
                {getVaiable 
                  ? (value?.[getVaiable] === 'Sell' ? 'Buy' : value?.[getVaiable])
                  : (typeof value === 'string' ? value : value?.agency_name || value?.name || Object.values(value)[0])}
                {varName === "bedroom" && " Bedrooms"}
                {varName === "bathroom" && " Bathrooms"}
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="error-para" style={{top:"100%"}}>{error}</p>}
    </div>
  );
}

export default SingleMenuFeild;
