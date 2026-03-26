import { useEffect, useState } from "react";
import Card from '../../Component/Metiral/Card'
import NoResultFound from '../Metiral/NoResultFound'
function AgencyProperties({ data, property_types }) {
    const [activeTab, setActiveTab] = useState("ALL")
    const [listData, setlistData] = useState([])
    const CustomTabName = ["ALL", "For Sale", " For Rent"]
    // Check if any tab has data
    const hasAnyData = () => {
        const totalCount = (data?.sell_count || 0) + (data?.rent_count || 0);
        return totalCount > 0;
    };
    
    // Get count for a specific tab
    const getTabCount = (tabName) => {
        if (tabName === "ALL") {
            return (data?.sell_count || 0) + (data?.rent_count || 0);
        } else if (tabName === "For Sale") {
            return data?.sell_count || 0;
        } else if (tabName === " For Rent") {
            return data?.rent_count || 0;
        }
        return 0;
    };
    
    // Get data for a specific tab name
    const getDataForTab = (tabName) => {
        if (tabName === "ALL") {
            // Combine all properties from all property_types
            return property_types?.reduce((acc, type) => {
                return [...acc, ...(type?.properties || [])];
            }, []) || [];
        }
        
        // Match property types by name based on tab
        if (tabName === "For Sale") {
            // For Sale: match property types with names containing "Sale", "Buy", or "Sell"
            const matchedTypes = property_types?.filter(type => {
                const typeNameLower = type?.name?.toLowerCase() || '';
                return typeNameLower.includes('sale') || 
                       typeNameLower.includes('buy') || 
                       typeNameLower.includes('sell');
            }) || [];
            
            // Combine all properties from matched types
            return matchedTypes.reduce((acc, type) => {
                return [...acc, ...(type?.properties || [])];
            }, []);
        } else if (tabName === " For Rent") {
            // For Rent: match property types with names containing "Rent"
            const matchedTypes = property_types?.filter(type => {
                const typeNameLower = type?.name?.toLowerCase() || '';
                return typeNameLower.includes('rent');
            }) || [];
            
            // Combine all properties from matched types
            return matchedTypes.reduce((acc, type) => {
                return [...acc, ...(type?.properties || [])];
            }, []);
        }
        
        return [];
    };

    useEffect(() => {
        if (property_types?.length > 0) {
            setActiveTab("ALL")
            // Combine all properties from all property_types for ALL tab
            const allProperties = property_types?.reduce((acc, type) => {
                return [...acc, ...(type?.properties || [])];
            }, []) || [];
            setlistData(allProperties)
        }
    }, [property_types])


    // If no tab has any data, show NoResultFound under heading
    if (!hasAnyData()) {
        return (
            <div className='agency-properties'>
                <div className="heading">Properties by {data?.agency_name ? data?.agency_name : data?.user?.name}</div>
                <NoResultFound />
            </div>
        )
    }

    return (
        <div className='agency-properties'>
            <div className="heading">Properties by {data?.agency_name ? data?.agency_name : data?.user?.name}</div>
            <div className="properties-box">
                <div className="tab-box">
                    {CustomTabName?.map((tabName, index) => {
                        const count = getTabCount(tabName);
                        return (
                            <div 
                                key={index}
                                className={activeTab === tabName ? "tab active" : "tab"} 
                                onClick={() => {
                                    setActiveTab(tabName)
                                    setlistData(getDataForTab(tabName))
                                }}
                            >
                                {tabName} ({count})
                            </div>
                        )
                    })}
                </div>
                {/* <div className="property-table">
                    <div className="head">
                        <div>Properties</div>
                        <div>No. of Properties</div>
                        <div>Price Range</div>
                        <div>Other</div>
                    </div>
                    <div className="body">
                        {listData?.map((item, idx) => (
                                <>
                                    <div className="box">
                                        <Link to='/agency-property-Listing' style={{ textDecoration: 'none' }}><div className="data"><div className="link">
                                            <span> {item.name}</span></div></div></Link>
                                        <div className="data">{item.total}</div>
                                        <div className="data">Rs. 2,00,000 – Rs. 4,00,000</div>
                                        <div className="data">Other</div>
                                    </div>
                                    {idx !== data.length - 1 && <Line />}
                                </>
                            ))
                        }
                    </div>
                </div> */}
                {listData?.length > 0 && window.innerWidth > 576 ? (
                    <div className='grid card_main_home mt-0' style={{ gap: '16px 24px' }}>
                        {listData?.map((item, index) => {
                            return (
                                <Card key={index} data={item} />
                            )
                        })}
                    </div>
                ) : listData?.length > 0 && window.innerWidth <= 576 ? (
                    <div className='list card_main_home mt-0 global-scroll-box d-flex' style={{ gap: '16px 24px' }}>
                        {listData?.map((item, index) => {
                            return (
                                <Card mobileChanged={true} key={index} data={item} />
                            )
                        })}
                    </div>
                ) : (
                    <NoResultFound />
                )}
            </div>
        </div>
    )
}

export default AgencyProperties
