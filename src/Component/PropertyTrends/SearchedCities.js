import home from '../../Asset/Property Index/home.svg'
import home_selected from '../../Asset/Property Index/home_selected.svg'
import plot from '../../Asset/Property Index/plot.svg'
import plot_selected from '../../Asset/Property Index/plot_selected.svg'
import building from '../../Asset/Property Index/building.svg'
import building_selected from '../../Asset/Property Index/building_selected.svg'
import { useEffect, useState } from 'react'
import decrementGraph from '../../Asset/Property Index/decrementGraph.svg'
import incrementGraph from '../../Asset/Property Index/incerementGraph.svg'
import Chart from './Chart'
import { FallbackImage } from '../Metiral/FallbackImage'
import NoListing from '../Metiral/NoListing'
import noListing from '../../Asset/Property Index/noListing.svg'

const incrementArrow = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M16 7H22V13" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const decrementArrow = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M16 17H22V11" stroke="#C94444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 17L13.5 8.5L8.5 13.5L2 7" stroke="#C94444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>

function SearchedCities({ data, handleNaviagte, loading }) {
    const [activeTab, setActiveTab] = useState("Home")
    const [tabData, setTabData] = useState([])
    const [activeTabData, setActiveTabData] = useState([])
    const icons = {
        Home: home,
        Plots: plot,
        Commercial: building,
        Home_select: home_selected,
        Plots_select: plot_selected,
        Commercial_select: building_selected,
    }

    useEffect(() => {
        if (data?.length) {
            // Filter out tabs that have no cities data
            let updateData = data
                ?.filter((item) => item?.cities && item?.cities.length > 0)
                ?.map((item) => {
                    return {
                        tabName: item?.category_name,
                        icon: icons?.[item?.category_name],
                        activeIcon: icons?.[item?.category_name + "_select"],
                        cities: item?.cities
                    }
                })
            
            // Only set tab data if there are tabs with data
            if (updateData && updateData.length > 0) {
                setTabData(updateData)
                setActiveTab(updateData[0]?.tabName)
                setActiveTabData(updateData[0]?.cities)
            } else {
                setTabData([])
                setActiveTabData([])
            }
        } else {
            setTabData([])
            setActiveTabData([])
        }
    }, [data])

    const citiesData = [
        {
            cityName: "Lahore",
            tableData: [
                { locationName: "DHA Defence", graphType: "increment", percentage: "+92%" },
                { locationName: "Bahria Safari Villas", graphType: "decrement", percentage: "-36%" },
                { locationName: "Valencia Town", graphType: "increment", percentage: "+97%" },
                { locationName: "Wapda Town", graphType: "increment", percentage: "+65%" },
            ],
        },
        {
            cityName: "Karachi",
            tableData: [
                { locationName: "DHA Defence", graphType: "increment", percentage: "+92%" },
                { locationName: "Bahria Safari Villas", graphType: "decrement", percentage: "-36%" },
                { locationName: "Valencia Town", graphType: "increment", percentage: "+97%" },
                { locationName: "Wapda Town", graphType: "increment", percentage: "+65%" },
            ],
        },
        {
            cityName: "Islamabad",
            tableData: [
                { locationName: "DHA Defence", graphType: "increment", percentage: "+92%" },
                { locationName: "Bahria Safari Villas", graphType: "decrement", percentage: "-36%" },
                { locationName: "Valencia Town", graphType: "increment", percentage: "+97%" },
                { locationName: "Wapda Town", graphType: "increment", percentage: "+65%" },
            ],
        },
        {
            cityName: "Rawalpindi",
            tableData: [
                { locationName: "DHA Defence", graphType: "increment", percentage: "+92%" },
                { locationName: "Bahria Safari Villas", graphType: "decrement", percentage: "-36%" },
                { locationName: "Valencia Town", graphType: "increment", percentage: "+97%" },
                { locationName: "Wapda Town", graphType: "increment", percentage: "+65%" },
            ],
        },
    ];

    return (
        <>
            <div className="property-trend-searched-cities">
                <div className="title">Latest Property Search Trends in Major Pakistani Cities</div>
                <div className="tab-box">
                    {loading ? (
                        <>
                            {[...Array(3)].map((_, index) => {
                                return (
                                    <div className="tab p-0 border-0 placeholder-glow" key={index}>
                                        <div className="placeholder" style={{ height: "40px", maxWidth: "180px", width: '100%' }} />
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        tabData && tabData.length > 0 ? (
                            tabData.map((item) => (
                                <div key={item?.tabName} className={`tab ${activeTab === item?.tabName ? "active" : ''}`} onClick={() => {
                                    setActiveTab(item?.tabName)
                                    setActiveTabData(item?.cities)
                                }}>
                                    <FallbackImage src={activeTab === item?.tabName ? item?.activeIcon : item?.icon} alt="" componentName="SearchedCities" /> {item?.tabName}
                                </div>
                            ))
                        ) : null
                    )}
                </div>
                <div className="row" style={{ marginTop: '24px', gap: '24px 0' }}>
                    {loading ? (
                        <>
                            {[...Array(2)].map((_, index) => {
                                return (
                                    <div className="col-lg-6 px-xl-3 px-sm-2 px-0" key={index}>
                                        <div className="search-card p-0 border-0 placeholder-glow">
                                            <div className="placeholder w-100" style={{ height: "300px" }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : !activeTabData || activeTabData.length === 0 ? (
                        <div className="col-12">
                            <NoListing />
                        </div>
                    ) : (
                        activeTabData?.map((item) => (
                            <div className="col-lg-6 px-xl-3 px-sm-2 px-0" key={item.cityName}>
                                <div className="search-card">
                                    <div className="city-name">{item?.city_name}</div>
                                    <div className="div h-100" style={{ overflowX: 'scroll', overflowY: "none" }}>
                                        <div className="table-top">
                                            <div className="header-name">Location</div>
                                            <div className="header-name trend">Trend</div>
                                            <div className="header-name">Search Percentage</div>
                                        </div>
                                        <div className="table-body">
                                            {!item?.locations || item?.locations.length === 0 ? (
                                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px', flexDirection: 'column', padding: '20px' }}>
                                                    <div style={{ maxWidth: '300px', width: '100%' }}>
                                                        <FallbackImage src={noListing} alt="No listing found" componentName="NoListing" />
                                                    </div>
                                                    <div className='text-center' style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>No listing found</div>
                                                </div>
                                            ) : (
                                                item?.locations.map((items, index) => (
                                                    <div onClick={() => {
                                                        handleNaviagte({ property_type_id: "1", city_code: item?.city_code, location_id: items?.location_id, blocks_data: true })
                                                    }} className="table-row" key={index}>
                                                        <div className="location-name">{items?.location_name}</div>
                                                        <div className="graph">
                                                            <Chart trend={items?.trend} graph_data={items?.graph_data} width={100} height={80} marginLeft={"-8px"} />
                                                        </div>
                                                        <div className={`percentage ${items?.trend === "up" ? "increment" : "decrement"}`}>
                                                            {items?.trend === "up" ? "+" : "-"}{items?.percentage_of_total}%
                                                            {items?.trend === "up" ? incrementArrow : decrementArrow}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </>
    )
}

export default SearchedCities
