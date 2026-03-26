import React, { useState } from 'react'
import BreadCrumb from '../Metiral/BreadCrumb'
import SingleTypeFeild from '../Metiral/InputField/SingleMenuFeild/SingleTypeFeild'
import { Link } from 'react-router-dom';
import './helpcenter.css'
function Banner({ subcategories }) {
    const [filterData, setFilterData] = useState({});
    return (
        <>
            <div className='help-center-subcategory-banner'>
                <div className='main-container'>
                    <div>
                        <div className='d-flex align-items-center justify-content-between mt-3 gap-2'>
                            <BreadCrumb items={['Help Center', subcategories?.category?.title]} paths={['/help-center', '/help-center-subcategory/how-to-buy-a-property']} />
                            {/* <div style={{ width: '300px' }}>
                                <SingleTypeFeild filterData={filterData} setFilterData={setFilterData} varName={'propertyType'} label={'Search by Topic'} input={true} />
                            </div> */}

                        </div>
                        <div className='row m-0'>
                            <div className='col-lg-9 col-12 p-0'>
                                <h3>{subcategories?.category?.title}</h3>
                                <p>{subcategories?.category?.description}</p>
                                <hr />
                                <div className='row m-0'>
                                    {subcategories?.category?.subcategories?.map((item, idx) => {
                                        return (
                                            <div key={idx} className='col-lg-6 col-12 p-0 mt-2'>
                                                <h4>{item?.title}</h4>
                                                <div className='d-flex flex-column gap-2'>
                                                    {item?.articles?.map((topic, i) => {
                                                        return (
                                                            <Link key={i} to={`/help-center-topic/${topic?.slug}`}>{topic?.title}</Link>
                                                        )
                                                    })}

                                                </div>


                                            </div>
                                        )
                                    })}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Banner