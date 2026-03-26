import { useEffect, useRef, useState } from "react";
import "./SingleMenuField.css";
function SingleTypeFiled({
  filterData,
  setFilterData,
  varName,
  label,
  menuData,
  menuValue,
  optionSelect,
  type,
  input,
  design,
    
  }) {

    const [focus, setFocus] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          // Close dropdown
          setFocus(false);
  
          // If user didn’t select a value (just typed something)
          // → restore the value from filterData
          const storedValue =
            optionSelect === "singleSelect"
              ? filterData?.[varName]
              : filterData?.[varName]?.[getVaiable];
  
          if (storedValue && searchText.trim() !== storedValue) {
            setSearchText(storedValue);
          }
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchText, filterData, varName, getVaiable, optionSelect]);
  
  
 
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
          }`
      }
      onClick={() => {
        setFocus(!focus);
        setFilteredOptions(menuData);
      }}
      ref={inputRef}
    >
      <label>{label}</label>

        <input
          type="text"
          className="input-value input-value-input"
          value={filterData?.[varName]}
          onChange={(e) => {
            setFilterData((prev) => ({
              ...prev,
              [varName]: e.target.value,
            }));
          }}
        />


    </div>
  )
}

export default SingleTypeFiled