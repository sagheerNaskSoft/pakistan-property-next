import React from 'react';
import img from '../../Asset/Agencies/fine-estate-and-builders-lahore-agency-1645857007.svg'
import AgencyTag from '../Metiral/AgencyTag'
import ShareModal from '../Metiral/ShareModal'
import backImg from '../../Asset/Agencies/Wave.svg'
import { FallbackImage } from '../Metiral/FallbackImage'
import featuredTag from '../../Asset/Agencylisting/Agencies Detail TAG.svg'
import OwnerDetail from './OwnerDetail';

function ProfileCard({ data, property_types, agencyData }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    const convertDaysToTimeUnit = (days) => {
        if (!days || days === 0) {
            return { value: 0, unit: 'days' };
        }

        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const months = Math.floor(remainingDays / 30);
        const remainingDaysAfterMonths = remainingDays % 30;
        if (years > 0) {
            return { value: years, unit: years === 1 ? 'year' : 'years' };
        }
        if (months > 0) {
            return { value: months, unit: months === 1 ? 'month' : 'months' };
        }
        return { value: remainingDaysAfterMonths, unit: remainingDaysAfterMonths === 1 ? 'day' : 'days' };
    };
    return (
        <div className='agency-profile-card'>
            <div className="profile-card">
                <div className="back-img"><FallbackImage src={backImg} alt="" /></div>
                <div className="d-flex align-items-sm-start align-items-center " style={{ gap: '12px' }}>
                    <div className="img-box" style={{ position: 'relative' }}>
                        <div className="img">
                            <FallbackImage src={data?.agency_image} alt="" pageName="AgencyDefault" />

                        </div>
                        {
                            data?.is_featured && window.innerWidth > 576 &&
                            <div className="featured-tag">
                                <FallbackImage src={featuredTag} alt="featured" pageName="AgentSmallProfile" />
                            </div>
                        }
                        {
                            data?.is_featured &&
                            window.innerWidth <= 576 &&
                            <div style={{
                                position: 'absolute',
                                top: '-6px',
                                left: '-6px',
                                zIndex: 10,
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border:'1px solid #bbb',
                                borderRadius: '50%',
                                padding: '2px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 16" fill="none">
                                    <path d="M7.68714 1.5296C7.71635 1.47058 7.76148 1.42089 7.81744 1.38615C7.87339 1.35142 7.93794 1.33301 8.0038 1.33301C8.06966 1.33301 8.13421 1.35142 8.19017 1.38615C8.24612 1.42089 8.29125 1.47058 8.32047 1.5296L9.86047 4.64894C9.96192 4.85425 10.1117 5.03188 10.2969 5.16657C10.4821 5.30127 10.6972 5.38901 10.9238 5.42227L14.3678 5.92627C14.4331 5.93573 14.4944 5.96325 14.5448 6.00574C14.5952 6.04822 14.6328 6.10397 14.6531 6.16667C14.6735 6.22938 14.676 6.29654 14.6602 6.36056C14.6444 6.42458 14.611 6.4829 14.5638 6.52894L12.0731 8.95427C11.9089 9.11434 11.786 9.31192 11.715 9.53002C11.6441 9.74812 11.6272 9.9802 11.6658 10.2063L12.2538 13.6329C12.2653 13.6982 12.2583 13.7653 12.2335 13.8267C12.2087 13.8881 12.1671 13.9413 12.1135 13.9803C12.0599 14.0192 11.9965 14.0423 11.9304 14.0469C11.8643 14.0515 11.7983 14.0374 11.7398 14.0063L8.66114 12.3876C8.45828 12.2811 8.23259 12.2254 8.00347 12.2254C7.77435 12.2254 7.54866 12.2811 7.3458 12.3876L4.2678 14.0063C4.20936 14.0372 4.1434 14.0511 4.07744 14.0464C4.01147 14.0418 3.94815 14.0186 3.89467 13.9797C3.84119 13.9409 3.79969 13.8877 3.77491 13.8264C3.75012 13.7651 3.74304 13.6981 3.75447 13.6329L4.3418 10.2069C4.3806 9.98076 4.36379 9.74854 4.29283 9.5303C4.22187 9.31207 4.09888 9.11437 3.93447 8.95427L1.4438 6.5296C1.3962 6.48363 1.36247 6.4252 1.34645 6.36099C1.33043 6.29677 1.33276 6.22935 1.35319 6.1664C1.37362 6.10345 1.41132 6.0475 1.46199 6.00493C1.51266 5.96235 1.57427 5.93487 1.6398 5.9256L5.08314 5.42227C5.30997 5.38927 5.5254 5.30164 5.71086 5.16693C5.89632 5.03221 6.04627 4.85445 6.1478 4.64894L7.68714 1.5296Z" fill="#2196F3" stroke="#2196F3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        }
                    </div>

                    <div className="text-box d-sm-none d-flex align-items-end" style={{ flexDirection: 'column' }}>

                        <div className="text w-100 d-flex align-items-baseline" style={{ gap: '12px' }}>
                            <div>
                                <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap-reverse">
                                    <div className="name">{data?.agency_name ? data?.agency_name : data?.user?.name}</div>
                                </div>
                                <div className="location">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.3307 6.66634C13.3307 9.99501 9.63806 13.4617 8.39806 14.5323C8.28255 14.6192 8.14193 14.6662 7.9974 14.6662C7.85286 14.6662 7.71225 14.6192 7.59673 14.5323C6.35673 13.4617 2.66406 9.99501 2.66406 6.66634C2.66406 5.25185 3.22597 3.8953 4.22616 2.89511C5.22635 1.89491 6.58291 1.33301 7.9974 1.33301C9.41188 1.33301 10.7684 1.89491 11.7686 2.89511C12.7688 3.8953 13.3307 5.25185 13.3307 6.66634Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{data?.address} {data?.city?.name}, Pakistan</span>
                                </div>
                            </div>
                            {
                                data?.package &&
                                <div className="tag mb-xl-0 mb-lg-2 mb-md-0 mb-sm-1 mb-0">
                                    {data?.package?.name === "Platinum" && <AgencyTag noTag={true} leftArrow={true} text={data?.package?.name} top={"0px"} bottom={"0px"} left={"-85px"} right={"0px"} rightArrow={true} size={'12px'} width={'85px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} />}
                                    {data?.package?.name === "Gold" && <AgencyTag noTag={true} leftArrow={true} text={data?.package?.name} top={"0px"} bottom={"0px"} left={"-55px"} right={"0px"} rightArrow={true} size={'12px'} width={'62px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} />}
                                    {data?.package?.name === "Bronze" && <AgencyTag noTag={true} leftArrow={true} text={data?.package?.name} top={"0px"} bottom={"0px"} left={"-90px"} right={"0px"} rightArrow={true} size={'12px'} width={'91px'} backColor={" var(--Tags-Bronze, linear-gradient(90deg, #734404 0%, #80500B 34.26%, #8D5C11 75%, #9A6817 100%))"} />}
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="text-box d-flex align-items-end" style={{ flexDirection: 'column' }}>

                    <div className="text w-100">
                        <div className="d-sm-flex d-none align-items-center justify-content-between gap-1 flex-wrap-reverse">
                            <div className="name">{data?.agency_name ? data?.agency_name : data?.user?.name}</div>
                            {
                                data?.package &&
                                <div style={{ position: "relative" }} className="tag mb-xl-0 mb-lg-2 mb-md-0 mb-sm-1 mb-0">
                                    {data?.package?.name === "Platinum" && <AgencyTag noTag={true} leftArrow={true} text={data?.package?.name} top={"0px"} bottom={"0px"} left={"-85px"} right={"0px"} rightArrow={true} size={'12px'} width={'85px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} />}
                                    {data?.package?.name === "Gold" && <AgencyTag noTag={true} leftArrow={true} text={data?.package?.name} top={"0px"} bottom={"0px"} left={"-55px"} right={"0px"} rightArrow={true} size={'12px'} width={'62px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} />}
                                    {data?.package?.name === "Bronze" && <AgencyTag noTag={true} leftArrow={true} text={data?.package?.name} top={"0px"} bottom={"0px"} left={"-90px"} right={"0px"} rightArrow={true} size={'12px'} width={'91px'} backColor={" var(--Tags-Bronze, linear-gradient(90deg, #734404 0%, #80500B 34.26%, #8D5C11 75%, #9A6817 100%))"} />}
                                </div>
                            }
                        </div>
                        <div className="location d-sm-flex d-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3307 6.66634C13.3307 9.99501 9.63806 13.4617 8.39806 14.5323C8.28255 14.6192 8.14193 14.6662 7.9974 14.6662C7.85286 14.6662 7.71225 14.6192 7.59673 14.5323C6.35673 13.4617 2.66406 9.99501 2.66406 6.66634C2.66406 5.25185 3.22597 3.8953 4.22616 2.89511C5.22635 1.89491 6.58291 1.33301 7.9974 1.33301C9.41188 1.33301 10.7684 1.89491 11.7686 2.89511C12.7688 3.8953 13.3307 5.25185 13.3307 6.66634Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{data?.address} {data?.city?.name}, Pakistan</span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="review-tag">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.68714 1.5296C7.71635 1.47058 7.76148 1.42089 7.81744 1.38615C7.87339 1.35142 7.93794 1.33301 8.0038 1.33301C8.06966 1.33301 8.13421 1.35142 8.19017 1.38615C8.24612 1.42089 8.29125 1.47058 8.32047 1.5296L9.86047 4.64894C9.96192 4.85425 10.1117 5.03188 10.2969 5.16657C10.4821 5.30127 10.6972 5.38901 10.9238 5.42227L14.3678 5.92627C14.4331 5.93573 14.4944 5.96325 14.5448 6.00574C14.5952 6.04822 14.6328 6.10397 14.6531 6.16667C14.6735 6.22938 14.676 6.29654 14.6602 6.36056C14.6444 6.42458 14.611 6.4829 14.5638 6.52894L12.0731 8.95427C11.9089 9.11434 11.786 9.31192 11.715 9.53002C11.6441 9.74812 11.6272 9.9802 11.6658 10.2063L12.2538 13.6329C12.2653 13.6982 12.2583 13.7653 12.2335 13.8267C12.2087 13.8881 12.1671 13.9413 12.1135 13.9803C12.0599 14.0192 11.9965 14.0423 11.9304 14.0469C11.8643 14.0515 11.7983 14.0374 11.7398 14.0063L8.66114 12.3876C8.45828 12.2811 8.23259 12.2254 8.00347 12.2254C7.77435 12.2254 7.54866 12.2811 7.3458 12.3876L4.2678 14.0063C4.20936 14.0372 4.1434 14.0511 4.07744 14.0464C4.01147 14.0418 3.94815 14.0186 3.89467 13.9797C3.84119 13.9409 3.79969 13.8877 3.77491 13.8264C3.75012 13.7651 3.74304 13.6981 3.75447 13.6329L4.3418 10.2069C4.3806 9.98076 4.36379 9.74854 4.29283 9.5303C4.22187 9.31207 4.09888 9.11437 3.93447 8.95427L1.4438 6.5296C1.3962 6.48363 1.36247 6.4252 1.34645 6.36099C1.33043 6.29677 1.33276 6.22935 1.35319 6.1664C1.37362 6.10345 1.41132 6.0475 1.46199 6.00493C1.51266 5.96235 1.57427 5.93487 1.6398 5.9256L5.08314 5.42227C5.30997 5.38927 5.5254 5.30164 5.71086 5.16693C5.89632 5.03221 6.04627 4.85445 6.1478 4.64894L7.68714 1.5296Z" fill="#FFB900" stroke="#FFB900" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span >{data?.agency_average_rating?.toFixed(1) || 0}</span>
                                <span>({data?.user?.ratings_count || 0} reviews)</span>
                            </div>
                            <div onClick={() => handleOpen()} className="share-box d-sm-none d-flex">
                                <svg className='share' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18.1027 14.2204C17.4734 14.2209 16.8536 14.3746 16.2969 14.6681C15.7402 14.9616 15.2632 15.3862 14.9072 15.9051L9.48929 13.4588C9.87411 12.5295 9.87561 11.4858 9.49345 10.5555L14.9039 8.09661C15.4315 8.8597 16.2152 9.4084 17.1127 9.6432C18.0102 9.878 18.9622 9.78334 19.7959 9.37639C20.6296 8.96944 21.2899 8.27715 21.6569 7.4251C22.0239 6.57305 22.0733 5.61768 21.7963 4.73228C21.5193 3.84688 20.9341 3.0901 20.1468 2.59921C19.3596 2.10833 18.4225 1.91585 17.5055 2.05669C16.5886 2.19753 15.7524 2.66236 15.1488 3.36687C14.5452 4.07138 14.2141 4.9689 14.2155 5.89663C14.2191 6.11621 14.2413 6.33509 14.2821 6.55088L8.53039 9.16455C7.97798 8.64699 7.28641 8.30207 6.54065 8.17216C5.7949 8.04224 5.02744 8.133 4.33255 8.43327C3.63767 8.73354 3.04563 9.23025 2.62916 9.86238C2.2127 10.4945 1.98995 11.2345 1.98829 11.9915C1.98663 12.7485 2.20612 13.4895 2.6198 14.1234C3.03348 14.7574 3.62333 15.2567 4.31689 15.56C5.01045 15.8633 5.77751 15.9575 6.52383 15.8308C7.27015 15.7042 7.96322 15.3623 8.51791 14.8472L14.2846 17.4509C14.2446 17.6665 14.2226 17.885 14.2189 18.1043C14.2187 18.8727 14.4464 19.6239 14.8732 20.2628C15.3 20.9018 15.9067 21.3998 16.6166 21.694C17.3264 21.9881 18.1076 22.0651 18.8612 21.9152C19.6149 21.7654 20.3071 21.3954 20.8505 20.852C21.3938 20.3087 21.7638 19.6164 21.9137 18.8628C22.0635 18.1091 21.9865 17.328 21.6924 16.6181C21.3983 15.9083 20.9002 15.3016 20.2613 14.8748C19.6223 14.448 18.8711 14.2202 18.1027 14.2204ZM18.1027 3.67668C18.5418 3.67652 18.9711 3.80657 19.3363 4.05041C19.7015 4.29424 19.9862 4.64089 20.1543 5.04652C20.3225 5.45215 20.3665 5.89853 20.281 6.32921C20.1954 6.7599 19.984 7.15553 19.6736 7.46608C19.3632 7.77663 18.9676 7.98814 18.537 8.07387C18.1063 8.15959 17.6599 8.11568 17.2542 7.94768C16.8485 7.77968 16.5018 7.49515 16.2578 7.13006C16.0138 6.76497 15.8836 6.33573 15.8836 5.89663C15.8841 5.30814 16.118 4.74387 16.534 4.32767C16.9501 3.91147 17.5143 3.67734 18.1027 3.67668ZM5.89508 14.2204C5.45598 14.2206 5.0267 14.0905 4.66152 13.8467C4.29634 13.6029 4.01167 13.2562 3.84352 12.8506C3.67537 12.4449 3.63129 11.9986 3.71685 11.5679C3.80242 11.1372 4.01378 10.7416 4.32421 10.431C4.63465 10.1205 5.0302 9.90895 5.46085 9.82323C5.89151 9.7375 6.33791 9.78141 6.7436 9.94941C7.14929 10.1174 7.49605 10.4019 7.74002 10.767C7.98398 11.1321 8.1142 11.5614 8.1142 12.0005C8.11354 12.5889 7.87956 13.153 7.46356 13.5692C7.04756 13.9853 6.4835 14.2195 5.89508 14.2204ZM18.1027 20.3242C17.6637 20.3242 17.2345 20.194 16.8694 19.9501C16.5043 19.7062 16.2198 19.3595 16.0518 18.9538C15.8837 18.5482 15.8398 18.1018 15.9254 17.6712C16.0111 17.2406 16.2225 16.845 16.533 16.5345C16.8435 16.2241 17.239 16.0127 17.6696 15.927C18.1003 15.8413 18.5466 15.8853 18.9523 16.0533C19.3579 16.2213 19.7046 16.5059 19.9486 16.8709C20.1925 17.236 20.3227 17.6652 20.3227 18.1043C20.3223 18.6929 20.0882 19.2573 19.672 19.6735C19.2558 20.0898 18.6914 20.3238 18.1027 20.3242Z" fill="#2D2D2D" />
                                </svg>
                                <div className="share-tooltip d-sm-flex d-none">
                                    Share
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mt-sm-0 mt-3 align-items-center justify-content-sm-start justify-content-between">
                            <div className="sell-rent">
                                <span className="flex-sm-column flex-row align-items-sm-start align-items-center justify-content-sm-start justify-content-center" style={{ display: 'flex' }}>
                                    <span className='number'>{data?.sell_count + data?.rent_count + data?.lease_count || 0}</span>
                                    <span className='text'>Properties</span>
                                </span>
                            </div>
                            <div className="sell-rent">
                                <span className="flex-sm-column flex-row align-items-sm-start align-items-center justify-content-sm-start justify-content-center" style={{ display: 'flex' }}>
                                    <span className='number'>{agencyData?.length || 0}</span>
                                    <span className='text'>Agents</span>
                                </span>
                            </div>
                            <div className="sell-rent last">
                                <span className="flex-sm-column flex-row align-items-sm-start align-items-center justify-content-sm-start justify-content-center" style={{ display: 'flex' }}>
                                    {(() => {
                                        const timeUnit = convertDaysToTimeUnit(data?.total_time_on_pakistan_property || 0);
                                        return (
                                            <>
                                                <span className='number'>{timeUnit.value}</span>
                                                <span className='text'>{timeUnit.unit}</span>
                                            </>
                                        );
                                    })()}
                                </span>
                            </div>
                            <div onClick={() => handleOpen()} className="share-box d-sm-flex d-none">
                                <svg className='share' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18.1027 14.2204C17.4734 14.2209 16.8536 14.3746 16.2969 14.6681C15.7402 14.9616 15.2632 15.3862 14.9072 15.9051L9.48929 13.4588C9.87411 12.5295 9.87561 11.4858 9.49345 10.5555L14.9039 8.09661C15.4315 8.8597 16.2152 9.4084 17.1127 9.6432C18.0102 9.878 18.9622 9.78334 19.7959 9.37639C20.6296 8.96944 21.2899 8.27715 21.6569 7.4251C22.0239 6.57305 22.0733 5.61768 21.7963 4.73228C21.5193 3.84688 20.9341 3.0901 20.1468 2.59921C19.3596 2.10833 18.4225 1.91585 17.5055 2.05669C16.5886 2.19753 15.7524 2.66236 15.1488 3.36687C14.5452 4.07138 14.2141 4.9689 14.2155 5.89663C14.2191 6.11621 14.2413 6.33509 14.2821 6.55088L8.53039 9.16455C7.97798 8.64699 7.28641 8.30207 6.54065 8.17216C5.7949 8.04224 5.02744 8.133 4.33255 8.43327C3.63767 8.73354 3.04563 9.23025 2.62916 9.86238C2.2127 10.4945 1.98995 11.2345 1.98829 11.9915C1.98663 12.7485 2.20612 13.4895 2.6198 14.1234C3.03348 14.7574 3.62333 15.2567 4.31689 15.56C5.01045 15.8633 5.77751 15.9575 6.52383 15.8308C7.27015 15.7042 7.96322 15.3623 8.51791 14.8472L14.2846 17.4509C14.2446 17.6665 14.2226 17.885 14.2189 18.1043C14.2187 18.8727 14.4464 19.6239 14.8732 20.2628C15.3 20.9018 15.9067 21.3998 16.6166 21.694C17.3264 21.9881 18.1076 22.0651 18.8612 21.9152C19.6149 21.7654 20.3071 21.3954 20.8505 20.852C21.3938 20.3087 21.7638 19.6164 21.9137 18.8628C22.0635 18.1091 21.9865 17.328 21.6924 16.6181C21.3983 15.9083 20.9002 15.3016 20.2613 14.8748C19.6223 14.448 18.8711 14.2202 18.1027 14.2204ZM18.1027 3.67668C18.5418 3.67652 18.9711 3.80657 19.3363 4.05041C19.7015 4.29424 19.9862 4.64089 20.1543 5.04652C20.3225 5.45215 20.3665 5.89853 20.281 6.32921C20.1954 6.7599 19.984 7.15553 19.6736 7.46608C19.3632 7.77663 18.9676 7.98814 18.537 8.07387C18.1063 8.15959 17.6599 8.11568 17.2542 7.94768C16.8485 7.77968 16.5018 7.49515 16.2578 7.13006C16.0138 6.76497 15.8836 6.33573 15.8836 5.89663C15.8841 5.30814 16.118 4.74387 16.534 4.32767C16.9501 3.91147 17.5143 3.67734 18.1027 3.67668ZM5.89508 14.2204C5.45598 14.2206 5.0267 14.0905 4.66152 13.8467C4.29634 13.6029 4.01167 13.2562 3.84352 12.8506C3.67537 12.4449 3.63129 11.9986 3.71685 11.5679C3.80242 11.1372 4.01378 10.7416 4.32421 10.431C4.63465 10.1205 5.0302 9.90895 5.46085 9.82323C5.89151 9.7375 6.33791 9.78141 6.7436 9.94941C7.14929 10.1174 7.49605 10.4019 7.74002 10.767C7.98398 11.1321 8.1142 11.5614 8.1142 12.0005C8.11354 12.5889 7.87956 13.153 7.46356 13.5692C7.04756 13.9853 6.4835 14.2195 5.89508 14.2204ZM18.1027 20.3242C17.6637 20.3242 17.2345 20.194 16.8694 19.9501C16.5043 19.7062 16.2198 19.3595 16.0518 18.9538C15.8837 18.5482 15.8398 18.1018 15.9254 17.6712C16.0111 17.2406 16.2225 16.845 16.533 16.5345C16.8435 16.2241 17.239 16.0127 17.6696 15.927C18.1003 15.8413 18.5466 15.8853 18.9523 16.0533C19.3579 16.2213 19.7046 16.5059 19.9486 16.8709C20.1925 17.236 20.3227 17.6652 20.3227 18.1043C20.3223 18.6929 20.0882 19.2573 19.672 19.6735C19.2558 20.0898 18.6914 20.3238 18.1027 20.3242Z" fill="#2D2D2D" />
                                </svg>
                                <div className="share-tooltip">
                                    Share
                                </div>
                            </div>
                            <ShareModal open={open} setOpen={setOpen} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-agency-detail-container">
                <OwnerDetail data={data} />
                <div className="agency-detail-text" style={{marginTop:"28px"}}>
                    <div className="heading">Overview</div>
                    <div className="para">
                        {data?.description}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard
