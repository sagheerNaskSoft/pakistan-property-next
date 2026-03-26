import Banner from '../Component/AgentProfile/Banner'
import Navbar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import AboutAgent from '../Component/AgentProfile/AboutAgent'
import SoldProperties from '../Component/AgentProfile/SoldProperties'
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../Context/ContextProvider'
import ListedProperties from '../Component/AgentProfile/ListedProperties'
import { useParams } from 'react-router-dom'


function AgentProfile() {
    const { getAd, addData, setAdData, getUser } = useAuth()
    const [userData, setUserData] = useState(null);
    const [top5Properties, setTop5Properties] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const { userId, userName } = useParams();

    const fetchAgentData = useCallback(async () => {
        try {
            const userData = await getUser(userId);
            if (userData?.success) {
                const agentData = userData?.data?.data?.agent;
                const agencyData = userData?.data?.data?.agency;
                if(agencyData?.agency?.id===Number(userId)){
                    
                    setProfileData({
                        image:agencyData?.agency?.agency_profile?.ceo_image,
                        name:agencyData?.agency?.agency_profile?.ceo_full_name,
                        mobile:agencyData?.agency?.agency_profile?.whatsapp_number || agencyData?.phone_number,
                        email:agencyData?.agency?.agency_profile?.email,
                        address:agencyData?.agency?.agency_profile?.address,
                        description:agencyData?.agency?.agency_profile?.description,
                        city:agencyData?.city,
                        agent_id:agentData?.agent_id,
                        designation:"CEO",
                        id:agentData?.id,
                    });
                }
                else{
                    setProfileData({
                        image:agentData?.avatar,
                        name:agentData?.name,
                        mobile:agentData?.agency?.agency_profile?.whatsapp_number || agentData?.phone_number,
                        email:agentData?.email,
                        address:agentData?.address,
                        description:agentData?.description,
                        city:agentData?.city,
                        agent_id:agentData?.agent_id,
                        designation:"Agent",
                        id:agentData?.id,
                    });
                }
                setUserData(userData?.data?.data);
            }
            let adResult = null;

            if (!addData?.length) {
                adResult = await getAd();
            }

            if (adResult?.success) {
                setAdData(adResult?.data?.data || []);
            }

        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchAgentData();
        }
    }, [userId]);

    // Extract top 5 properties by total_clicked with status sold
    useEffect(() => {
        if (userData?.properties && Array.isArray(userData.properties)) {
            // Filter properties that have total_clicks, status is "sold", and sort by total_clicks in descending order
            const propertiesWithClicks = userData.properties
                .filter(property =>
                    property?.total_clicks !== undefined &&
                    property?.total_clicks !== null &&
                    property?.status?.toLowerCase() === 'sold'
                )
                .sort((a, b) => (b.total_clicks || 0) - (a.total_clicks || 0))
                .slice(0, 5); // Get top 5

            setTop5Properties(propertiesWithClicks);
        }
    }, [userData]);



    return (
        <>
            <Navbar />
            <Banner agencyData={userData?.agency} properties={userData?.properties} rating={userData?.ratings_summary} userData={profileData} propertiesCount={userData?.properties_count} refetchAgentData={fetchAgentData} />
            <div className="secondary-color">
                <div className="main-container">

                    {userData?.agent ? <AboutAgent userData={userData?.agent} /> : ""}
                    <div className={userData?.agent?.description ? 'pt-0' : 'pt-4'}>
                        <ListedProperties properties={userData?.properties} adData={addData} />
                    </div>
                    {
                        top5Properties?.length > 0 && <SoldProperties propertyData={top5Properties} adData={addData} />
                    }
                    <PreLocation />
                    <PreProperty />
                </div>
            </div>
            <div className="main-container">
                <Footer />
            </div>
        </>
    )
}

export default AgentProfile
