import React, { useEffect, useState } from 'react';
import emptyWishlistImage from '../../Asset/HomePage/rafiki.svg';
import mapImage from '../../Asset/HomePage/saved.png';
import bgImg from '../../Asset/HomePage/Map bg.png';
import { FallbackImage } from '../Metiral/FallbackImage';
import CustomTooltip from '../Metiral/CustomTooltip';
import { useAuth } from '../../Context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../Metiral/BreadCrumb';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton';
import PrimaryButton from '../Metiral/Button/PrimaryButton';

import Image from 'next/image';
function Banner() {
    const navigate = useNavigate()
    const { savedSearches, deleteSavedSearch, buildSearchPayloadProperty, objectToQueryString, getSavedSearches } = useAuth();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleRemoveSaveCard = async (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await deleteSavedSearch(itemToDelete);
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
    }

    const handlePostSearchPropertyData = async (clickedCard) => {
        if (!clickedCard?.filters) return;

        const data = await buildSearchPayloadProperty(clickedCard.filters);
        const queryParams = objectToQueryString(data);

        navigate(`/properties?${queryParams}`);
    };

    useEffect(() => {
        getSavedSearches()
    }, [])

    return (
        <div className="wishlist_banner card-section">
            <div className="row m-0" style={{ gap: '10px' }}>
                <div style={{ marginTop: "12px", marginBottom: "14px" }} className="col-12 p-0">
                    {/* <div className="page-crumb">
                        <span>Home</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M11.55 7.40962L8.10747 3.96712C7.96695 3.82743 7.77686 3.74902 7.57872 3.74902C7.38058 3.74902 7.1905 3.82743 7.04997 3.96712C6.97968 4.03684 6.92388 4.11979 6.88581 4.21119C6.84773 4.30258 6.82812 4.40061 6.82812 4.49962C6.82812 4.59863 6.84773 4.69666 6.88581 4.78805C6.92388 4.87945 6.97968 4.9624 7.04997 5.03212L10.5 8.46712C10.5703 8.53684 10.6261 8.61979 10.6641 8.71119C10.7022 8.80258 10.7218 8.90061 10.7218 8.99962C10.7218 9.09863 10.7022 9.19666 10.6641 9.28805C10.6261 9.37945 10.5703 9.4624 10.5 9.53212L7.04997 12.9671C6.90875 13.1074 6.82901 13.2979 6.82831 13.497C6.8276 13.696 6.90599 13.8871 7.04622 14.0284C7.18646 14.1696 7.37705 14.2493 7.57607 14.25C7.7751 14.2507 7.96625 14.1724 8.10747 14.0321L11.55 10.5896C11.9713 10.1677 12.208 9.59587 12.208 8.99962C12.208 8.40337 11.9713 7.83149 11.55 7.40962Z" fill="#555555" />
                        </svg>
                        <span>Properties</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M11.55 7.40962L8.10747 3.96712C7.96695 3.82743 7.77686 3.74902 7.57872 3.74902C7.38058 3.74902 7.1905 3.82743 7.04997 3.96712C6.97968 4.03684 6.92388 4.11979 6.88581 4.21119C6.84773 4.30258 6.82812 4.40061 6.82812 4.49962C6.82812 4.59863 6.84773 4.69666 6.88581 4.78805C6.92388 4.87945 6.97968 4.9624 7.04997 5.03212L10.5 8.46712C10.5703 8.53684 10.6261 8.61979 10.6641 8.71119C10.7022 8.80258 10.7218 8.90061 10.7218 8.99962C10.7218 9.09863 10.7022 9.19666 10.6641 9.28805C10.6261 9.37945 10.5703 9.4624 10.5 9.53212L7.04997 12.9671C6.90875 13.1074 6.82901 13.2979 6.82831 13.497C6.8276 13.696 6.90599 13.8871 7.04622 14.0284C7.18646 14.1696 7.37705 14.2493 7.57607 14.25C7.7751 14.2507 7.96625 14.1724 8.10747 14.0321L11.55 10.5896C11.9713 10.1677 12.208 9.59587 12.208 8.99962C12.208 8.40337 11.9713 7.83149 11.55 7.40962Z" fill="#555555" />
                        </svg>
                        Saved Searches
                    </div> */}
                    <BreadCrumb items={["Home", "Saved Searches"]} paths={["/", "/saved-searches"]} />
                </div>
            </div>

            <h5 className="mb-0">Saved Searches</h5>

            {(!savedSearches || Object.keys(savedSearches).length === 0) && (
                <div className="empty_property">
                    <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ minHeight: "520px" }}
                    >
                        <FallbackImage src={emptyWishlistImage} alt="No saved searches" />
                        <h5 className="mb-0 mt-2">No Saved Searches</h5>
                        <p>Save your location, budget and filters so you can just click and see.</p>
                    </div>
                </div>
            )}


            {savedSearches && (
                <>
                    {savedSearches.map((data, index) => {
                        const {
                            city,
                            locations,
                            purpose,
                            bedroom,
                            bathroom,
                            areaRange,
                            priceRange,
                            more,
                            propertyType,
                        } = data?.filters || {};

                        return (
                            <div key={index} className="saved_search_list" style={{ cursor: 'pointer' }} onClick={() => handlePostSearchPropertyData(data)}>
                                <div className="search_card">
                                    <div className="img_search">
                                        <FallbackImage src={mapImage} alt="..." />
                                    </div>

                                    <div className="card_body_search">
                                        <div className='w-100'>
                                          <div className="d-flex align-items-center justify-content-between mb-sm-0 mb-2" style={{width:"100%"}}>
                                          {(city?.city || locations?.[0]?.name) && (
                                                <h6 className='pe-3 mb-sm-1 mb-0'>
                                                    {locations?.length > 0 ? locations.map(loc => loc?.name).join(", ") : ""}
                                                    {city?.city && locations?.length > 0 ? `, ${city.city}` : city?.city || ""}
                                                </h6>
                                            )}
                                             <button className='d-sm-none d-inline-block' style={{position:"unset !important" , padding:"0 12px 0 48px" , width:'48px' , display:"flex" , alignItems:"center" , justifyContent:"center"}}  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveSaveCard(data?.id);
                                                }}
                                                // onTouchEnd={(e) => {
                                                //     e.stopPropagation();
                                                //     handleRemoveSaveCard(data?.id);
                                                // }}
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                                    <path d="M7 9V15" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11 9V15" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M1 5H17" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 5H9H15V16C15 17.6569 13.6569 19 12 19H6C4.34315 19 3 17.6569 3 16V5Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6 3C6 1.89543 6.89543 1 8 1H10C11.1046 1 12 1.89543 12 3V5H6V3Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                        </button>
                                          </div>

                                            <div className="values" style={{ flexWrap: "wrap", gap: "10px 0" }}>
                                                {purpose?.name && <span>{purpose.name}</span>}

                                                {bedroom?.length > 0 && (
                                                    <span>{bedroom.join(", ")} {bedroom.length === 1 ? "bed" : "beds"}</span>
                                                )}

                                                {bathroom?.length > 0 && (
                                                    <span>{bathroom.join(", ")} {bathroom.length === 1 ? "bath" : "baths"}</span>
                                                )}

                                                {areaRange?.min && areaRange?.max && (
                                                    <span>
                                                        Area: {areaRange.min} to {areaRange.max} {
                                                            typeof areaRange?.areaValue === 'object' && areaRange?.areaValue !== null
                                                                ? areaRange?.areaValue?.name || areaRange?.areaValue?.code || ''
                                                                : areaRange?.areaValue || ''
                                                        }
                                                    </span>
                                                )}

                                                {priceRange?.min && priceRange?.max && (
                                                    <span>
                                                        Price: {priceRange.min} to {priceRange.max} {
                                                            typeof priceRange?.priceValue === 'object' && priceRange?.priceValue !== null
                                                                ? priceRange?.priceValue?.code || priceRange?.priceValue?.name || ''
                                                                : priceRange?.priceValue || ''
                                                        }
                                                    </span>
                                                )}

                                                {more?.length > 0 && more.map((item, i) => <span key={i}>{item}</span>)}

                                                {/* Type (category + subtype) */}
                                                {(() => {
                                                    const categories = purpose?.categories || [];
                                                    const typeId = propertyType?.type;
                                                    const subTypeVal = propertyType?.subType;

                                                    const directCategory = categories.find(cat => cat.id === typeId);
                                                    const categoryContainingType = categories.find(cat =>
                                                        Array.isArray(cat.sub_categories) && cat.sub_categories.some(sub => sub.id === typeId)
                                                    );

                                                    const category = directCategory || categoryContainingType || null;

                                                    const subTypeIds = subTypeVal == null
                                                        ? []
                                                        : Array.isArray(subTypeVal) ? subTypeVal : [subTypeVal];

                                                    const matchingSubCategories = category?.sub_categories?.filter(sub => subTypeIds.includes(sub.id)) || [];

                                                    return (
                                                        <div className="type-block d-flex" style={{ gap: "8px" }}>
                                                            {category?.name && <span className="type-name">{category.name}</span>}

                                                            {matchingSubCategories.length > 0 && (
                                                                <div className="subtypes d-flex" style={{ gap: "8px" }}>
                                                                    {matchingSubCategories.map(sub => (
                                                                        <span key={sub.id} className="subtype-name">{sub.name}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        {
                                            window?.innerWidth > 576 ?
                                           <>
                                            <button>
                                                <CustomTooltip title="Delete" placement="top">
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveSaveCard(data?.id);
                                                        }}
                                                        onTouchEnd={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveSaveCard(data?.id);
                                                        }}
                                                        style={{ display: 'inline-block', cursor: 'pointer' }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                                            <path d="M7 9V15" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M11 9V15" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M1 5H17" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M3 5H9H15V16C15 17.6569 13.6569 19 12 19H6C4.34315 19 3 17.6569 3 16V5Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 3C6 1.89543 6.89543 1 8 1H10C11.1046 1 12 1.89543 12 3V5H6V3Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </CustomTooltip>
                                            </button>
                                           </>
                                        :
                                       <>
                                       
                                       </>
                                        }

                                        <Image src={bgImg} className="bg-img-map" alt="..." />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box className="qc-box quota-confirmation-box">
                    {/* Warning Icon */}
                    <div className="qc-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
                            <path d="M86.0235 62.2189L55.9797 11.5674C50.5828 2.45801 37.4172 2.45801 32.0031 11.5674L1.97658 62.2189C-3.54061 71.5002 3.16252 83.2564 13.9563 83.2564H74.0438C84.8375 83.2564 91.5406 71.5002 86.0235 62.2189ZM44 72.0502C40.4422 72.0502 37.5547 69.1627 37.5547 65.6049C37.5547 62.0471 40.4422 59.1596 44 59.1596C47.5578 59.1596 50.4453 62.0471 50.4453 65.6049C50.4453 69.1627 47.5578 72.0502 44 72.0502ZM50.6172 31.0236L49.8266 49.6549C49.6891 52.8689 46.9735 55.3611 43.7594 55.2236C40.7344 55.1033 38.311 52.6799 38.1906 49.6549L37.4 31.0236C37.211 27.3627 40.0297 24.2518 43.6735 24.0627C47.3344 23.8736 50.4453 26.6924 50.6344 30.3361C50.6344 30.5768 50.6344 30.8002 50.6172 31.0236Z" fill="#C94444" />
                        </svg>
                    </div>
                    {/* Title */}
                    <div className="title" style={{
                        color: '#2D2D2D',
                        fontSize: '24px',
                        fontWeight: '600',
                        lineHeight: '32px',
                        marginTop: '16px',
                        marginBottom: '12px',
                        fontFamily: '"DM Sans", sans-serif'
                    }}>
                        Delete Saved Search?
                    </div>
                    {/* Message */}
                    <div className="para" style={{
                        color: '#555555',
                        fontSize: '15px',
                        fontWeight: '400',
                        lineHeight: '22px',
                        textAlign: 'center',
                        marginBottom: '28px',
                        padding: '0 8px',
                        fontFamily: '"DM Sans", sans-serif'
                    }}>
                        Are you sure you want to delete this saved search? This action cannot be undone.
                    </div>
                    {/* Buttons */}
                    <div className="qc-buttons">
                        <PrimaryBorderButton text="No" height="32px" onFunction={handleCloseDeleteModal} padding={"8px 12px"} widthSize={"102px"} />
                        <PrimaryButton text="Yes" height="32px" onFunction={handleConfirmDelete} padding={"8px 12px"} widthSize={"102px"} />
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Banner;
