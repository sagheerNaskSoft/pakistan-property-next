import decreasedGraph from '../../Asset/Property Index/Maps.svg'
import incrementGraph from '../../Asset/Property Index/Maps (1).svg'
import defaultGraph from '../../Asset/Property Index/Maps (2).svg'
import { useAuth } from '../../Context/ContextProvider'
import Chart from './Chart'


const incremnetArrow = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M10.0653 8.07423L6.21684 3.61173C6.10669 3.484 5.89458 3.484 5.78325 3.61173L1.93481 8.07423C1.79184 8.24064 1.92075 8.48439 2.15161 8.48439H9.84848C10.0793 8.48439 10.2082 8.24064 10.0653 8.07423Z" fill="#27AE60" />
</svg>

const decreasedArrow = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M10.0653 3.92577L6.21684 8.38827C6.10669 8.516 5.89458 8.516 5.78325 8.38827L1.93481 3.92577C1.79184 3.75936 1.92075 3.51561 2.15161 3.51561H9.84848C10.0793 3.51561 10.2082 3.75936 10.0653 3.92577Z" fill="#C94444" />
</svg>




function TopLocations({ data, handleNaviagte }) {
    const { loading } = useAuth()
    return (
        <>
            <div className="property-trend-locations">
                <div className="title">Pakistan’s Most Popular Property Areas</div>


                {loading ? <div className="card-container">
                    {[...Array(4)].map((_) => {
                        return (
                            <div className='trending-locations-card p-0 border-0 placeholder-glow'>
                                <div className='placeholder w-100' style={{ height: "180px" }} />
                            </div>
                        )
                    })}
                </div> : <div className="card-container">
                    {
                        data?.map((item) => (
                            <div onClick={() => {
                                handleNaviagte({ property_type_id: "1", city_code: item?.city_code, location_id: item?.location_id })
                            }} className="trending-locations-card">
                                <div className="top">
                                    <div className="text-box">
                                        <div className="location-name">{item?.location_name}</div>
                                        <div className="city-name">in {item?.city_name}</div>
                                    </div>
                                    {
                                        item?.trend &&
                                        <div className="number-box">
                                            {
                                                item?.trend === "increased" ? incremnetArrow : item?.trend === "decreased" ? decreasedArrow : ''
                                            }
                                            <span className={item?.trend === "increased" ? "increment" : ""}>{item?.rank}</span>
                                        </div>
                                    }
                                </div>
                                <div className="bottom">
                                    <div className="text-box">
                                        <div className="percentage">{item?.percentage}%</div>
                                        <div className="search-text">of Total searches</div>
                                    </div>
                                    <div className="img-box">
                                        <Chart trend={item?.trend} graph_data={item?.graph_data} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>}

            </div>
        </>
    )
}

export default TopLocations
