import React from 'react'
import { useAuth } from '../../Context/ContextProvider'
import { useNavigate } from 'react-router-dom'

function PreProperty({ heading, para }) {
    const { prePropertyData, getLOcation, setLocationList, buildSearchPayloadProperty, objectToQueryString } = useAuth()
    const navigate = useNavigate()
    return (
        <div className='pre_location border_top'>
            <div>
                <h6 className='mb-0'>
                    {heading ?
                        heading :
                        'Find Properties in Pakistan’s Major Cities'
                    }
                </h6>
                <p className='mb-0'>{
                    para ?
                        para :
                        <>Search <b>houses, commercial plots, and apartments in Lahore, Karachi, Islamabad, Multan</b>, and other growing cities. Whether you’re buying, selling, or renting, <b>Pakistan Property</b> makes it simple and secure.</>
                }</p>

                <div className='cities-row row mx-0'>
                    {prePropertyData?.map((item,idx) => {
                        return (
                            <div key={idx} className='col-lg-4 col-md-4 col-sm-6 col-10 p-0'>
                                <h5 style={{ marginBottom: "6px" }}>{item?.heading || "House"}</h5>
                                <div className='row m-0'>
                                    {/* Left side (first 4 cities) */}
                                    <div className='col-sm-6 col-5 p-0'>
                                        <ul className='p-0'>
                                            {item?.cities?.slice(0, 4).map((city, i) => (
                                                <li
                                                    key={i}
                                                    onClick={async () => {
                                                        const dataFind = {
                                                            propertyType: { subType: [item?.category_id] },          // ✅ correct key
                                                            city: { app_code: city?.id },
                                                            property_type_id: "1"
                                                        };
                                                        const data = await buildSearchPayloadProperty(dataFind);
                                                        const queryString = objectToQueryString(data)
                                                        navigate(`/properties?${queryString}`, { state: dataFind });
                                                        let locationResult = await getLOcation({ city_code: city?.id })
                                                        setLocationList(locationResult?.data || []);
                                                    }}
                                                   >{city.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Right side (remaining cities) */}
                                    <div className='col-sm-6 col-5 p-0'>
                                        <ul className='p-0'>
                                            {item?.cities?.slice(4).map((city, i) => (
                                                <li key={i} onClick={async () => {
                                                    const dataFind = {
                                                        propertyType: { subType: [item?.category_id] },          // ✅ correct key
                                                        city: { app_code: city?.id },
                                                        property_type_id: "1"
                                                    };

                                                    const data = await buildSearchPayloadProperty(dataFind);
                                                    const queryString = objectToQueryString(data)
                                                    navigate(`/properties?${queryString}`, { state: dataFind });
                                                    let locationResult = await getLOcation({ city_code: city?.id })
                                                    setLocationList(locationResult?.data || []);
                                                }}>{city.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PreProperty