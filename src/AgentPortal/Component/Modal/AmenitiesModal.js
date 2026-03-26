import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useRef, useState } from "react";
import PrimaryBorderButton from "../../../Component/Metiral/Button/PrimaryBorderButton";
import PrimaryButton from "../../../Component/Metiral/Button/PrimaryButton";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    outline: "none",
};

function AmenitiesModal({ open, setOpen, data, setData, amenitiesData }) {
    const [menu, setMenu] = useState(null);
    const [activeAmenity, setActiveAmenity] = useState(null);
    const [amenities, setAmenities] = useState([]);
    const [draftData, setDraftData] = useState({ amenities: [] });
    const inputRef = useRef(null);

    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (open) {
            if (data?.amenities?.length) {
                data.amenities.forEach((cat, catIndex) => {
                    if (cat.data?.length) {
                        cat.data.forEach((amenity, amenityIndex) => {
                        });
                    }
                });
            }
            setDraftData(JSON.parse(JSON.stringify(data))); 
        }
    }, [open, data]);

    useEffect(() => {
        if (amenitiesData?.length) {
            amenitiesData.forEach((category, catIndex) => {
                if (category.amenities?.length) {
                    category.amenities.forEach((amenity, amenityIndex) => {
                    });
                }
            });
            setActiveAmenity(amenitiesData[0].name);
            setAmenities(amenitiesData[0]?.amenities);
        }
    }, [amenitiesData]);


    const updateAmenity = (parentCategory, item, value) => {
        setDraftData((prev) => {
            const updatedData = { ...prev };
            if (!updatedData.amenities) updatedData.amenities = [];


            // Since amenities is a flat array, find the specific amenity
            const amenityIndex = updatedData.amenities.findIndex(
                (amenity) => amenity.category_id == parentCategory?.id && amenity.id == item.id
            );

            if (amenityIndex !== -1) {
                // Amenity exists, update or remove it
                if (value) {
                    // Update existing amenity
                    updatedData.amenities[amenityIndex] = {
                        ...updatedData.amenities[amenityIndex],
                        pivot: {
                            ...updatedData.amenities[amenityIndex].pivot,
                            value: value
                        }
                    };
                } else {
                    // Remove amenity
                    updatedData.amenities.splice(amenityIndex, 1);
                }
            } else if (value) {
                // Add new amenity
                updatedData.amenities.push({
                    id: item.id,
                    category_id: parentCategory?.id,
                    category_name: parentCategory?.name,
                    label: item?.label,
                    input_value_type: item.type,
                    pivot: {
                        property_id: updatedData.id || null,
                        amenity_id: item.id,
                        value: value
                    }
                });
            }

            return updatedData;
        });
    };

    const handleSave = () => {
        setData({ ...data, amenities: draftData.amenities });
    };


    return (
        <Modal open={open} onClose={handleClose}
        BackdropProps={{
            className: 'global-modal-background-color'
          }}>
            <Box sx={style}>
                <div className="amenities-modal global-modal-base-color">
                    <div className="row m-0 h-100">
                        {/* Left Tabs */}
                        <div className="col-4 h-100 p-0">
                            <div className="tab-section">
                                <div className="head-box">
                                    <div className="heading">Features & Amenities</div>
                                    <div className="para">
                                        Enjoy modern spaces, essential facilities, and thoughtful
                                        details—bringing comfort, convenience, and style together in
                                        one place.
                                    </div>
                                </div>
                                <div className="tab-box">
                                    {amenitiesData?.map((category) => (
                                        <div
                                            key={category?.id}
                                            className={`tab ${category?.name === activeAmenity ? "active" : ""
                                                }`}
                                            onClick={() => {
                                                setAmenities(category?.amenities);
                                                setActiveAmenity(category.name);
                                            }}
                                        >
                                            {category?.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Inputs */}
                        <div className="col-8 p-0 ">
                            <div className="amenities-input-section">
                                <div className="close-btn" onClick={handleClose}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clipPath="url(#clip0_697_3080)">
                                            <path d="M15.9994 8.00006C15.8119 7.81259 15.5576 7.70728 15.2924 7.70728C15.0273 7.70728 14.773 7.81259 14.5854 8.00006L11.9995 10.5861L9.41346 8.00006C9.22486 7.8179 8.97226 7.71711 8.71006 7.71939C8.44786 7.72167 8.19705 7.82684 8.01164 8.01224C7.82623 8.19765 7.72107 8.44846 7.71879 8.71066C7.71651 8.97286 7.8173 9.22546 7.99946 9.41406L10.5855 12.0001L7.99946 14.5861C7.8173 14.7747 7.71651 15.0273 7.71879 15.2895C7.72107 15.5517 7.82623 15.8025 8.01164 15.9879C8.19705 16.1733 8.44786 16.2785 8.71006 16.2807C8.97226 16.283 9.22486 16.1822 9.41346 16.0001L11.9995 13.4141L14.5854 16.0001C14.7741 16.1822 15.0267 16.283 15.2888 16.2807C15.551 16.2785 15.8019 16.1733 15.9873 15.9879C16.1727 15.8025 16.2778 15.5517 16.2801 15.2895C16.2824 15.0273 16.1816 14.7747 15.9994 14.5861L13.4135 12.0001L15.9994 9.41406C16.1869 9.22653 16.2922 8.97223 16.2922 8.70706C16.2922 8.4419 16.1869 8.18759 15.9994 8.00006Z" fill="#2D2D2D" />
                                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_697_3080">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>

                                <div
                                    style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
                                >
                                    {/* 1️⃣ Select Inputs */}
                                    {amenities
                                        ?.filter((item) => item.type === "select")
                                        .map((item) => {
                                            const parentCategory = amenitiesData.find(
                                                (cat) => cat.name === activeAmenity
                                            );

                                             // Since amenities is now a flat array, find the amenity directly
                                             const currentAmenity = draftData.amenities?.find(
                                                 (amenity) => amenity.category_id == parentCategory?.id && amenity.id == item.id
                                             );
                                             const currentValue = currentAmenity?.pivot?.value || currentAmenity?.value || "";
                                            const arr = item?.option?.split(",").map((opt) => opt.trim()) || [];

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="input-box"
                                                    style={{ flexDirection: "column" }}
                                                >
                                                    <label>{item?.label}</label>
                                                    <div
                                                        className="input"
                                                        ref={inputRef}
                                                        onClick={() => {
                                                            const newMenu = menu === item.id ? null : item.id;
                                                            setMenu(newMenu);
                                                        }}
                                                    >
                                                        <div className="display">
                                                            {currentValue || "Select option"}
                                                            <svg style={{ transform: menu && menu == item?.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <path d="M5.71387 7.85718L9.99958 12.1429L14.2853 7.85718" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                        {menu === item.id && (
                                                            <div className="menu-box">
                                                                {arr.map((option, idx) => {
                                                                    const isSelected = option === currentValue;
                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className={`menu ${isSelected ? "selected" : ""}`}
                                                                            onClick={() => {
                                                                                updateAmenity(parentCategory, item, option);
                                                                                setMenu(null);
                                                                            }}
                                                                        >
                                                                            {option}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    {/* 2️⃣ Text Inputs */}
                                    {amenities
                                        ?.filter((item) => item.type === "text")
                                        .map((item, index, filtered) => {
                                            const parentCategory = amenitiesData.find(
                                                (cat) => cat.name === activeAmenity
                                            );

                                             // Since amenities is now a flat array, find the amenity directly
                                             const currentAmenity = draftData.amenities?.find(
                                                 (amenity) => amenity.category_id == parentCategory?.id && amenity.id == item.id
                                             );
                                             const currentValue = currentAmenity?.pivot?.value || currentAmenity?.value || "";

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="input-box"
                                                    style={{ flexDirection: "column" }}
                                                >
                                                    <label>{item?.label}</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Data"
                                                        value={currentValue}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                                                            updateAmenity(parentCategory, item, capitalizedValue);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}

                                    {/* 3️⃣ Checkbox Inputs */}
                                    {amenities
                                        ?.filter((item) => item.type === "checkbox")
                                        .map((item, index) => {
                                            const parentCategory = amenitiesData.find(
                                                (cat) => cat.name === activeAmenity
                                            );

                                             // Since amenities is now a flat array, find the amenity directly
                                             const currentAmenity = draftData.amenities?.find(
                                                 (amenity) => amenity.category_id == parentCategory?.id && amenity.id == item.id
                                             );
                                             const currentValue = currentAmenity?.pivot?.value || currentAmenity?.value || "";

                                            return (
                                                <>
                                                    {index == 0 ? <div className="line"></div> : ""}
                                                    <div key={item.id} className="input-box input-checkbox">
                                                        <label
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={currentValue === true || currentValue === "true"}
                                                                onChange={(e) =>
                                                                    updateAmenity(parentCategory, item, e.target.checked ? true : null)
                                                                }
                                                                sx={{
                                                                    padding: 0,
                                                                    margin: 0,
                                                                    color: "#666",
                                                                    "&.Mui-checked": { color: "#447158" },
                                                                    "& .MuiSvgIcon-root": {
                                                                        fontSize: 20,
                                                                        borderRadius: "4px",
                                                                    },
                                                                }}
                                                            />
                                                            <span>{item?.label}</span>
                                                        </label>
                                                    </div>
                                                </>
                                            );
                                        })}

                                </div>

                                <div className="button-box">
                                    <PrimaryBorderButton text={"Cancel"} onFunction={handleClose} />
                                    <PrimaryButton
                                        onFunction={() => {
                                            handleSave();
                                            handleClose();
                                        }}
                                        text="Add Amenities"
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AmenitiesModal;
