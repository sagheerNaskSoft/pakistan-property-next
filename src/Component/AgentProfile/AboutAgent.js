import React from 'react'

function AboutAgent({ userData }) {
    return (
        <>
            {userData?.description && (
                <div className="agent-details">

                    <div className="title">About  {userData?.name}</div>
                    <div className="para">{userData?.description}</div>
                </div>
            )}
        </>
    )
}

export default AboutAgent
