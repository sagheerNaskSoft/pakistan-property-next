import React from 'react'
import { useAuth } from '../../Context/ContextProvider'
import { useNavigate } from 'react-router-dom'

function PreLocation({ heading, para }) {
    const { preLocationData, buildSearchPayloadProperty, objectToQueryString, setLocationList, getLOcation } = useAuth()
    const navigate = useNavigate()
    return (
        <div className='pre_location border_top'>
            <div>
                <h6 className='mb-0'>{heading ? heading : "Looking for Your Next Home in Pakistan?"}</h6>
                <p className='mb-0'>{para ? para : <>Browse <b>houses, flats, and plots</b> for sale or rent in Pakistan’s top areas, all verified by <b>Pakistan Property</b></>}</p>
                <div className='row mx-0' style={{ gap: "40px 0" }}>
                    {preLocationData?.map((item,idx) => {
                        return (
                            <div key={idx} style={{ height: "max-content" }} className='col-lg-3 col-md-6 col-12 ps-0'>
                                <h5>{item?.city?.name}</h5>
                                <ul className='p-0 ul_location h-100'>
                                    {item?.locations?.map((items) => (
                                        <li
                                            key={items?.location_id || items?.id}
                                            onClick={async () => {
                                                const dataFind = {
                                                    city: { app_code: items?.city_id },
                                                    area: [{ id: items?.location_id }],
                                                    property_type_id: "1"
                                                };
                                                const data = await buildSearchPayloadProperty(dataFind);
                                                const queryString = objectToQueryString(data);
                                                navigate(`/properties?${queryString}`, { state: dataFind });
                                                let locationResult = await getLOcation({ city_code: items?.city_id })
                                                setLocationList(locationResult?.data || []);
                                            }}
                                        >
                                            {items?.title}
                                        </li>
                                    ))}
                                </ul>
                                <h6 className='m-0'>View All Areas in {item?.city_name} {">"}</h6>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PreLocation