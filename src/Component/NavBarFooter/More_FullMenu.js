import services_1 from '../../Asset/header/Illustration (6).svg'
import services_2 from '../../Asset/header/Illustration (7).svg'
import services_3 from '../../Asset/header/Illustration (8).svg'
import services_4 from '../../Asset/header/Illustration (9).svg'
import services_5 from '../../Asset/header/Illustration (10).svg'
import services_6 from '../../Asset/header/Illustration (11).svg'
import blogs from '../../Asset/header/blog.svg'
import news from '../../Asset/header/News.svg'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider'

import Image from 'next/image';
const services_data = [
    { img: services_1, heading: "Property Trends", para: 'Estimate your total property costs instantly', link: '/properties/property-trend' },
    { img: services_2, heading: "Area Unit Converter", para: 'Estimate your total property costs instantly', link: '/area-unit-converter' },
    { img: services_3, heading: "Property Index", para: 'Estimate your total property costs instantly', link: "/property-index" },
    { img: services_4, heading: "New Properties", para: 'Estimate your total property costs instantly', link: '/properties/new' },
    { img: services_5, heading: "Cost Calculator", para: 'Estimate your total property costs instantly', link: '/construction-cost-calculator' },
    { img: services_6, heading: "Loan Calculator", para: 'Estimate your total property costs instantly', link: '/loan-calculator' },
]

const communityData = [
    { img: blogs, name: 'Blogs', link: "/blogs" },
    { img: news, name: 'News', link: "/news" },
]
function More_FullMenu({ openMenu, menuRef, data }) {
    const { formatPriceWithCommas } = useAuth()
    return (
        <div className='more-menu' ref={menuRef} style={{ display: openMenu ? 'block' : 'none' }}>
            <div className="main-container">
                <div className="row m-0">
                    <div className="col-4 p-0">
                        <div className="services-box">
                            <div className="heading">Services</div>
                            <div className="services-card-box">
                                {
                                    services_data.map((data) => (
                                        <Link key={data.link} className="services-card" style={{ textDecoration: "none" }} to={data?.link}>
                                            <div className="img">
                                                <Image src={data.img} alt="" />
                                            </div>
                                            <div className="text-box">
                                                <div className="title">{data.heading}</div>
                                                <div className="para">{data.para}</div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-6 p-0">
                        <div className="center-box">
                            <div className="other-box">
                                <div className="heading">Others</div>
                                <div className="row m-0">
                                    <div className="col-4 p-0">
                                        <Link style={{ textDecoration: 'none' }} to='/properties/property-trend'><div className="tab">Property Trends</div></Link>
                                        <Link style={{ textDecoration: 'none' }} to='/properties/new'><div className="tab">New Properties</div></Link>
                                        <div className="tab"></div>
                                    </div>
                                    <div className="col-4 p-0">
                                        <Link style={{ textDecoration: 'none' }} to='/area-unit-converter'><div className="tab">Area unit Calculator</div></Link>
                                        <Link style={{ textDecoration: 'none' }} to='/construction-cost-calculator'><div className="tab">Cost Calculator</div></Link>
                                        {/* <div className="tab">Area Index</div> */}
                                    </div>
                                    <div className="col-4 p-0">
                                        <Link style={{ textDecoration: 'none' }} to='/property-index'><div className="tab">Property Index</div></Link>
                                        <Link style={{ textDecoration: 'none' }} to='/loan-calculator'><div className="tab">Loan Calculator</div></Link>
                                        {/* <div className="tab">Area Index</div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="community-box">
                                <div className="heading">Community</div>
                                <div className="row m-0">
                                    {
                                        communityData.map((data) => (
                                            <div className="col-4 p-0" key={data.link}>
                                                <Link style={{ textDecoration: 'none' }} to={data?.link}>
                                                    <div className={`community-card community-card-${data.link.split('/').pop()}`}>
                                                        <div className="img-box">
                                                            <Image src={data.img} alt="" />
                                                        </div>
                                                        <div className="name">{data.name}</div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 p-0">
                        <div className="property-box">
                            <div className="heading">New Properties</div>
                            <div className="property-card-box">
                                {data?.slice(0, 10)?.map((item) => (
                                    <Link key={item?.id} to={`/property-detail/${item?.slug}`} className="property-card">
                                        <div className="property-img"><Image src={item?.images[0]?.url} alt="" /></div>
                                        <div className="text-side">
                                            <div className="property-price">{formatPriceWithCommas(item.price)} <span>{item.currency}</span></div>
                                            <div className="location">{item.location?.name}, {data?.city?.name}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default More_FullMenu
