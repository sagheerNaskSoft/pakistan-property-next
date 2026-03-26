import React, { useEffect, useRef, useState } from 'react'
import HorizontalCard from '../Metiral/HorizontalCard'
import HorizontalCardMobile from '../Metiral/HorizontalCardMobile'
import Card from '../Metiral/Card'
import NoResultFound from '../Metiral/NoResultFound'
import { FallbackImage } from '../Metiral/FallbackImage'

function ListedProperties({ properties, adData }) {
    const [tab, setTab] = useState(0)
    const [order, setOrder] = useState("horizontal")
    const [showCard, setShowCard] = useState(false)
    const pageRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                pageRef.current,
            ];

            const clickedInside = refs.some(ref => ref && ref.contains(event.target));

            if (!clickedInside) {
                setShowCard(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const [closedAds, setClosedAds] = useState([]);
    const [listedProperties, setListedProperties] = useState(properties)
    const handleTabChange = (id) => {
        setTab(id)
        if (id === 0) {
            setListedProperties(properties)
        } else if (id === 1) {
            setListedProperties(properties.filter(item => item.property_type_id === id))
        } else if (id === 2) {
            setListedProperties(properties.filter(item => item.property_type_id === id))
        } else if (id === 3) {
            setListedProperties(properties.filter(item => item.property_type_id === id))
        }
    }
    useEffect(() => {
        handleTabChange(0)
    }, [properties])

    return (
        <>
            <div className="agent-listed-properties mb-5" style={{ overflow: 'hidden' }}>
                <div className="title">Properties listed by Agent</div>

                <div className="row" style={{ gap: "24px 0", overflow: 'hidden', overflowX: 'hidden' }}>
                    <div className='col-lg-9' style={{ overflow: 'hidden' }}>
                        <div className="top align-items-center" style={{ marginBottom: '16px' }}>
                            <div className="tab-box mb-0">
                                <div className={tab === 0 ? "tab active" : 'tab'} onClick={() => handleTabChange(0)}>All</div>
                                <div className={tab === 1 ? "tab active" : 'tab'} onClick={() => handleTabChange(1)}>Sale</div>
                                <div className={tab === 2 ? "tab active" : 'tab'} onClick={() => handleTabChange(2)}>Rent</div>
                                <div className={tab === 3 ? "tab active" : 'tab'} onClick={() => handleTabChange(3)}>Lease</div>
                            </div>
                            <div className="card-order d-sm-flex d-none" style={{ width: "fit-content", minWidth: "unset" }}>
                                <svg onClick={() => setOrder("horizontal")} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.25 11.2498H3.75C3.33579 11.2498 3 11.5855 3 11.9998C3 12.414 3.33579 12.7498 3.75 12.7498H20.25C20.6642 12.7498 21 12.414 21 11.9998C21 11.5855 20.6642 11.2498 20.25 11.2498Z" fill={order === "horizontal" ? "#444545" : "#BBBBBB"} />
                                    <path d="M20.25 6.00024H3.75C3.33579 6.00024 3 6.33603 3 6.75024C3 7.16446 3.33579 7.50024 3.75 7.50024H20.25C20.6642 7.50024 21 7.16446 21 6.75024C21 6.33603 20.6642 6.00024 20.25 6.00024Z" fill={order === "horizontal" ? "#444545" : "#BBBBBB"} />
                                    <path d="M20.25 16.5H3.75C3.33579 16.5 3 16.8358 3 17.25C3 17.6642 3.33579 18 3.75 18H20.25C20.6642 18 21 17.6642 21 17.25C21 16.8358 20.6642 16.5 20.25 16.5Z" fill={order === "horizontal" ? "#444545" : "#BBBBBB"} />
                                </svg>
                                <svg onClick={() => setOrder("vertical")} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M14.25 0H3.75C2.7558 0.00119089 1.80267 0.396661 1.09966 1.09966C0.396661 1.80267 0.00119089 2.7558 0 3.75L0 14.25C0.00119089 15.2442 0.396661 16.1973 1.09966 16.9003C1.80267 17.6033 2.7558 17.9988 3.75 18H14.25C15.2442 17.9988 16.1973 17.6033 16.9003 16.9003C17.6033 16.1973 17.9988 15.2442 18 14.25V3.75C17.9988 2.7558 17.6033 1.80267 16.9003 1.09966C16.1973 0.396661 15.2442 0.00119089 14.25 0ZM12 8.25H9.75V6H12V8.25ZM13.5 6H16.5V8.25H13.5V6ZM9.75 4.5V1.5H12V4.5H9.75ZM8.25 4.5H6V1.5H8.25V4.5ZM8.25 6V8.25H6V6H8.25ZM4.5 8.25H1.5V6H4.5V8.25ZM1.5 9.75H4.5V12H1.5V9.75ZM6 9.75H8.25V12H6V9.75ZM8.25 13.5V16.5H6V13.5H8.25ZM9.75 13.5H12V16.5H9.75V13.5ZM9.75 12V9.75H12V12H9.75ZM13.5 9.75H16.5V12H13.5V9.75ZM16.5 3.75V4.5H13.5V1.5H14.25C14.8467 1.5 15.419 1.73705 15.841 2.15901C16.2629 2.58097 16.5 3.15326 16.5 3.75ZM3.75 1.5H4.5V4.5H1.5V3.75C1.5 3.15326 1.73705 2.58097 2.15901 2.15901C2.58097 1.73705 3.15326 1.5 3.75 1.5ZM1.5 14.25V13.5H4.5V16.5H3.75C3.15326 16.5 2.58097 16.2629 2.15901 15.841C1.73705 15.419 1.5 14.8467 1.5 14.25ZM14.25 16.5H13.5V13.5H16.5V14.25C16.5 14.8467 16.2629 15.419 15.841 15.841C15.419 16.2629 14.8467 16.5 14.25 16.5Z" fill={order === "vertical" ? "#444545" : "#BBBBBB"} />
                                </svg>
                            </div>
                        </div>
                        {order === "horizontal" && window.innerWidth >= 400 ?
                            <>
                                {listedProperties?.length > 0 ? (
                                    window.innerWidth > 576 ? 
                                        listedProperties.map((item, index) => (
                                            <HorizontalCard key={`listed-horizontal-${item?.id || item?.property_id || index}`} label={item.label} data={item} />
                                        ))
                                        :
                                        listedProperties.map((item, index) => (
                                            <HorizontalCardMobile key={`listed-mobile-${item?.id || item?.property_id || index}`} label={item.label} data={item} />
                                        ))
                                ) : (
                                    <div className="col-12 p-0">
                                        <NoResultFound />
                                    </div>
                                )}
                            </>
                            :
                            <>
                                {listedProperties?.length ? (
                                    <div className="grid" style={{ overflow: 'hidden', overflowX: 'hidden', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                                        {listedProperties?.map((item, index) => (
                                            <Card temporarily={window.innerWidth < 400 && true} key={`listed-grid-${item?.id || item?.property_id || index}`} data={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="col-12 p-0">
                                        <NoResultFound />
                                    </div>
                                )}
                            </>
                        }
                    </div>

                    <div className="col-lg-3 d-sm-inline-block d-none">
                        {Array.isArray(adData) && adData.length > 0 ? (
                            adData.map((item, index) => (
                                closedAds.includes(index) ?
                                    "" : (
                                        <a key={`agent-ad-${item?.id || index}`} href={item?.url} target='_blank'>
                                            <div className="d-flex" style={{ gap: "10px", flexWrap: 'wrap', marginBottom: "10px" }}>
                                                <div className="ad-global-box w-100 h-100">
                                                    {/* <div className="close-btn" onClick={() =>
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
                                                    </div> */}
                                                    <FallbackImage src={item?.image} alt="" componentName="SoldProperties" />
                                                </div>
                                            </div>
                                        </a>

                                    )))
                        ) : (
                            <div className="no-ad-results text-center py-5">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/7486/7486761.png"
                                    alt="No results"
                                    style={{ width: "120px", opacity: 0.7, marginBottom: "15px" }}
                                />
                                <h5>No Ads Found</h5>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

export default ListedProperties
