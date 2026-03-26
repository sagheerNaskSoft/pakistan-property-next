import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
// import "./ConsturstionTypes.css";

function ConsturstionTypes() {
  const [data, setData] = useState({
    constructionType: "Complete",
    constructionMode: "With Material",
    coveredArea: "",
    bedrooms: "5",
    bathrooms: "6",
    kitchens: "2",
    livingRooms: "2",
    drawingRooms: "1",
  });

  const handleChange = (field, value) =>
    setData((p) => ({ ...p, [field]: value }));

  return (
    <div className="main-container">
      

      <div className="filter-card">
        {/* Construction Type */}
        <div className="form-group">
          <label>Construction Type</label>
          <select
            value={data.constructionType}
            onChange={(e) => handleChange("constructionType", e.target.value)}
          >
            <option value="Grey Structure">Grey Structure</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        {/* Construction Mode */}
        <div className="form-group">
          <label>Construction Mode</label>
          <select
            value={data.constructionMode}
            onChange={(e) => handleChange("constructionMode", e.target.value)}
          >
            <option value="With Material">With Material</option>
            <option value="Without Material">Without Material</option>
          </select>
        </div>

        {/* Covered Area */}
        <div className="form-group">
          <label>Covered Area</label>
          <div className="area-input">
            <input
              type="number"
              placeholder="Enter Covered Area"
              value={data.coveredArea}
              onChange={(e) => handleChange("coveredArea", e.target.value)}
            />
            <span className="unit-label">Sq. Ft.</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="form-group">
          <label>Bedrooms</label>
          <select
            value={data.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Bathrooms */}
        <div className="form-group">
          <label>Bathrooms</label>
          <select
            value={data.bathrooms}
            onChange={(e) => handleChange("bathrooms", e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Kitchens */}
        <div className="form-group">
          <label>Kitchens</label>
          <select
            value={data.kitchens}
            onChange={(e) => handleChange("kitchens", e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Living Rooms */}
        <div className="form-group">
          <label>Living Rooms</label>
          <select
            value={data.livingRooms}
            onChange={(e) => handleChange("livingRooms", e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Drawing Rooms */}
        <div className="form-group">
          <label>Drawing Rooms</label>
          <select
            value={data.drawingRooms}
            onChange={(e) => handleChange("drawingRooms", e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button className="search-btn">
          <FiSearch /> Search
        </button>
      </div>
    </div>
  );
}

export default ConsturstionTypes;
