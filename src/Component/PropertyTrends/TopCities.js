import lahore from '../../Asset/Property Index/lahore.svg'
import lahore_hover from '../../Asset/Property Index/lahore_hover.svg'
import islamabad from '../../Asset/Property Index/islamabad.svg'
import islamabad_hover from '../../Asset/Property Index/islamabad_hover.svg'
import rawalpindi from '../../Asset/Property Index/rawalpindi.svg'
import rawalpindi_hover from '../../Asset/Property Index/rawalpindi_hover.svg'
import karachi from '../../Asset/Property Index/karachi.svg'
import karachi_hover from '../../Asset/Property Index/karachi_hover.svg'
import { useAuth } from '../../Context/ContextProvider'
import { FallbackImage } from '../Metiral/FallbackImage'

function TopCities({ data, handleNaviagte }) {
    const { loading } = useAuth()

    return (
        <>
            <div className="property-trend-cities">
                <div className="title">Most Searched Cities for Property in Pakistan</div>
                {loading ? <div className="card-container">
                    {[...Array(4)].map((_) => {
                        return (
                            <div className='trending-cities-card p-0 border-0 placeholder-glow'>
                                <div className='placeholder w-100' style={{ height: "110px" }} />
                            </div>
                        )
                    })}</div> : <div className="card-container">
                    {
                        data?.map((item) => (
                            <div onClick={() => {
                                handleNaviagte({ property_type_id: "1", city_code: item?.city_code })
                            }} className="trending-cities-card">
                                <div className="text-box">
                                    <div className="city-name">{item?.city_name}</div>
                                    <div className="search-number">{item?.current_month_searches} Searches</div>
                                    <div className="view-link">View Trend</div>
                                </div>
                                <div className="img-box">
                                    {item?.city_name === "Lahore" ? <>
                                        <div className="img default"><FallbackImage src={lahore} alt="" componentName="TopCities" /></div>
                                        <div className="img hover"><FallbackImage src={lahore_hover} alt="" componentName="TopCities" /></div>
                                    </> : ""}
                                    {item?.city_name === "Islamabad" ? <>
                                        <div className="img default"><FallbackImage src={islamabad} alt="" componentName="TopCities" /></div>
                                        <div className="img hover"><FallbackImage src={islamabad_hover} alt="" componentName="TopCities" /></div>
                                    </> : ""}
                                    {item?.city_name === "Rawalpindi" ? <>
                                        <div className="img default"><FallbackImage src={rawalpindi} alt="" componentName="TopCities" /></div>
                                        <div className="img hover"><FallbackImage src={rawalpindi_hover} alt="" componentName="TopCities" /></div>
                                    </> : ""}
                                    {item?.city_name === "Karachi" ? <>
                                        <div className="img default"><FallbackImage src={karachi} alt="" componentName="TopCities" /></div>
                                        <div className="img hover"><FallbackImage src={karachi_hover} alt="" componentName="TopCities" /></div>
                                    </> : ""}

                                </div>
                            </div>
                        ))
                    }
                </div>}

            </div>
        </>
    )
}

export default TopCities
