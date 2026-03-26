import React, { useEffect, useState } from 'react';
function Amenities({ profileData }) {
    const [activeTab, setActiveTab] = useState();
   useEffect(() => {
    if (profileData?.amenities?.length) {
        const firstValidAmenity = profileData.amenities.find(item => 
            item?.data?.length > 0 || item?.amenities_list?.length > 0
        );

        if (firstValidAmenity) {
            setActiveTab(firstValidAmenity);
        }
    }
}, [profileData]);
    
    const renderTabContent = () => {
        const currentFeatures = activeTab?.data;
        if (currentFeatures) {
            return (
                <div id='amenities-features' className="features-grid row" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {currentFeatures.map((feature, index) => {
                        if(feature.label!==null){
                            return (
                                <div
                                    key={index}
                                    style={{ width: '33.3333%', display: 'flex', alignItems: 'center', paddingBottom: '10px' }}
                                    className="feature-item"
                                >
                                    <span className="svg-placeholder">
                                        {/* <img
                                            src={feature.image}
                                            alt={feature.label}
                                            width="20"
                                            height="20"
                                            style={{ objectFit: 'contain' }}
                                        /> */}
                                    {feature?.icon_class ? <div dangerouslySetInnerHTML={{ __html: feature?.icon_class }}/> :<i className="fa-regular fa-building"></i>}
                                    </span>
                                    <span style={{ marginLeft: '5px', wordBreak: 'break-word' }}>{feature.label}</span>
                                </div>
                                    
                                )
                        }
                        
                    })}
                
                </div>
            );
        }
        return (
            <div className="empty-tab">
                No content available for <strong>{activeTab}</strong>.
            </div>
        );
    };

    return (
        <>
            <h3 className="amenities-heading">Amenities</h3>
            <div className="amenities-container">
                {/* Tabs */}
                <div className="tabs-row">
                    {profileData?.amenities?.map((tab) => {
                        const isDisabled = !tab?.data || tab.data.length === 0;
                        return (
                            <button
                                key={tab.name || tab.category_name}
                                className={`tab-button ${activeTab?.name === tab?.name ? 'active' : isDisabled ? 'disabled' : ''}`}
                                onClick={() => !isDisabled && setActiveTab(tab)}
                                disabled={isDisabled}
                                style={isDisabled ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                            >
                                {tab?.category_name || tab?.name}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="tab-content">{renderTabContent()}</div>
            </div>
        </>
    );
}

export default Amenities;
