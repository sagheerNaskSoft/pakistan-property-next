import React from 'react'
import PrimaryButton from '../Metiral/Button/PrimaryButton'
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton'
import img from '../../Asset/Agencies/2f437375b9de911a942944ec43a95a75ba347130.jpg'
import img1 from '../../Asset/Agencies/fd3fd7537008a353b267ae30cee47bab491eecfc.jpg'
import img2 from '../../Asset/Agencies/e96055ae211aa3ab6d316f5a1ba82cc48d92e5d5.jpg'
import img3 from '../../Asset/Agencies/image placeholder (2).png'
import img4 from '../../Asset/Agencies/image placeholder (1).png'
import img5 from '../../Asset/Agencies/image placeholder.png'
import { Link } from 'react-router-dom'
import { FallbackImage } from '../Metiral/FallbackImage'
import { useState } from 'react'
import CallModal from '../Metiral/CallModal'

function AgencyStaff({satffData}) {
    const [callModalOpen, setCallModalOpen] = useState(false);
    const [selectedStaffContact, setSelectedStaffContact] = useState(null);
    const phone = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
        <g clipPath="url(#clip0_6086_74755)">
            <path d="M14.4851 1.17992V3.51325C14.4851 3.66796 14.4236 3.81633 14.3142 3.92573C14.2048 4.03512 14.0564 4.09658 13.9017 4.09658C13.747 4.09658 13.5986 4.03512 13.4892 3.92573C13.3798 3.81633 13.3184 3.66796 13.3184 3.51325V2.01817L10.2267 5.0935C10.1164 5.19949 9.96888 5.2579 9.81591 5.25616C9.66295 5.25441 9.51678 5.19265 9.40892 5.08417C9.30105 4.9757 9.24012 4.82919 9.23924 4.67621C9.23836 4.52324 9.29761 4.37604 9.40422 4.26633L12.5076 1.17992H10.9851C10.8303 1.17992 10.682 1.11846 10.5726 1.00906C10.4632 0.899665 10.4017 0.751292 10.4017 0.596582C10.4017 0.441872 10.4632 0.293499 10.5726 0.184103C10.682 0.0747067 10.8303 0.0132486 10.9851 0.0132486H13.3184C13.6278 0.0132486 13.9246 0.136165 14.1433 0.354957C14.3621 0.57375 14.4851 0.870496 14.4851 1.17992ZM13.9571 9.77767C14.2952 10.1166 14.485 10.5758 14.485 11.0546C14.485 11.5333 14.2952 11.9925 13.9571 12.3315L13.4251 12.944C8.64705 17.5162 -2.9782 5.89442 1.52514 1.10233L2.19539 0.518999C2.53494 0.190448 2.99009 0.00861741 3.46255 0.0127647C3.93502 0.0169121 4.3869 0.206705 4.72064 0.541165C4.73814 0.559249 5.81905 1.96392 5.81905 1.96392C6.1397 2.30076 6.31824 2.74819 6.31758 3.21324C6.31693 3.67829 6.13714 4.12522 5.81555 4.46117L5.13947 5.31108C5.5133 6.2194 6.06292 7.04489 6.75677 7.74014C7.45061 8.43538 8.275 8.98667 9.18256 9.36233L10.0371 8.68275C10.3731 8.36134 10.8199 8.18165 11.2848 8.181C11.7497 8.18035 12.197 8.35878 12.5338 8.67925C12.5338 8.67925 13.9391 9.76017 13.9571 9.77767ZM13.1551 10.6258C13.1551 10.6258 11.7591 9.55133 11.7411 9.53383C11.6209 9.41468 11.4585 9.34782 11.2893 9.34782C11.12 9.34782 10.9576 9.41468 10.8375 9.53383C10.8217 9.549 9.64514 10.487 9.64514 10.487C9.56585 10.5501 9.47149 10.5915 9.37135 10.607C9.27121 10.6226 9.16875 10.6118 9.07405 10.5757C7.89759 10.1382 6.82903 9.4527 5.94088 8.56577C5.05274 7.67883 4.36581 6.6112 3.92672 5.43533C3.88831 5.33973 3.8759 5.23567 3.89076 5.13372C3.90561 5.03177 3.94721 4.93557 4.0113 4.85492C4.0113 4.85492 4.94872 3.67833 4.96447 3.66258C5.08363 3.54241 5.15048 3.38002 5.15048 3.21079C5.15048 3.04156 5.08363 2.87917 4.96447 2.759C4.94697 2.7415 3.87247 1.345 3.87247 1.345C3.75057 1.23555 3.59142 1.17688 3.42765 1.181C3.26387 1.18512 3.10788 1.25173 2.99164 1.36717L2.32139 1.9505C-0.970946 5.90667 9.10497 15.4243 12.5717 12.1483L13.1037 11.5358C13.2291 11.4207 13.3047 11.2612 13.3143 11.0913C13.3239 10.9213 13.2667 10.7543 13.1551 10.6258Z" fill="white" />
        </g>
        <defs>
            <clipPath id="clip0_6086_74755">
                <rect width="14" height="14" fill="white" transform="translate(0.5)" />
            </clipPath>
        </defs>
    </svg>

    const email = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11.0833 0.583008H2.91667C2.1434 0.583934 1.40208 0.891522 0.855295 1.4383C0.308515 1.98508 0.00092625 2.72641 0 3.49967L0 10.4997C0.00092625 11.2729 0.308515 12.0143 0.855295 12.561C1.40208 13.1078 2.1434 13.4154 2.91667 13.4163H11.0833C11.8566 13.4154 12.5979 13.1078 13.1447 12.561C13.6915 12.0143 13.9991 11.2729 14 10.4997V3.49967C13.9991 2.72641 13.6915 1.98508 13.1447 1.4383C12.5979 0.891522 11.8566 0.583934 11.0833 0.583008ZM2.91667 1.74967H11.0833C11.4326 1.75036 11.7737 1.85556 12.0627 2.05173C12.3517 2.2479 12.5754 2.52606 12.705 2.85042L8.23783 7.31817C7.90908 7.64561 7.46399 7.82945 7 7.82945C6.53601 7.82945 6.09092 7.64561 5.76217 7.31817L1.295 2.85042C1.42459 2.52606 1.64827 2.2479 1.93728 2.05173C2.22628 1.85556 2.56738 1.75036 2.91667 1.74967ZM11.0833 12.2497H2.91667C2.45254 12.2497 2.00742 12.0653 1.67923 11.7371C1.35104 11.4089 1.16667 10.9638 1.16667 10.4997V4.37467L4.93733 8.14301C5.48487 8.68916 6.22665 8.99586 7 8.99586C7.77335 8.99586 8.51513 8.68916 9.06267 8.14301L12.8333 4.37467V10.4997C12.8333 10.9638 12.649 11.4089 12.3208 11.7371C11.9926 12.0653 11.5475 12.2497 11.0833 12.2497Z" fill="#698B75" />
    </svg>

    const staffMembers = [
        {
            img: img,
            name: "Elena Moreau",
            role: "CEO & Founder",
            position: "CEO",
            phone: "Call",
            email: "Email",
            link: "/agent-profile"
        },
        {
            img: img1,
            name: "Tobias Schmidt",
            role: "Senior Agent",
            position: "Senior Agent",
            phone: "Call",
            email: "Email",
            link: "/agent-profile"
        },
        {
            img: img2,
            name: "Amara Chen",
            role: "Senior Agent",
            position: "Senior Agent",
            phone: "Call",
            email: "Email",
            link: "/agent-profile"
        },
        {
            img: img3,
            name: "Humma",
            role: "Manager",
            position: "Manager",
            phone: "Call",
            email: "Email",
            link: "/agent-profile"
        },
        {
            img: img4,
            name: "John Smith",
            role: "Manager",
            position: "Manager",
            phone: "Call",
            email: "Email",
            link: "/agent-profile"
        },
        {
            img: img5,
            name: "Simon Jaegar",
            role: "Junior Agent",
            position: "Junior Agent",
            phone: "Call",
            email: "Email",
            link: "/agent-profile"
        }
    ];      



    return (
        <div className='agency-staff'>
            <div className="heading">Agency Staff</div>
            <div className="staff-card-box row" style={{ gap: '16px 0' }}>
                {
                    satffData?.map((data) => (
                        <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12">
                           
                                <div className="staff-card">
                                <Link style={{ textDecoration: 'none' }} to={`/agent-profile/${data?.id}/${data?.username}`}>
                                    <div className="img">
                                        <FallbackImage src={data?.avatar} alt="" pageName="AgentDefault" />
                                    </div>
                                    <div className="text-box">
                                        <div className="name">{data.name}</div>
                                        <div className="designation">{data?.email}</div>
                                    </div>
                                    </Link>

                                    <div className="button-box">
                                        <PrimaryButton 
                                            widthSize={'100%'} 
                                            icon={phone} 
                                            text={'Call'} 
                                            onFunction={() => {
                                                const phoneNumbers = [];
                                                if (data?.phone_number) phoneNumbers.push(data.phone_number);   
                                                setSelectedStaffContact(phoneNumbers);
                                                setCallModalOpen(true);
                                            }}
                                        />
                                        <PrimaryBorderButton 
                                            widthSize={'100%'} 
                                            text={"Email"} 
                                            icon={email} 
                                            onFunction={() => {
                                                const emailAddr = data?.email || '';
                                                const subject = encodeURIComponent('Property Inquiry');
                                                const body = encodeURIComponent('Hi, I am interested in your profile on Pakistan-Property. Please provide more details.');
                                                window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${emailAddr}&su=${subject}&body=${body}&tf=1`, '_blank');
                                            }}
                                        />
                                    </div>
                                </div>
                        </div>  
                    ))
                }
            </div>
            <CallModal
                open={callModalOpen}
                setOpen={setCallModalOpen}
                contact={selectedStaffContact}
                propertyId={null}
            />
        </div>
    )
}

export default AgencyStaff
