import React from 'react'
import { useAuth } from '../../Context/ContextProvider'
import { useNavigate } from 'react-router-dom'
const gainLocation = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.6668 8.33329C16.6668 12.4941 12.051 16.8275 10.501 18.1658C10.3566 18.2744 10.1808 18.3331 10.0002 18.3331C9.8195 18.3331 9.64373 18.2744 9.49933 18.1658C7.94933 16.8275 3.3335 12.4941 3.3335 8.33329C3.3335 6.56518 4.03588 4.86949 5.28612 3.61925C6.53636 2.36901 8.23205 1.66663 10.0002 1.66663C11.7683 1.66663 13.464 2.36901 14.7142 3.61925C15.9645 4.86949 16.6668 6.56518 16.6668 8.33329Z" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 10.8334C11.3807 10.8334 12.5 9.71409 12.5 8.33337C12.5 6.95266 11.3807 5.83337 10 5.83337C8.61929 5.83337 7.5 6.95266 7.5 8.33337C7.5 9.71409 8.61929 10.8334 10 10.8334Z" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const gainHouse = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8.33333C2.49994 8.09088 2.55278 7.85135 2.65482 7.63142C2.75687 7.4115 2.90566 7.21649 3.09083 7.05999L8.92417 2.05999C9.22499 1.80575 9.60613 1.66626 10 1.66626C10.3939 1.66626 10.775 1.80575 11.0758 2.05999L16.9092 7.05999C17.0943 7.21649 17.2431 7.4115 17.3452 7.63142C17.4472 7.85135 17.5001 8.09088 17.5 8.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V8.33333Z" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const gainBuilding = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_7158_122139)">
        <path d="M5 18.3334V3.33341C5 2.89139 5.17559 2.46746 5.48816 2.1549C5.80072 1.84234 6.22464 1.66675 6.66667 1.66675H13.3333C13.7754 1.66675 14.1993 1.84234 14.5118 2.1549C14.8244 2.46746 15 2.89139 15 3.33341V18.3334H5Z" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.99984 10H3.33317C2.89114 10 2.46722 10.1756 2.15466 10.4882C1.8421 10.8007 1.6665 11.2246 1.6665 11.6667V16.6667C1.6665 17.1087 1.8421 17.5326 2.15466 17.8452C2.46722 18.1577 2.89114 18.3333 3.33317 18.3333H4.99984" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7.5H16.6667C17.1087 7.5 17.5326 7.6756 17.8452 7.98816C18.1577 8.30072 18.3333 8.72464 18.3333 9.16667V16.6667C18.3333 17.1087 18.1577 17.5326 17.8452 17.8452C17.5326 18.1577 17.1087 18.3333 16.6667 18.3333H15" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.3335 5H11.6668" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.3335 8.33325H11.6668" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.3335 11.6667H11.6668" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.3335 15H11.6668" stroke="#00A63E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
        <clipPath id="clip0_7158_122139">
            <rect width="20" height="20" fill="white" />
        </clipPath>
    </defs>
</svg>

const loseLocation = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.6668 8.33329C16.6668 12.4941 12.051 16.8275 10.501 18.1658C10.3566 18.2744 10.1808 18.3331 10.0002 18.3331C9.8195 18.3331 9.64373 18.2744 9.49933 18.1658C7.94933 16.8275 3.3335 12.4941 3.3335 8.33329C3.3335 6.56518 4.03588 4.86949 5.28612 3.61925C6.53636 2.36901 8.23205 1.66663 10.0002 1.66663C11.7683 1.66663 13.464 2.36901 14.7142 3.61925C15.9645 4.86949 16.6668 6.56518 16.6668 8.33329Z" stroke="#E7000B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 10.8334C11.3807 10.8334 12.5 9.71409 12.5 8.33337C12.5 6.95266 11.3807 5.83337 10 5.83337C8.61929 5.83337 7.5 6.95266 7.5 8.33337C7.5 9.71409 8.61929 10.8334 10 10.8334Z" stroke="#E7000B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const loseHouse = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5" stroke="#E7000B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 8.33333C2.49994 8.09088 2.55278 7.85135 2.65482 7.63142C2.75687 7.4115 2.90566 7.21649 3.09083 7.05999L8.92417 2.05999C9.22499 1.80575 9.60613 1.66626 10 1.66626C10.3939 1.66626 10.775 1.80575 11.0758 2.05999L16.9092 7.05999C17.0943 7.21649 17.2431 7.4115 17.3452 7.63142C17.4472 7.85135 17.5001 8.09088 17.5 8.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V8.33333Z" stroke="#E7000B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
</svg>


