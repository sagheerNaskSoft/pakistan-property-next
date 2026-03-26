import React, { useActionState, useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import BreadCrumb from '../Component/Metiral/BreadCrumb'
import ProfileCard from '../Component/AgencyDetail/ProfileCard'
import AgencyProperties from '../Component/AgencyDetail/AgencyProperties'
import AgencyStaff from '../Component/AgencyDetail/AgencyStaff'
import AgencyListedProperties from '../Component/AgencyDetail/AgencyListedProperties'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import Line from '../Component/Metiral/Line'
import Rsbuttons from '../Component/ProjectDetail/Rsbuttons'
import AgencyContactCard from '../Component/AgencyDetail/AgencyContactCard'
import CallModal from '../Component/Metiral/CallModal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '../Context/ContextProvider'
import { useParams } from 'react-router-dom'

  function submitForm(prevState, formData) {
    const errors = {};
    const name = formData.get("name");
    const email = formData.get("email");
    const phoneCode = formData.get("callingCode");
    const number = formData.get("number");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const role = formData.get("role");
    // Checkbox submits "true" when checked, nothing when unchecked
    const keepInformed = formData.get("keepInformed") === "true";

    // validations
    if (!name) errors.name = "Name is required!";
    if (!email) errors.email = "Email is required!";
    if (!phoneCode) errors.phoneCode = "Please select phone code!";
    if (!number) {
      errors.number = "Number is required!";
    } else if (!/^\d{7,10}$/.test(number)) {
      errors.number = "Enter a valid phone number (7-10 digits)";
    }
    // Only validate subject if it exists in form (when subject prop is true)
    if (subject !== null && subject !== undefined && !subject) {
      errors.subject = "Subject is required!";
    }
    if (!message) errors.message = "Message is required!";
    // Only validate role if it exists in form (when radio prop is true)
    if (role !== null && role !== undefined && !role) {
      errors.role = "Please select a role!";
    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.email = "Invalid email format!";
    }


    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
        values: { name, email, phoneCode, number, subject, message, role, keepInformed },
      };
    }

    return {
      success: true,
      message: `Hello ${name}, your message has been received!`,
      values: {
        name: "",
        email: "",
        phoneCode: "",
        number: "",
        subject: "",
        message: "",
        role: "",
        keepInformed: false,
      },
    };
  }
gsap.registerPlugin(ScrollTrigger)
function AgencyDetail() {
  const [data, formAction, isPending] = useActionState(submitForm, {
    success: null,
    errors: {},
    values: {}
  });
    const { agencyById } = useAuth()
    const [featureAgencyList, setFeatureAgencyList] = useState()
    const [callModalOpen, setCallModalOpen] = useState(false)
    const parms = useParams()
    
    const handleOpen = () => {
        setCallModalOpen(true)
    }
    useEffect(() => {
        const fetchCart = async () => {
            try {
                let result = await agencyById(parms?.slug);
                if (result?.success) {
                    let propertyData = result?.data;
                    setFeatureAgencyList(propertyData)

                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchCart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parms?.slug])
   
  return (
    <>
      <NavBar prevButton={true} />
      <div className="secondary-color agnecy-secondary-color" style={{ paddingTop: "12px" }}>
        <div className="main-container agency-detail-container">
          <span className='d-none d-sm-inline-block'>
          <BreadCrumb items={["Home", "Agencies", featureAgencyList?.agency_profile?.city?.name, featureAgencyList?.agency_profile?.agency_name]} paths={['/',"/agency-listing" , `/agency-listing?city_code=${featureAgencyList?.agency_profile?.city?.app_code}`]} />
          </span>

          {/* Main Row */}
          <div className="row agency-detail-row mx-sm-0 mx-0" style={{ padding: '16px 0 60px' }}>
            {/* Left Content */}
            <div className="col-xl-9 col-lg-8 col-12  px-0">
              <div className="detail-code-scroll-side  gap-container" style={{ display: 'grid', gap: '40px' }}>
                <ProfileCard property_types={featureAgencyList?.property_types} data={featureAgencyList?.agency_profile} agencyData={featureAgencyList?.staff}/>
                <div className="main-agency-detail-container">
                <AgencyProperties property_types={featureAgencyList?.property_types}  data={featureAgencyList?.agency_profile} />
                </div>
            {
              featureAgencyList?.staff?.length > 0 &&
              <div className="main-agency-detail-container">
                <AgencyStaff satffData={featureAgencyList?.staff} />
              </div>
            }
                {/* <AgencyListedProperties property_types={featureAgencyList?.property_types} /> */}
              </div>
            </div>

            {/* Right Sidebar (Pinned) */}
            <div className="col-xl-3 col-lg-4 px-sm-3 px-0 d-lg-inline d-none">
              <div className="detail-code-sticky-side">
                <AgencyContactCard data={data} formAction={formAction} isPending={isPending} radio={true} contactData={featureAgencyList?.agency_profile} />
              </div>
            </div>
            <div className="d-lg-none d-inline-block">
              <Rsbuttons propertyData={featureAgencyList?.agency_profile} radio={true} handleOpen={handleOpen} />
            </div>
          </div>

          {/* After Main Row */}
          {/* <Line /> */}
          <div className="main-agency-detail-container">
            <PreLocation />
            <PreProperty />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="main-container">
        <Footer />
      </div>
      
      {/* Call Modal */}
      <CallModal 
        open={callModalOpen} 
        setOpen={setCallModalOpen} 
        contact={featureAgencyList?.agency_profile?.contacts || (featureAgencyList?.agency_profile?.phone_number ? [featureAgencyList?.agency_profile?.phone_number] : [])} 
        propertyId={featureAgencyList?.agency_profile?.id}
      />
    </>
  )
}

export default AgencyDetail
