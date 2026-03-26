// import propertyNotFound from '../../Asset/not-found.png'
import HorizontalCard from '../Metiral/HorizontalCard'
// import { useNavigate } from 'react-router-dom'
// import { TbHomeSearch } from 'react-icons/tb'
import { useState } from 'react'
import NoResultFound from '../Metiral/NotFound'
import { FallbackImage } from '../Metiral/FallbackImage'
function SoldProperties({ propertyData, adData }) {
    // const navigate = useNavigate()
    const [closedAds, setClosedAds] = useState([]);
    // Limit to 5 properties and determine title
    const displayProperties = propertyData?.slice(0, 5) || [];
    const propertyCount = displayProperties.length;
    const title = propertyCount === 1 
        ? "Top Property Sold by Agent" 
        : propertyCount > 1 
            ? `Top ${propertyCount} Properties Sold by Agent`
            : "Top Properties Sold by Agent";

    return (
        <>
            <div className="agent-sold-properties" style={{ paddingTop: '40px' }}>
                <div className="title">{title}</div>
                <div className="row" >
                    <div className="col-12">
                        { displayProperties?.map((item, index) => (
                                <HorizontalCard key={index} label={item.label} data={item} />
                        )) }
                    </div>
                    
                    {/* <div className="col-lg-3">
                        {Array.isArray(adData) && adData.length > 0 && adData?.map((item, index) => (
                                closedAds.includes(index) ?
                                    <div className="no-ad-results text-center py-5">
                                        <FallbackImage
                                            src="https://cdn-icons-png.flaticon.com/512/7486/7486761.png"
                                            alt="No results"
                                            style={{ width: "120px", opacity: 0.7, marginBottom: "15px" }}
                                            componentName="SoldProperties"
                                        />
                                        <h5>No Ads Found</h5>
                                    </div> : (
                                        <div className="d-flex" style={{ gap: "10px", flexWrap: 'wrap' }}>
                                            <div
                                                key={index}
                                                className="ad-global-box"
                                            >
                                                <div className="close-btn" onClick={() =>
                                                    setClosedAds((prev) => [...prev, index])
                                                }>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="12"
                                                        height="12"
                                                        viewBox="0 0 12 12"
                                                        fill="none"
                                                    >
                                                        <rect width="12" height="12" fill="white" />
                                                        <path
                                                            d="M8.99991 2.99991C8.90615 2.90617 8.77899 2.85352 8.64641 2.85352C8.51383 2.85352 8.38667 2.90617 8.29291 2.99991L5.99991 5.29291L3.70691 2.99991C3.61315 2.90617 3.48599 2.85352 3.35341 2.85352C3.22083 2.85352 3.09367 2.90617 2.99991 2.99991C2.90617 3.09367 2.85352 3.22083 2.85352 3.35341C2.85352 3.48599 2.90617 3.61315 2.99991 3.70691L5.29291 5.99991L2.99991 8.29291C2.90617 8.38667 2.85352 8.51383 2.85352 8.64641C2.85352 8.77899 2.90617 8.90615 2.99991 8.99991C3.09367 9.09365 3.22083 9.1463 3.35341 9.1463C3.48599 9.1463 3.61315 9.09365 3.70691 8.99991L5.99991 6.70691L8.29291 8.99991C8.38667 9.09365 8.51383 9.1463 8.64641 9.1463C8.77899 9.1463 8.90615 9.09365 8.99991 8.99991C9.09365 8.90615 9.1463 8.77899 9.1463 8.64641C9.1463 8.51383 9.09365 8.38667 8.99991 8.29291L6.70691 5.99991L8.99991 3.70691C9.09365 3.61315 9.1463 3.48599 9.1463 3.35341C9.1463 3.22083 9.09365 3.09367 8.99991 2.99991Z"
                                                            fill="#BBBBBB"
                                                        />
                                                    </svg>
                                                </div>
                                                <FallbackImage src={item?.image} alt="" componentName="SoldProperties" />
                                            </div>
                                        </div>
                                    )))
                        }
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default SoldProperties