function OverView({ subcategory_wise }) {
    const { loading, objectToQueryString } = useAuth()
    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
        } else if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        } else if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        } else if (num >= 1_000) {
            return `${(num / 1_000).toFixed(2)} K`;
        } else if (num >= 1_00) {
            return `${(num / 1_00).toFixed(2)} Hundred`;
        }
        return num.toString();
    };


    const navigate = useNavigate()
    const date = new Date();
    const options = { month: 'short', year: 'numeric' };
    const currentMonthYear = date.toLocaleDateString('en-US', options);

    return (
        <>
            <div className="property-index-overview">
                <div className="main-container">
                    <div className="title">Pakistan Real Estate Market Overview</div>
                    <div className="row" style={{ gap: '20px 0' }}>
                        <div className="col-lg-6">
                            <div className="overview-box gainers">
                                <div className="top">
                                    <div className="img">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M16 7H22V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="text-box">
                                        <div className="card-title">Top Gainers</div>
                                        <div className="date">{currentMonthYear}</div>
                                    </div>
                                </div>
                                <div className="slot-box w-100">
                                    {loading ? [...Array(6)].map((_, index) => {
                                        return (
                                            <div key={index} className='placeholder-glow'>
                                                <div className='placeholder w-100 mt-2' style={{ height: "70px" }} />

                                            </div>
                                        )
                                    })
                                        : subcategory_wise?.top_gainers && subcategory_wise.top_gainers.length > 0 ? (
                                            subcategory_wise.top_gainers.map((data, index) => (
                                            <div style={{cursor:"pointer"}} onClick={() => {
                                                const queryString = objectToQueryString({
                                                    property_type_id:1,
                                                    location_id:data?.location_id,
                                                    city_code:data?.city_code,
                                                    sub_category_id:data?.subcategory_id,
                                                    category_id:data?.category_id,
                                                });
                                                navigate(`/property-index-detail?${queryString}`)
                                            }} className="slot">
                                                <div className="left-box">
                                                    <div className="slot-title">{data?.location_name} {data?.city_name}</div>
                                                    <div className="type">
                                                        <div className="icon">{gainLocation}</div>
                                                        <div className="text">{data?.subcategory_name}</div>
                                                    </div>
                                                </div>
                                                <div className="center">
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <div className="percentage">
                                                            +{data?.percent_change}%
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M16 7H22V13" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <div className="year">Since Last year</div>
                                                </div>
                                                <div className="price">PKR {formatNumber(data?.avg_price)}</div>
                                            </div>
                                            ))
                                        ) : (
                                            <div className="empty-state">
                                                <div className="empty-text">No Top Gainers Found</div>
                                                <div className="empty-subtext">There are no gainers available for this period.</div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="overview-box lose">
                                <div className="top">
                                    <div className="img">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M16 17H22V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M22 17L13.5 8.5L8.5 13.5L2 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="text-box">
                                        <div className="card-title">Top Losers</div>
                                        <div className="date">{currentMonthYear}</div>
                                    </div>
                                </div>
                                <div className="slot-box">
                                    {loading ? [...Array(6)].map((_, index) => {
                                        return (
                                            <div key={index} className='placeholder-glow'>
                                                <div className='placeholder w-100 mt-2' style={{ height: "70px" }} />

                                            </div>
                                        )
                                    }) : subcategory_wise?.top_losers && subcategory_wise.top_losers.length > 0 ? (
                                        subcategory_wise.top_losers.map((data, index) => (
                                        <div style={{cursor:"pointer"}} onClick={() => {
                                            const queryString = objectToQueryString({
                                                property_type_id:1,
                                                location_id:data?.location_id,
                                                city_code:data?.city_code,
                                                sub_category_id:data?.subcategory_id,
                                                category_id:data?.category_id,
                                            });
                                            navigate(`/property-index-detail?${queryString}`)
                                        }} className="slot">
                                            <div className="left-box">
                                                <div className="slot-title">{data?.location_name} {data?.city_name}</div>
                                                <div className="type">
                                                    <div className="icon">{loseHouse}</div>
                                                    <div className="text">{data?.subcategory_name}</div>
                                                </div>
                                            </div>
                                            <div className="center">
                                                <div style={{ display: 'flex', alignContent: 'center', gap: '10px' }}>
                                                    <div className="percentage">
                                                        {data?.percent_change}%
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M16 17H22V11" stroke="#C94444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M22 17L13.5 8.5L8.5 13.5L2 7" stroke="#C94444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div className="year">Since Last year</div>
                                            </div>
                                            <div className="price">PKR {formatNumber(data?.avg_price)}</div>
                                        </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-text">No Top Losers Found</div>
                                            <div className="empty-subtext">There are no losers available for this period.</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OverView
