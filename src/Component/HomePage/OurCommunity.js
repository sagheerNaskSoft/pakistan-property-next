import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FallbackImage } from '../Metiral/FallbackImage'
import { useAuth } from '../../Context/ContextProvider'
function OurCommunity({ data }) {
    const { getHomeBlogs, latestBlog, latestNews, getHomeNews } = useAuth()
    useEffect(() => {
        if (!latestBlog?.length) {
            getHomeBlogs()
        }
        if (!latestNews?.length) {
            getHomeNews()
        }
    }, [])
    const navigate = useNavigate()

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }


    let newBlogData = window.innerWidth <= 1400 && window.innerWidth > 992 ? latestBlog?.slice(0, 2) : latestBlog;


    return (
        <div style={{ paddingBottom: "34px" }} className='community_section'>
            <h2 className='section_title'>{data ? data : 'Our Community'}</h2>
            <div className='row '>
                <div className='col-xl-3 col-lg-4 col-12 '>
                    <div className='news'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h6 className='mb-0'>News</h6>
                            <h6 className='mb-0'><Link to={'/all-news'} className='links d-flex align-items-center'>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                            </svg></Link></h6>

                        </div>
                        <div className='d-lg-inline d-sm-flex d-none justify-content-between mb-lg-0 mb-5' style={{ flexWrap: 'wrap' }}>
                            {latestNews?.map((item) => {
                                return (

                                    <div key={item?.slug} onClick={() => {
                                        navigate(`/news-detail/${item?.slug}`)
                                    }} style={{ cursor: "pointer" }} className='news_card row m-0 mt-3'>
                                        <div className='col-md-3 col-sm-2 col-2 p-0'>
                                            <div className='news_img'>
                                                <FallbackImage src={item?.featured_image_url} alt="News" componentName="OurCommunity" />
                                            </div>
                                        </div>
                                        <div className='col-sm-8 col-8 p-0'>
                                            <div className="text-box" style={{ paddingLeft: '9px' }}>
                                                <h6 className='m-0'>{item?.title}</h6>
                                                <p className='m-0'>{formatDate(item?.published_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='d-sm-none d-flex justify-content-start mb-lg-0 mb-5' style={{ flexWrap: 'wrap' }}>
                            {latestNews?.map((item) => {
                                return (

                                    <div key={item?.slug} onClick={() => {
                                        navigate(`/news-detail/${item?.slug}`)
                                    }} style={{ cursor: "pointer" }} className='news_card d-flex m-0 mt-3'>
                                        <div className='news_img'>
                                            <FallbackImage src={item?.featured_image_url} alt="News" componentName="OurCommunity" />
                                        </div>
                                        <div className="text-box" style={{ paddingLeft: '9px' }}>
                                            <h6 className='m-0'>{item?.title}</h6>
                                            <p className='m-0'>{formatDate(item?.published_at)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className='col-xl-9 col-lg-8 col-12'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h6 className='samll_head mb-0'>Blogs</h6>
                        <h6 className='mb-0'><Link to={'/blogs'} className='links d-flex align-items-center'>View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                        </svg></Link></h6>
                    </div>
                    <div className="global-scroll-box">
                        <div className='grid_blog mt-3'>
                            {newBlogData?.map((item) => {
                                return (
                                    <div key={item?.slug} style={{ cursor: "pointer" }} onClick={() => {
                                        navigate(`/blog-detail/${item?.slug}`)
                                    }} className='card_blog'>
                                        <div className='blog_img'>
                                            <FallbackImage src={item?.featured_image_url} alt={item?.featured_image_alt} style={{ height: '170px' }} />
                                        </div>
                                        <div className='blog_card_body'>
                                            <div className="d-flex align-items-center">
                                                <div className="blog-data">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                        <g clipPath="url(#clip0_723_62479)">
                                                            <path d="M10.5 8.50078L7.75078 8.00156C7.5 7.5 7.5 7.28203 7.5 7.00078C7.75078 6.75 8.25 6.50156 8.25 6.25078C8.50078 5.50078 8.50078 5.00156 8.50078 5.00156C8.62969 4.81406 9 4.50234 9 4.00078C9 3.49922 8.50078 3 8.50078 2.75156C8.50078 0.75 7.48125 0 6 0C4.58203 0 3.49922 0.75 3.49922 2.74922C3.49922 3 3 3.49922 3 3.99844C3 4.49766 3.35625 4.82812 3.49922 4.99922C3.49922 4.99922 3.49922 5.49844 3.75 6.24844C3.75 6.49922 4.24922 6.74766 4.5 6.99844C4.5 7.24922 4.5 7.49766 4.24922 7.99922L1.5 8.50078C0.499219 8.74922 0 10.5 0 12H12C12 10.5 11.5008 8.74922 10.5 8.50078Z" fill="#698B75" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_723_62479">
                                                                <rect width="12" height="12" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <div>By Admin </div>
                                                </div>
                                                <div className="blog-data">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                        <path d="M3 11H9C9.39782 11 9.77936 10.842 10.0607 10.5607C10.342 10.2794 10.5 9.89782 10.5 9.5V3.5C10.5 3.23478 10.3946 2.98043 10.2071 2.79289C10.0196 2.60536 9.76522 2.5 9.5 2.5H8.5V1.5C8.5 1.36739 8.44732 1.24021 8.35355 1.14645C8.25979 1.05268 8.13261 1 8 1C7.86739 1 7.74021 1.05268 7.64645 1.14645C7.55268 1.24021 7.5 1.36739 7.5 1.5V2.5H4.5V1.5C4.5 1.36739 4.44732 1.24021 4.35355 1.14645C4.25979 1.05268 4.13261 1 4 1C3.86739 1 3.74021 1.05268 3.64645 1.14645C3.55268 1.24021 3.5 1.36739 3.5 1.5V2.5H2.5C2.23478 2.5 1.98043 2.60536 1.79289 2.79289C1.60536 2.98043 1.5 3.23478 1.5 3.5V9.5C1.5 9.89782 1.65804 10.2794 1.93934 10.5607C2.22064 10.842 2.60218 11 3 11ZM2.5 6.25C2.5 6.1837 2.52634 6.12011 2.57322 6.07322C2.62011 6.02634 2.6837 6 2.75 6H9.25C9.3163 6 9.37989 6.02634 9.42678 6.07322C9.47366 6.12011 9.5 6.1837 9.5 6.25V9.5C9.5 9.63261 9.44732 9.75978 9.35355 9.85355C9.25979 9.94732 9.13261 10 9 10H3C2.86739 10 2.74021 9.94732 2.64645 9.85355C2.55268 9.75978 2.5 9.63261 2.5 9.5V6.25Z" fill="#698B75" />
                                                    </svg>
                                                    <div>{formatDate(item?.published_at) || "-"}</div>
                                                </div>
                                            </div>
                                            <h6>{item?.title}</h6>
                                            <button>Read more <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                                <path d="M8.93408 8.86318C8.99656 8.80121 9.04616 8.72748 9.08001 8.64624C9.11385 8.565 9.13128 8.47786 9.13128 8.38985C9.13128 8.30184 9.11385 8.21471 9.08001 8.13347C9.04616 8.05223 8.99656 7.97849 8.93408 7.91652L5.87408 4.86318C5.81159 4.80121 5.76199 4.72748 5.72815 4.64624C5.6943 4.565 5.67688 4.47786 5.67688 4.38985C5.67688 4.30184 5.6943 4.21471 5.72815 4.13347C5.76199 4.05223 5.81159 3.97849 5.87408 3.91652C5.99899 3.79235 6.16795 3.72266 6.34408 3.72266C6.5202 3.72266 6.68917 3.79235 6.81408 3.91652L9.87408 6.97652C10.2486 7.35152 10.459 7.85985 10.459 8.38985C10.459 8.91985 10.2486 9.42818 9.87408 9.80318L6.81408 12.8632C6.6899 12.9863 6.5223 13.0558 6.34741 13.0565C6.25967 13.057 6.1727 13.0402 6.09147 13.007C6.01025 12.9739 5.93637 12.925 5.87408 12.8632C5.81159 12.8012 5.76199 12.7275 5.72815 12.6462C5.6943 12.565 5.67688 12.4779 5.67688 12.3899C5.67688 12.3018 5.6943 12.2147 5.72815 12.1335C5.76199 12.0522 5.81159 11.9785 5.87408 11.9165L8.93408 8.86318Z" fill="#698B75" />
                                            </svg></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-12'>
                    <div className='d-flex justify-content-between align-items-center my-3'>
                        <h6 className='samll_head'>Forums</h6>
                        <h6>  <a className='links d-flex align-items-center' href="https://forum.pakistanproperty.com" target="_blank" rel="noopener noreferrer">View All <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.28866 5.29076C9.19719 5.38371 9.12459 5.4943 9.07505 5.61615C9.02551 5.73799 9 5.86868 9 6.00068C9 6.13268 9.02551 6.26337 9.07505 6.38521C9.12459 6.50706 9.19719 6.61765 9.28866 6.7106L13.7581 11.2901C13.8496 11.383 13.9222 11.4936 13.9717 11.6155C14.0212 11.7373 14.0468 11.868 14.0468 12C14.0468 12.132 14.0212 12.2627 13.9717 12.3845C13.9222 12.5064 13.8496 12.617 13.7581 12.7099L9.28866 17.2894C9.19719 17.3824 9.12459 17.4929 9.07505 17.6148C9.02551 17.7366 9 17.8673 9 17.9993C9 18.1313 9.02551 18.262 9.07505 18.3839C9.12459 18.5057 9.19719 18.6163 9.28866 18.7092C9.4715 18.8955 9.71883 19 9.97664 19C10.2344 19 10.4818 18.8955 10.6646 18.7092L15.1438 14.1198C15.6921 13.5573 16 12.7949 16 12C16 11.2051 15.6921 10.4427 15.1438 9.88024L10.6646 5.29076C10.4818 5.10453 10.2344 5 9.97664 5C9.71883 5 9.4715 5.10453 9.28866 5.29076Z" fill="#2D2D2D" />
                        </svg></a></h6>
                    </div>
                </div>
                <div className="row" style={{ gap: '20px 0' }}>
                    <div className='col-lg-3 col-md-6 col-12'>
                        <a href="https://forum.pakistanproperty.com/t/pakistan-property-buy-property/13" target="_blank" rel="noopener noreferrer">
                            <div className='forum_card d-flex '>
                                <div className='icon'>
                                    <div className='icon_box_forum_card'>
                                        <div className='dot dot1'></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='m-0'>Pakistan Property | Buy Property</h6>
                                    <p className='m-0 mt-1'>11 Topics</p>
                                </div>
                            </div>
                        </a>

                    </div>
                    <div className='col-lg-3 col-md-6 col-12'>
                        <a href="https://forum.pakistanproperty.com/t/what-documents-are-required-when-selling-a-house-or-plot/17" target="_blank" rel="noopener noreferrer">
                            <div className='forum_card d-flex '>
                                <div className='icon'>
                                    <div className='icon_box_forum_card'>
                                        <div className='dot dot2'></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='m-0'>What Documents Are Required When Selling a House or Plot? </h6>
                                    <p className='m-0 mt-1'>11 Topics</p>
                                </div>
                            </div>
                        </a>

                    </div>
                    <div className='col-lg-3 col-md-6 col-12'>
                        <a href="https://forum.pakistanproperty.com/t/what-should-tenants-check-before-renting-a-house/16" target="_blank" rel="noopener noreferrer">
                            <div className='forum_card d-flex '>
                                <div className='icon'>
                                    <div className='icon_box_forum_card'>
                                        <div className='dot dot3'></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='m-0'>What Should Tenants Check Before Renting a House?</h6>
                                    <p className='m-0 mt-1'>11 Topics</p>
                                </div>
                            </div>

                        </a>
                    </div>
                    <div className='col-lg-3 col-md-6 col-12'>
                        <a href="https://forum.pakistanproperty.com/t/what-is-the-best-area-to-buy-property-in-pakistan-right-now/15" target="_blank" rel="noopener noreferrer">
                            <div className='forum_card d-flex '>
                                <div className='icon'>
                                    <div className='icon_box_forum_card'>
                                        <div className='dot dot4'></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='m-0'>What is the Best Area to Buy Property in Pakistan Right Now?</h6>
                                    <p className='m-0 mt-1'>11 Topics</p>
                                </div>
                            </div>

                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OurCommunity