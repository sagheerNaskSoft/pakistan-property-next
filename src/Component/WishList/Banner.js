import React, { useState, useMemo } from 'react';
import emptyWishlistImage from '../../Asset/HomePage/whishlist_empty.svg';
import { FallbackImage } from '../Metiral/FallbackImage';
import Card from '../Metiral/Card';
import { useAuth } from '../../Context/ContextProvider';
import BreadCrumb from '../Metiral/BreadCrumb';

function Banner() {
    const tabs = ['All', 'Homes', 'Plots', 'Commercial'];
    const [activeTab, setActiveTab] = useState(0);
    const { favouriteList } = useAuth();
    const likedProperties = favouriteList || [];
    const filteredProperties = useMemo(() => {
        if (activeTab === 0) return likedProperties; // All
        if (activeTab === 1) return likedProperties.filter(item => item.category_id === 1); // Homes
        if (activeTab === 2) return likedProperties.filter(item => item.category_id === 2); // Plots
        if (activeTab === 3) return likedProperties.filter(item => item.category_id === 3); // Commercial
        return likedProperties;
    }, [activeTab, likedProperties]);

    return (
        <div className='wishlist_banner card-section mb-5'>
            <div className="row m-0" style={{ gap: '10px' }}>
                <div style={{  marginBottom: "14px" }} className="col-12 p-0">
                  <BreadCrumb items={["Home" , "Wish List"]} paths={["/", "/wish-list"]} />
                </div>
            </div>

            <h5 className='mb-0'>Liked Properties</h5>

            {/* Tabs */}
            <div className='tab_section'>
                <div className="tabs">
                    {tabs.map((tab, index) => (
                        <div
                            key={tab}
                            className={`tab ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            <h6>
                                {tab} ({index === 0
                                    ? likedProperties.length
                                    : index === 1
                                        ? likedProperties.filter(item => item.category_id === 1).length
                                        : index === 2
                                            ? likedProperties.filter(item => item.category_id === 2).length
                                            : likedProperties.filter(item => item.category_id === 3).length
                                })
                            </h6>
                            {activeTab === index && <div className="tab-indicator"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* No Property */}
            {filteredProperties.length === 0 && (
                <div className='empty_property'>
                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: "520px" }}>
                        <FallbackImage src={emptyWishlistImage} alt="No Liked Property" />
                        <h5 className='mb-0 mt-2'>No Liked Property</h5>
                        <p>Please click the heart icon to save your favourite properties and find them here anytime.</p>
                    </div>
                </div>
            )}

            {/* Show Properties */}
            {filteredProperties.length > 0 && (
                <div className='grid' style={{ marginTop: "20px" }}>
                    {filteredProperties.map((item, index) => (
                        <Card temporarily={true} key={item.id || index} data={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Banner;
