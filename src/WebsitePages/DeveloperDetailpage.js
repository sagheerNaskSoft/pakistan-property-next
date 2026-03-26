import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/DeveloperDetailpage/Banner'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import Rsbuttons from '../Component/ProjectDetail/Rsbuttons'
import CallModal from '../Component/Metiral/CallModal'
import { useAuth } from '../Context/ContextProvider'
import { useParams } from 'react-router-dom'

function DeveloperDetailpage() {
    const { getDeveloperProfile } = useAuth()
    const { slug } = useParams()
    const [developerData, setDeveloperData] = useState(null)
    const [callModalOpen, setCallModalOpen] = useState(false)
    
    const handleOpen = () => {
        setCallModalOpen(true)
    }
    
    useEffect(() => {
        const fetchDeveloperProfile = async () => {
            const result = await getDeveloperProfile(slug)
            if (result?.success) {
                setDeveloperData(result?.data?.data)
            }
            else {
                console.error(result?.error)
            }
        }
        fetchDeveloperProfile()
    }, [slug])

    return (
        <div>
            <NavBar prevButton={true} />
            <div className='secondary-color'>
                <div className='main-container developer-detail-page-container'>
                    <Banner  developerData={developerData}/>
                   <div className='new-detial-page-container'>
                    <PreLocation />
                    <PreProperty />
                   </div>
                </div>
            </div>
            <div className='d-lg-none d-inline-block'>
                <Rsbuttons 
                    propertyData={developerData} 
                    radio={true} 
                    handleOpen={handleOpen}
                    whatsapp={developerData?.developer?.whatsapp || developerData?.developer?.phone_number || ''}
                />
            </div>
            <div className='main-container'>
                <Footer />
            </div>
            
            {/* Call Modal */}
            <CallModal 
                open={callModalOpen} 
                setOpen={setCallModalOpen} 
                contact={[developerData?.developer?.whatsapp]}
                propertyId={developerData?.developer?.id}
            />
        </div>
    )
}

export default DeveloperDetailpage
