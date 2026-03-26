import React from 'react';
import img from '../../Asset/BLog/ourteam.png';
import img1 from '../../Asset/BLog/outteam2.png';
import { FallbackImage } from '../Metiral/FallbackImage';

const TEAM_DATA = [
    {
        name: 'Bilal Malik',
        position: 'Head of Sales',
        image: img,
    },
    {
        name: 'Adeel Khan',
        position: 'Marketing Lead',
        image: img1,
    },
    {
        name: 'Bilal Malik',
        position: 'Head of Sales',
        image: img,
    },
    {
        name: 'Adeel Khan',
        position: 'Marketing Lead',
        image: img1,
    },
    {
        name: 'Bilal Malik',
        position: 'Head of Sales',
        image: img,
    },
    {
        name: 'Adeel Khan',
        position: 'Marketing Lead',
        image: img1,
    },
];

function OurTeam() {
    return (
        <>
            <div className='main-container'>
                <div className='meet-out-team'>
                    <h1>Meet Our Team</h1>
                    <h4>
                    Experts in real estate, marketing, and technology. All working to make property decisions easier for every user.
                    </h4>
                    <div className='row'>
                        {TEAM_DATA.map((member, index) => (
                            <div className='col-lg-4 col-md-4 col-sm-6 col-12' key={index}>
                                <div className='out-team-card'>
                                    <FallbackImage src={member.image} alt={member.name} componentName="OurTeam" />
                                    <h2>{member.name}</h2>
                                    <h4>{member.position}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OurTeam;
