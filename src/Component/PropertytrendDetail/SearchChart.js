import { useEffect, useState, useMemo } from 'react'
import home from '../../Asset/Property Index/home.svg'
import home_selected from '../../Asset/Property Index/home_selected.svg'
import plot from '../../Asset/Property Index/plot.svg'
import plot_selected from '../../Asset/Property Index/plot_selected.svg'
import building from '../../Asset/Property Index/building.svg'
import building_selected from '../../Asset/Property Index/building_selected.svg'
import Chart from '../PropertyTrends/Chart'
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

const icons = {
    Home: home,
    Plots: plot,
    Commercial: building,
    Home_select: home_selected,
    Plots_select: plot_selected,
    Commercial_select: building_selected,
}

function SearchedTrend({ locationName, tableData, handleNaviagte, cityName }) {

    const [activeTab, setActiveTab] = useState("Home")
    const [tabData, setTabData] = useState([])
    const [activeTabData, setActiveTabData] = useState([])
    useEffect(() => {
        if (tableData?.length) {
            // Filter out tabs that have no cities data
            let updateData = tableData
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
                // Find the first tab that has data (cities with locations)
                const tabWithData = updateData.find(tab =>
                    tab?.cities?.length > 0 &&
                    tab.cities.some(city => city?.locations?.length > 0)
                )

                // Set active tab to the one with data, or first tab if none found
                if (tabWithData) {
                    setActiveTab(tabWithData.tabName)
                    setActiveTabData(tabWithData.cities)
                } else {
                    setActiveTab(updateData[0]?.tabName)
                    setActiveTabData(updateData[0]?.cities)
                }
                setTabData(updateData)
            } else {
                setTabData([])
                setActiveTabData([])
            }
        } else {
            // Reset if no tableData
            setTabData([])
            setActiveTabData([])
        }
    }, [tableData])

    return (
        <>
            <div className="main-container">
                <div className='top-search-property'>
                    <h1>Search trends in Top {locationName ? `areas of ${locationName}` : `Socities of ${cityName ? cityName : "Lahore"}`} </h1>
                    {tabData && tabData.length > 0 ? (
                        <div className="tab-box">
                            {tabData.map((item) => (
                            <div key={item?.tabName} className={`tab ${activeTab === item?.tabName ? "active" : ''}`} onClick={() => {
                                setActiveTab(item?.tabName)
                                setActiveTabData(item?.cities)
                            }}>
                                <FallbackImage src={activeTab === item?.tabName ? item?.activeIcon : item?.icon} alt="" componentName="SearchedCities" /> {item?.tabName}
                            </div>
                            ))}
                        </div>
                    ) : null}
                </div>
                {!activeTabData || activeTabData.length === 0 ? (
                    <div style={{ marginBlock: "40px" }}>
                        <NoListing />
                    </div>
                ) : (
                    activeTabData?.map((item) => (
                        <div className="top-searched-societies" key={item?.city_code || item?.city_name}>
                            <div className="title">{item?.city_name}</div>
                            <div className="div h-100" style={{ overflowX: "scroll", overflowY: "none" }}>
                                <div className="table-top" style={{ minWidth: "800px" }}>
                                    <div className="header-name rank">Rank</div>
                                    <div className="header-name location">Location</div>
                                    <div className="header-name trend">Trend</div>
                                    <div className="header-name search">Search Properties</div>
                                </div>
                                <div className="table-body" style={{ minWidth: "800px" }}>
                                    {!item?.locations || item?.locations.length === 0 ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px', flexDirection: 'column', padding: '20px' }}>
                                            <div style={{ maxWidth: '300px', width: '100%' }}>
                                                <FallbackImage src={noListing} alt="No listing found" componentName="NoListing" />
                                            </div>
                                            <div className='text-center' style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>No listing found</div>
                                        </div>
                                    ) : (
                                        item?.locations?.map((data, index) => {

                                            return (
                                                <div className="table-row" key={data?.location_id || index} onClick={() => {
                                                    handleNaviagte({ property_type_id: "1", city_code: item?.city_code, location_id: data?.location_id, blocks_data: true })
                                                }}>
                                                    <div className="number">{index + 1}</div>
                                                    <div className="location-name">{data?.location_name}</div>
                                                    <div className="graph d-flex justify-content-start align-items-start">
                                                        <Chart left={"-170px"} trend={data?.trend} graph_data={data?.graph_data} width={100} height={80} />
                                                    </div>
                                                    <div className={`percentage ${data?.trend === "up" ? "incremented" : 'decrement'}`}>
                                                        {data?.trend === "up" ? "+" : "-"}{data?.percentage_of_total || 0}%
                                                        {data?.trend === "up" ? incrementArrow : decrementArrow}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default SearchedTrend;
