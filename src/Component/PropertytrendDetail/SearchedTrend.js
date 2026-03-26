import React, { useState, useEffect } from 'react';
import svgImg from '../../Asset/PropertyindexDetail/house.svg'
import svgImg1 from '../../Asset/PropertyindexDetail/land.svg'
import svgImg2 from '../../Asset/PropertyindexDetail/Container.svg'
import svgImg3 from '../../Asset/PropertyindexDetail/commercial.svg'
import Image from 'next/image';
// import './searched-trend.css';

// ✅ Convert SVG import to a React component
const HouseIcon = () => (
    <Image src={svgImg} alt="House" width="32" height="32" />
);
const PlotIcon = () => (
    <Image src={svgImg1} alt="House" width="32" height="32" />
);
const FlatIcon = () => (
    <Image src={svgImg2} alt="House" width="32" height="32" />
);
const CommercialIcon = () => (
    <Image src={svgImg3} alt="House" width="32" height="32" />
);

const cardData = {
    Houses: {
        icon: HouseIcon,
        theme: "stp-blue"
    },
    Plots: {
        icon: PlotIcon,
        theme: "stp-green"
    },
    Flats: {
        icon: FlatIcon,
        theme: "stp-pink"
    },
    "Commercial Property": {
        icon: CommercialIcon,
        theme: "stp-gray"
    },
}
function STCard({ value, Icon }) {

    return (
        <div className="col-lg-3 col-md-6 col-sm-12">
            <div className={`stp-card ${cardData?.[value?.name]?.theme}`}>
                <div className="stp-icon">
                    <Icon />
                </div>

                <div className="stp-meta">
                    <div className="stp-value">{value?.percentage?.toFixed(2)}%</div>
                    <div className="stp-title">{value?.name}</div>
                </div>

                <div className="stp-bar">
                    <div
                        className="stp-bar-fill"
                        style={{ 
                            width: `${Math.min(value?.percentage || 0, 100)}%`,
                            minWidth: '0%'
                        }}
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={value?.percentage || 0}
                    />
                </div>
            </div>
        </div>
    );
}

// light inline SVGs (no external deps)




function SearchedTrend({ cityName, data }) {
    const [displayCityName, setDisplayCityName] = useState(cityName || "Lahore");

    // Only update city name when there's actual data (meaning a search was performed)
    useEffect(() => {
        if (data && data.length > 0 && cityName) {
            setDisplayCityName(cityName);
        }
    }, [data, cityName]);

    // Hide the entire section if no data is available
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <>
            <div className="main-container mb-5">
                <div className="index-detail">
                    {/* <BreadCrumb items={['Home', 'Property Trends', 'Lahore']} /> */}
                    <h2>Most Searched Property trends in {displayCityName}</h2>
                </div>

                <div className="serched-trends-property">
                    <div className="row">
                        {data.map((c, index) => (
                            <STCard
                                key={c?.name || index}
                                value={c}
                                Icon={cardData?.[c?.name]?.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchedTrend;
