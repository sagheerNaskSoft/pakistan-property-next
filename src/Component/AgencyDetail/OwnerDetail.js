import React from 'react'
import { FallbackImage } from '../Metiral/FallbackImage'

function OwnerDetail({ data }) {
    return (
        <>
            <div className="owner-detail-section">
                <div className="heading">Owner Profile</div>
                <div className="detail-box">
                    <div className="img">
                        <FallbackImage src={data?.ceo_image} alt="featured" pageName="AgentDefault" />
                    </div>
                    <div className="text-box">
                        <div className="name">{data?.ceo_full_name ? data?.ceo_full_name + " " :""}
                            <span> (CEO)</span>
                        </div>
                        <div className="description">
                            {data?.ceo_desc}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OwnerDetail