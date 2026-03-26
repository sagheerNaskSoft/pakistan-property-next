import { useState, useMemo, useRef, useEffect } from "react";
import "./SingleMenuField.css";

function SimpleSingleField({
    filterData,
    setFilterData,
    varName,
    label,
    type,
    inputType,
    placeholder,
    menuData,
    error,
    modified,
    subMenu,
    value,
    unit,
    newModified
}) {
    const [focus, setFocus] = useState(false);
    const [menu, setMenu] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const inputRef = useRef(null);
    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    // 🔹 Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFocus(false);
                setMenu(false);
                setSideMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🔹 Handle input change
    const onChange = (e) => {
        const val = e.target.value;

        if (inputType === "search") {
            setSearchValue(val);
            setFilterData((prev) => ({
                ...prev,
                [varName]: { ...prev[varName], city: val },
            }));
            setMenu(true);
        } else {
            if (varName === "phone") {
                setFilterData((prev) => ({
                    ...prev,
                    [varName]: formatPakistaniPhoneNumber(val),
                }));
                return;
            }

            if (varName === "cnic") {
                let cnic = val.replace(/\D/g, "");
                if (cnic.length > 5 && cnic.length <= 12)
                    cnic = cnic.slice(0, 5) + "-" + cnic.slice(5);
                else if (cnic.length > 12)
                    cnic = cnic.slice(0, 5) + "-" + cnic.slice(5, 12) + "-" + cnic.slice(12, 13);

                setFilterData((prev) => ({
                    ...prev,
                    [varName]: cnic,
                }));
            } else {
                // ✅ Fix: Keep existing object structure when typing value
                setFilterData((prev) => {
                    const existing = prev[varName];
                    if (typeof existing === "object") {
                        return {
                            ...prev,
                            [varName]: {
                                ...existing,
                                [value]: val, // update only value field
                            },
                        };
                    } else {
                        return {
                            ...prev,
                            [varName]: val,
                        };
                    }
                });
            }
        }
    };

    // 🔹 Handle submenu selection
    const handleSubMenu = (item) => {
        setFilterData((prev) => {
            const existing = prev[varName];
            return {
                ...prev,
                [varName]: {
                    ...(typeof existing === "object" ? existing : { [value]: existing || "" }),
                    [unit]: item?.code || item?.name || item?.value || item,
                },
            };
        });
    };

    // 🔹 Filter menu data for searchable dropdown
    const filteredMenu = useMemo(() => {
        if (!searchValue.trim()) return menuData;
        return menuData?.filter((item) =>
            item?.city?.toLowerCase()?.includes(searchValue.toLowerCase())
        );
    }, [searchValue, menuData]);

    // 🔹 Handle select in search menu
    const handleSelect = (item) => {
        setFilterData((prev) => ({
            ...prev,
            [varName]: inputType === "search" ? item : item.city,
        }));
        setSearchValue(item.city);
        setMenu(false);
        setFocus(false);
    };

    const formatPakistaniPhoneNumber = (phoneNumber) => {
        let phone = phoneNumber.replace(/\D/g, "");
        if (phone.startsWith("92")) phone = phone.slice(2);
        else if (phone.startsWith("+92")) phone = phone.slice(3);
        else if (phone.startsWith("0")) phone = phone.slice(1);
        if (phone.length > 10) phone = phone.slice(0, 10);
        return phone;
    };

    // ✅ Fixed: Always show value correctly for both string/object
    const displayValue = (() => {
        const field = filterData?.[varName];
        if (inputType === "search") return field?.city || "";
        if (typeof field === "object") return field?.[value] ?? "";
        return field ?? "";
    })();

    return (
        <div
            ref={inputRef}
            className={
                error && modified
                    ? "simple-single-input-field modified focus error" :
                    error ? "simple-single-input-field error"
                        : (modified && focus) || filterData?.[varName]?.length > 0 || filterData?.[varName]?.[value]
                            ? "simple-single-input-field modified focus"
                            : modified
                                ? "simple-single-input-field modified"
                                : focus || !!displayValue?.trim()
                                    ? "simple-single-input-field focus"
                                    : "simple-single-input-field"
            }

            onMouseDown={(e) => {
                e.stopPropagation(); // Prevent the mousedown from bubbling to handleClickOutside
                if (menuData) {
                    setFocus(!focus);
                } else {
                    setFocus(true);
                }
            }}
        >
            {!modified && !newModified && <label>{label}</label>}
            <div className="input-box">
                {modified && !newModified && <label>{label}</label>}
                <input
                    type={type}
                    placeholder={placeholder || "Select"}
                    value={displayValue}
                    onChange={onChange}
                    onFocus={() => {
                        setFocus(true);
                        setMenu(true);
                    }}
                    onBlur={() => setTimeout(() => setMenu(false), 150)}
                />

                {/* ✅ Fixed: Unit always visible */}
                {subMenu?.length > 0 && (
                    <div className="sideUnit" onMouseDown={(e) => {
                        e.stopPropagation();
                        setSideMenuOpen(true);
                    }}>
                        {filterData?.[varName]?.[unit] || "Marla"}
                        <svg style={{transform: sideMenuOpen ? "rotate(180deg)" : "rotate(0deg)"}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}

                {/* ✅ Fixed submenu logic */}
                {subMenu?.length > 0 && sideMenuOpen && (
                    <div className="menu-box">
                        {subMenu.map((item, i) => (
                            <div
                                key={i}
                                className={`menu ${filterData?.[varName]?.[unit] ===
                                    (item?.code || item?.name || item?.value || item)
                                    ? "selected"
                                    : ""
                                    }`}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleSubMenu(item);
                                    setSideMenuOpen(false);
                                    setFocus(false);
                                }}
                            >
                                {item?.name || item?.value || item}
                            </div>
                        ))}
                    </div>
                )}

                {/* 🔹 Dropdown arrow */}
                {menuData ? (
                    focus ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                        >
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
                    )
                ) : null}

                {/* 🔹 Dropdown menu for search input */}
                {focus && menu && inputType === "search" && (
                    <div className="menu-box">
                        {filteredMenu?.length > 0 ? (
                            filteredMenu.map((item, index) => (
                                <div
                                    key={index}
                                    className="menu"
                                    onMouseDown={() => handleSelect(item)}
                                >
                                    {item?.city}
                                </div>
                            ))
                        ) : (
                            <div className="menu no-result">No results found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SimpleSingleField;
