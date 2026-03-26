import img from '../../Asset/Agencies/bues.png'
import featuredTag from '../../Asset/Agencylisting/Agencies TAG.svg'
import img2 from '../../Asset/Agencylisting/Ellipse 1928.png'
import img3 from '../../Asset/Agencylisting/Ellipse 1926.png'
import img4 from '../../Asset/Agencylisting/Ellipse 1925.png'
import img5 from '../../Asset/Agencylisting/Ellipse 1930.png'
import img6 from '../../Asset/Agencylisting/fi-rr-envelope.png'
import { useEffect, useRef, useState, useActionState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider'
import { FallbackImage } from '../Metiral/FallbackImage';
import Breadcrumb from '../Metiral/BreadCrumb';
import AgencyTag from '../Metiral/AgencyTag'
import NoResultFound from '../Metiral/NoResultFound'
import PrimaryButton from '../Metiral/Button/PrimaryButton'
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton'
import Box from '@mui/material/Box';
import { LuFilter } from 'react-icons/lu';
import Modal from '@mui/material/Modal';
import ad from '../../Asset/Ads/PP.gif'
import ad1 from '../../Asset/Ads/3.gif'
import AgencyContactCard from '../AgencyDetail/AgencyContactCard'
const email = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <g clipPath="url(#clip0_9815_109468)">
    <path d="M11.0833 0.583008H2.91667C2.1434 0.583934 1.40208 0.891522 0.855295 1.4383C0.308515 1.98508 0.00092625 2.72641 0 3.49967L0 10.4997C0.00092625 11.2729 0.308515 12.0143 0.855295 12.561C1.40208 13.1078 2.1434 13.4154 2.91667 13.4163H11.0833C11.8566 13.4154 12.5979 13.1078 13.1447 12.561C13.6915 12.0143 13.9991 11.2729 14 10.4997V3.49967C13.9991 2.72641 13.6915 1.98508 13.1447 1.4383C12.5979 0.891522 11.8566 0.583934 11.0833 0.583008ZM2.91667 1.74967H11.0833C11.4326 1.75036 11.7737 1.85556 12.0627 2.05173C12.3517 2.2479 12.5754 2.52606 12.705 2.85042L8.23783 7.31817C7.90908 7.64561 7.46399 7.82945 7 7.82945C6.53601 7.82945 6.09092 7.64561 5.76217 7.31817L1.295 2.85042C1.42459 2.52606 1.64827 2.2479 1.93728 2.05173C2.22628 1.85556 2.56738 1.75036 2.91667 1.74967ZM11.0833 12.2497H2.91667C2.45254 12.2497 2.00742 12.0653 1.67923 11.7371C1.35104 11.4089 1.16667 10.9638 1.16667 10.4997V4.37467L4.93733 8.14301C5.48487 8.68916 6.22665 8.99586 7 8.99586C7.77335 8.99586 8.51513 8.68916 9.06267 8.14301L12.8333 4.37467V10.4997C12.8333 10.9638 12.649 11.4089 12.3208 11.7371C11.9926 12.0653 11.5475 12.2497 11.0833 12.2497Z" fill="#698B75" />
  </g>
  <defs>
    <clipPath id="clip0_9815_109468">
      <rect width="14" height="14" fill="white" />
    </clipPath>
  </defs>
</svg>

const phone = <svg style={{ marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M13.989 1.17992V3.51325C13.989 3.66796 13.9275 3.81633 13.8181 3.92573C13.7087 4.03512 13.5603 4.09658 13.4056 4.09658C13.2509 4.09658 13.1025 4.03512 12.9931 3.92573C12.8838 3.81633 12.8223 3.66796 12.8223 3.51325V2.01817L9.73063 5.0935C9.62032 5.19949 9.47279 5.2579 9.31982 5.25616C9.16685 5.25441 9.02069 5.19265 8.91283 5.08417C8.80496 4.9757 8.74403 4.82919 8.74315 4.67621C8.74227 4.52324 8.80152 4.37604 8.90813 4.26633L12.0115 1.17992H10.489C10.3343 1.17992 10.1859 1.11846 10.0765 1.00906C9.96709 0.899665 9.90563 0.751292 9.90563 0.596582C9.90563 0.441872 9.96709 0.293499 10.0765 0.184103C10.1859 0.0747067 10.3343 0.0132486 10.489 0.0132486H12.8223C13.1317 0.0132486 13.4285 0.136165 13.6473 0.354957C13.866 0.57375 13.989 0.870496 13.989 1.17992ZM13.461 9.77767C13.7991 10.1166 13.9889 10.5758 13.9889 11.0546C13.9889 11.5333 13.7991 11.9925 13.461 12.3315L12.929 12.944C8.15096 17.5162 -3.47429 5.89442 1.02904 1.10233L1.69929 0.518999C2.03885 0.190448 2.49399 0.00861741 2.96646 0.0127647C3.43893 0.0169121 3.89081 0.206705 4.22454 0.541165C4.24204 0.559249 5.32296 1.96392 5.32296 1.96392C5.6436 2.30076 5.82214 2.74819 5.82149 3.21324C5.82084 3.67829 5.64104 4.12522 5.31946 4.46117L4.64338 5.31108C5.01721 6.2194 5.56683 7.04489 6.26067 7.74014C6.95452 8.43538 7.7789 8.98667 8.68646 9.36233L9.54104 8.68275C9.87696 8.36134 10.3238 8.18165 10.7887 8.181C11.2536 8.18035 11.7009 8.35878 12.0377 8.67925C12.0377 8.67925 13.443 9.76017 13.461 9.77767ZM12.659 10.6258C12.659 10.6258 11.263 9.55133 11.245 9.53383C11.1248 9.41468 10.9624 9.34782 10.7932 9.34782C10.6239 9.34782 10.4616 9.41468 10.3414 9.53383C10.3256 9.549 9.14904 10.487 9.14904 10.487C9.06976 10.5501 8.97539 10.5915 8.87525 10.607C8.77512 10.6226 8.67265 10.6118 8.57796 10.5757C7.4015 10.1382 6.33293 9.4527 5.44479 8.56577C4.55665 7.67883 3.86972 6.6112 3.43063 5.43533C3.39221 5.33973 3.37981 5.23567 3.39466 5.13372C3.40952 5.03177 3.45111 4.93557 3.51521 4.85492C3.51521 4.85492 4.45263 3.67833 4.46838 3.66258C4.58753 3.54241 4.65439 3.38002 4.65439 3.21079C4.65439 3.04156 4.58753 2.87917 4.46838 2.759C4.45088 2.7415 3.37638 1.345 3.37638 1.345C3.25448 1.23555 3.09533 1.17688 2.93155 1.181C2.76778 1.18512 2.61179 1.25173 2.49554 1.36717L1.82529 1.9505C-1.46704 5.90667 8.60888 15.4243 12.0756 12.1483L12.6076 11.5358C12.7331 11.4207 12.8086 11.2612 12.8182 11.0913C12.8278 10.9213 12.7706 10.7543 12.659 10.6258Z" fill="white" />
</svg>

const circles = [img2, img3, img2, img4, img5]

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '380px',
  maxWidth: '100%',
};



function submitForm(prevState, formData,) {
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

function AgencyDetail({ agencyData, cityName, setFilterData, filterData, pagination, setOpen, open }) {
  const navigate = useNavigate()
  const { objectToQueryString, buildSearchPayloadAgencies, loading, getAd, setAdData, adsClick, adsImpression, addData } = useAuth()
  const [order, setOrder] = useState(false)
  const number = Array.from({ length: pagination?.total_pages }, (v, i) => i + 1);
  const num = ["10", "20", "25", "30"]
  const [showCard, setShowCard] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState(null)
  const inputRef = useRef(null)
  const pageRef = useRef(null)
  const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
  const trackedImpressionsRef = useRef(new Set()); // Track which ad IDs have already been tracked

  const [data, formAction, isPending] = useActionState(submitForm, {
    success: null,
    errors: {},
    values: {}
  });

  // Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      if (!addData?.length) {
        const result = await getAd()
        if (result?.success) {
          setAdData(result?.data?.data);
        }
      }
    }
    fetchAds()
  }, [])

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setDeviceType('mobile');
      } else if (width < 992) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close modal on successful form submission
  useEffect(() => {
    if (data?.success === true) {
      const timer = setTimeout(() => {
        setContactModalOpen(false);
        setSelectedAgency(null);
      }, 2000); // Close after 2 seconds to show success message
      return () => clearTimeout(timer);
    }
  }, [data?.success]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = [
        inputRef.current,
        pageRef.current
      ];

      const clickedInside = refs.some(ref => ref && ref.contains(event.target));

      if (!clickedInside) {
        setOrder(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handlePageChange = async (pageAction) => {
    let goPage = filterData?.current_page || 1;

    if (pageAction?.action === "next" && filterData?.current_page < pagination?.total_pages) {
      goPage = filterData?.current_page + 1;
    }

    if (pageAction?.action === "back" && filterData?.current_page > 1) {
      goPage = filterData?.current_page - 1;
    }

    if (pageAction?.action === "pageChange") {
      goPage = pageAction?.page_number;
    }

    // Update current page in state
    setFilterData((prev) => ({ ...prev, current_page: goPage }));

    // Build search payload
    const payload = await buildSearchPayloadAgencies({ ...filterData, current_page: goPage });
    const queryString = objectToQueryString(payload);

    // Navigate to new page with updated query string
    navigate(`/agency-listing?${queryString}`);
  };

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

  // Filter ads based on device type and ad type, sorted by priority
  const getFilteredAds = useMemo(() => {
    if (!addData || addData.length === 0) return { horizontal: [] };

    const filtered = addData.filter(ad => {
      // Check if ad is active
      if (ad.status !== 1) return false;

      // Check date validity
      const now = new Date();
      const startDate = new Date(ad.start_date);
      const endDate = new Date(ad.end_date);
      if (now < startDate || now > endDate) return false;

      // Check device type
      const deviceTypes = ad.device_type || [];
      if (deviceTypes.includes('all') || deviceTypes.includes(deviceType)) {
        return true;
      }
      return false;
    });

    // Only horizontal ads, sorted by priority
    const horizontalAds = filtered
      .filter(ad => ad.ad_type === 'horizontal')
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));

    return { horizontal: horizontalAds };
  }, [addData, deviceType]);

  // Track ad impressions when ads are displayed
  useEffect(() => {
    const trackImpressions = async () => {
      getFilteredAds.horizontal.forEach(async (ad) => {
        if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
          trackedImpressionsRef.current.add(ad.id);
          await adsImpression(ad.id);
        }
      });
    };

    if (getFilteredAds.horizontal.length > 0) {
      trackImpressions();
    }
  }, [getFilteredAds.horizontal, adsImpression]);

  // Handle ad click
  const handleAdClick = (adId, adUrl) => {
    if (adId) {
      adsClick(adId).catch(err => console.error('Error tracking ad click:', err));
    }
    window.open(adUrl, '_blank', 'noopener,noreferrer');
  };

  // Mix agencies with horizontal ads
  // First ad after 3 cards (index 2), then every 6-9 cards after that (alternating)
  const getMixedContent = useMemo(() => {
    if (!agencyData || agencyData.length === 0) return [];

    const horizontalAds = getFilteredAds.horizontal;
    const adsForMixing = horizontalAds.length > 0 ? horizontalAds : [];
    const items = [];
    let adIndex = 0;
    let nextAdAt = 2; // First ad after 3rd card (index 2)
    let useSixCards = true; // Start with 6 cards gap

    agencyData.forEach((agency, index) => {
      items.push({ type: 'agency', data: agency, index });

      // Insert ad after current card if it's time
      if (index === nextAdAt && adIndex < adsForMixing.length) {
        items.push({ type: 'ad', data: adsForMixing[adIndex], index: `ad-${adIndex + 1}` });
        adIndex++;
        // Calculate next ad position: alternate between 6 and 9 cards
        if (adIndex === 1) {
          // After first ad, next is 6 cards later
          nextAdAt = index + 6;
          useSixCards = false; // Next will be 9 cards
        } else {
          // Alternate: 6 cards or 9 cards
          nextAdAt = index + (useSixCards ? 6 : 9);
          useSixCards = !useSixCards; // Toggle for next time
        }
      }
    });

    return items;
  }, [agencyData, getFilteredAds.horizontal]);



  return (
    <>
      <div className='agency-listing-detail'>
        {/* Breadcrumbs */}
        <div className="d-flex align-items-center justify-content-between">
          <Breadcrumb items={["Home", "Agencies", cityName]} paths={['/', "/agency-listing"]} />
          <div className="card-section d-lg-none d-flex pt-0">
            <div className="filter d-flex  align-items-center gap-2 ms-auto" onClick={() => setOpen(!open)}>
              Filter <LuFilter />
            </div>
          </div>
        </div>
        {/* Header */}
        {loading ? (
          <>
            {/* Header placeholder */}
            <div className='agency-in-lahore placeholder-glow mb-3'>
              <div className='placeholder mb-2' style={{ width: '200px', height: '32px' }} />
              <div className='d-flex justify-content-between align-items-center'>
                <div className='placeholder' style={{ width: '150px', height: '20px' }} />
                <div className='placeholder d-none d-sm-block' style={{ width: '180px', height: '40px' }} />
              </div>
            </div>
            {/* Cards placeholder */}
            <div className="row" style={{ gap: "24px 0", paddingTop: '24px' }}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                  <div className='agency-listing-box placeholder-glow'>
                    {/* Agency image and name section */}
                    <div className='agency-plantium mb-3'>
                      <div className='beusi-main-section d-flex align-items-center gap-3'>
                        <div className="beuis-box">
                          <div className='placeholder' style={{ width: '80px', height: '80px', borderRadius: '4px' }} />
                        </div>
                        <div className='real-estate flex-grow-1'>
                          <div className='placeholder mb-2' style={{ width: '60%', height: '24px' }} />
                          <div className='placeholder' style={{ width: '40%', height: '18px' }} />
                        </div>
                      </div>
                    </div>
                    {/* Staff avatars placeholder */}
                    <div className="staff-list mb-3">
                      <div className='d-flex gap-2'>
                        {[...Array(4)].map((_, idx) => (
                          <div key={idx} className="staff-avatar">
                            <div className='placeholder w-100 h-100' style={{ borderRadius: '50%' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* HR line */}
                    <div className='agency-hr-line mb-3'>
                      <hr />
                    </div>
                    {/* Stats placeholder */}
                    <div className='agency-headings mb-3'>
                      <div className='inner-heading mb-2 d-flex justify-content-between'>
                        <div className='placeholder' style={{ width: '60%', height: '16px' }} />
                        <div className='placeholder' style={{ width: '30%', height: '24px' }} />
                      </div>
                      <div className='inner-heading mb-2 d-flex justify-content-between'>
                        <div className='placeholder' style={{ width: '55%', height: '16px' }} />
                        <div className='placeholder' style={{ width: '25%', height: '24px' }} />
                      </div>
                      <div className='inner-heading d-flex justify-content-between'>
                        <div className='placeholder' style={{ width: '55%', height: '16px' }} />
                        <div className='placeholder' style={{ width: '25%', height: '24px' }} />
                      </div>
                    </div>
                    {/* Buttons placeholder */}
                    <div className='agency-buttons d-flex flex-column gap-2'>
                      {/* <div className='placeholder' style={{ width: '100%', height: '44px', borderRadius: '4px' }} /> */}
                      <div className='placeholder' style={{ width: '100%', height: '44px', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : <>
          <div className='agency-in-lahore'>
            <h2 className='d-flex align-items-baseline mb-0'>
              Agencies in {cityName}
              <span className='ms-1'>({pagination?.total})</span>
            </h2>
            <div className="d-flex justify-content-between align-items-center">
              {
                agencyData?.length > 0 ?
                  <>
                    <h4 className='mb-0 d-flex align-items-center'>{pagination?.from}-{pagination?.to} of {pagination?.total} agencies</h4>
                    <div className="card-order" ref={inputRef}>
                      <div className="input" onClick={() => setOrder(!order)}>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8.66667 6.16699H17.3333C17.5101 6.16699 17.6797 6.08797 17.8047 5.94732C17.9298 5.80667 18 5.6159 18 5.41699C18 5.21808 17.9298 5.02731 17.8047 4.88666C17.6797 4.74601 17.5101 4.66699 17.3333 4.66699H8.66667C8.48986 4.66699 8.32029 4.74601 8.19526 4.88666C8.07024 5.02731 8 5.21808 8 5.41699C8 5.6159 8.07024 5.80667 8.19526 5.94732C8.32029 6.08797 8.48986 6.16699 8.66667 6.16699Z" fill="#737678" />
                            <path d="M17.3333 9.33301H8.66667C8.48986 9.33301 8.32029 9.41203 8.19526 9.55268C8.07024 9.69333 8 9.8841 8 10.083C8 10.2819 8.07024 10.4727 8.19526 10.6133C8.32029 10.754 8.48986 10.833 8.66667 10.833H17.3333C17.5101 10.833 17.6797 10.754 17.8047 10.6133C17.9298 10.4727 18 10.2819 18 10.083C18 9.8841 17.9298 9.69333 17.8047 9.55268C17.6797 9.41203 17.5101 9.33301 17.3333 9.33301Z" fill="#737678" />
                            <path d="M17.3333 14H8.66667C8.48986 14 8.32029 14.079 8.19526 14.2197C8.07024 14.3603 8 14.5511 8 14.75C8 14.9489 8.07024 15.1397 8.19526 15.2803C8.32029 15.421 8.48986 15.5 8.66667 15.5H17.3333C17.5101 15.5 17.6797 15.421 17.8047 15.2803C17.9298 15.1397 18 14.9489 18 14.75C18 14.5511 17.9298 14.3603 17.8047 14.2197C17.6797 14.079 17.5101 14 17.3333 14Z" fill="#737678" />
                            <path d="M5.69647 6.24444C5.75654 6.24443 5.81526 6.22604 5.86519 6.19161C5.91513 6.15718 5.95403 6.10826 5.97698 6.05103C5.99992 5.9938 6.00589 5.93084 5.99411 5.87011C5.98233 5.80939 5.95334 5.75363 5.91081 5.7099L4.42928 4.18326C4.31542 4.06592 4.161 4 4 4C3.839 4 3.68459 4.06592 3.57072 4.18326L2.0898 5.7099C2.04727 5.75363 2.01828 5.80939 2.0065 5.87011C1.99472 5.93084 2.00068 5.9938 2.02363 6.05103C2.04658 6.10826 2.08548 6.15718 2.13541 6.19161C2.18535 6.22604 2.24406 6.24443 2.30414 6.24444H3.39342V13.7556H2.30414C2.24401 13.7554 2.18521 13.7737 2.13518 13.8081C2.08516 13.8425 2.04616 13.8914 2.02314 13.9487C2.00012 14.0059 1.9941 14.069 2.00586 14.1297C2.01762 14.1905 2.04662 14.2463 2.08919 14.2901L3.57072 15.8167C3.68459 15.9341 3.839 16 4 16C4.161 16 4.31542 15.9341 4.42928 15.8167L5.91081 14.2901C5.95334 14.2464 5.98233 14.1906 5.99411 14.1299C6.00589 14.0692 5.99992 14.0062 5.97698 13.949C5.95403 13.8917 5.91513 13.8428 5.86519 13.8084C5.81526 13.774 5.75654 13.7556 5.69647 13.7556H4.60779V6.24444H5.69647Z" fill="#737678" />
                          </svg>
                          <span>
                            {filterData?.most_properties_type ? `Most ${filterData?.most_properties_type} Properties` : "Default"}
                          </span>
                        </span>
                        <span style={{ minWidth: 'unset' }}>
                          {
                            !order ?
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              :
                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                          }
                        </span>
                      </div>
                      {
                        order ?
                          <>
                            <div className="input-drop-menu">
                              <div className={filterData?.most_properties_type === "sell" ? "title active" : "title"} onClick={async () => {
                                setFilterData({ ...filterData, most_properties_type: "sell" });
                                setOrder(false)
                                // Build search payload
                                const payload = await buildSearchPayloadAgencies({ ...filterData, most_properties_type: "sell" });
                                const queryString = objectToQueryString(payload);

                                // Navigate to new page with updated query string
                                navigate(`/agency-listing?${queryString}`);
                              }}>Most Sell Properties</div>
                              <div className={filterData?.most_properties_type === "rent" ? "title active" : "title"} onClick={async () => {
                                setFilterData({ ...filterData, most_properties_type: "rent" });
                                setOrder(false)
                                // Build search payload
                                const payload = await buildSearchPayloadAgencies({ ...filterData, most_properties_type: "rent" });
                                const queryString = objectToQueryString(payload);

                                // Navigate to new page with updated query string
                                navigate(`/agency-listing?${queryString}`);
                              }}>Most Rent Properties</div>
                              <div className={filterData?.most_properties_type === "lease" ? "title active" : "title"} onClick={async () => {
                                setFilterData({ ...filterData, most_properties_type: "lease" });
                                setOrder(false)
                                // Build search payload
                                const payload = await buildSearchPayloadAgencies({ ...filterData, most_properties_type: "lease" });
                                const queryString = objectToQueryString(payload);

                                // Navigate to new page with updated query string
                                navigate(`/agency-listing?${queryString}`);
                              }}>Most Lease Properties</div>
                            </div>
                          </>
                          :
                          <></>
                      }
                    </div>
                  </> : ""

              }
            </div>
          </div>
          {/* <a href={""} target='_blank' className='global-horizontal-ad-box mt-4'>
            <Image src={ad} alt="" />
          </a> */}

          {agencyData?.length > 0 ? (
            <div className="row" style={{ gap: "24px 0", paddingTop: '24px' }}>
              {getMixedContent.map((item, mixedIndex) => {
                if (item.type === 'agency') {
                  const agency = item.data;
                  return (
                    <div
                      className="col-lg-4 col-md-6 col-sm-12"
                      key={`agency-card-${agency?.id || agency?.agency_id || mixedIndex}`}
                    >
                      <div className='agency-listing-box' style={{ cursor: 'pointer' }} onClick={() => navigate(`/agency-detail/${agency?.id || agency?.agency_id}`)}>
                        {/* Top section */}
                        {
                          agency?.is_featured &&
                          <div className="featured-tag">
                            <FallbackImage src={featuredTag} alt="featured" pageName="AgencyDetail" />
                          </div>
                        }
                        <div className='agency-plantium'>
                          <div className='beusi-main-section'>
                            <div className="beuis-box">
                              <FallbackImage className="beuis-box-img" style={{ backgroundColor: 'white', borderRadius: '4px', padding: agency?.agency_image ? '0' : '0', borderRadius: agency?.package?.name ? "" : '4px' }} src={agency?.agency_image} alt="logo" pageName="AgencyDefault" />

                              {
                                agency?.package?.name ?
                                  <div className="beusi-platinum" style={{ left: "-15px" }}>
                                    {agency?.package?.name === "Bronze" ? <AgencyTag leftArrow={true} text={agency?.package?.name} borderR={true} rightArrow={true} size={'12px'} width={'78px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #804A00 0%, #91631B 34.26%, #9F7C3D 75%, #B08D57 100%))"} /> : ""}
                                    {agency?.package?.name === "Gold" ? <AgencyTag leftArrow={true} text={agency?.package?.name} width={'62px'} svgColor={"#C6A700"} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Gold, linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%))"} /> : ""}
                                    {agency?.package?.name === "Platinum" ? <AgencyTag leftArrow={true} text={agency?.package?.name} width={'91px'} borderR={true} rightArrow={true} size={'12px'} backColor={" var(--Tags-Platinum, linear-gradient(90deg, #E5E4E2 0%, #9D9D9D 25%, #B7B6B3 50%, #9D9D9D 75%, #E5E4E2 100%))"} /> : ""}
                                  </div>
                                  : ""
                              }
                            </div>

                            <div className='real-estate'>
                              <h3>{agency?.agency_name}</h3>
                            </div>
                          </div>
                        </div>

                        {/* Staff */}
                        <div className="staff-list">
                          {agency?.staff && agency?.staff?.length > 0 ? (
                            <>
                              {agency?.staff.slice(0, 4).map((staff, idx) => (
                                <div className="staff-avatar" key={idx}>
                                  <FallbackImage src={staff?.avatar} alt="" pageName="AgentDefault" />
                                </div>
                              ))}
                              {
                                agency?.staff?.length > 4 &&
                                <div className="staff-more">+{agency?.staff?.length - 4} more</div>
                              }
                            </>
                          ) : (
                            <>
                              <div className="staff-avatar no-staff-back"></div>
                              <div className="staff-avatar no-staff">No Staff</div>
                            </>
                          )}
                        </div>

                        {/* Line */}
                        <div className='agency-hr-line'><hr /></div>

                        {/* Details */}
                        <div className='agency-headings'>
                          <div className='inner-heading'>
                            <h5>Total time on Pakistan Property</h5>
                            {(() => {
                              const timeUnit = convertDaysToTimeUnit(agency.total_time_on_pakistan_property || 0);
                              return (
                                <>
                                  <h4>{timeUnit.value} {timeUnit.unit}</h4>
                                </>
                              );
                            })()}
                          </div>
                          <div className='inner-heading'>
                            <h5>Properties for Rent</h5>
                            <h4>{agency.rent_count}</h4>
                          </div>
                          <div className='inner-heading'>
                            <h5>Properties for Sale</h5>
                            <h4>{agency.sell_count}</h4>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className='agency-buttons' onClick={(e) => e.stopPropagation()}>

                          <PrimaryButton
                            icon={phone}
                            text="Get free Consultation"
                            maxWidth="100%"
                            width={true}
                            onFunction={(e) => {
                              if (e) {
                                e.stopPropagation();
                              }
                              setSelectedAgency(agency);
                              setContactModalOpen(true);
                            }}
                          />

                          <PrimaryBorderButton
                            icon={email}
                            text="Email"
                            onFunction={(e) => {
                              e.stopPropagation();
                              const emailAddress = agency?.email || agency?.agency_email || '';
                              if (emailAddress) {
                                const subject = encodeURIComponent(`Inquiry about ${agency?.agency_name}`);
                                const body = encodeURIComponent('Hello,\n\nI am interested in your services. Please contact me.\n\nBest regards');
                                window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
                              }
                            }}
                          />

                        </div>
                      </div>
                    </div>
                  );
                } else if (item.type === 'ad') {
                  return (
                    <div key={`agency-ad-${item?.data?.id || mixedIndex}`} className="col-12">
                      <a
                        href={item.data.url}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAdClick(item.data.id, item.data.url);
                        }}
                        className="global-horizontal-ad-box w-100 mt-3 d-block"
                      >
                        <img src={item.data.image} alt={item.data.title || 'Advertisement'} className="w-100" />
                      </a>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (

            <div className="mt-3">
              <NoResultFound />
            </div>
          )}
        </>}
        {agencyData?.length > 0 && (
          <div className="row w-100 m-0 justify-content-end align-items-center" style={{ gap: '20px 80px', paddingTop: "28px" }}>
            <div className="col-md-4 col-sm-6 col-12 order-sm-first order-last p-0">
              <div className="pagination mt-sm-0 mt-4 w-lg-unset w-100 justify-content-md-center justify-content-sm-start justify-content-center">
                <div className="move-btn back" onClick={() => handlePageChange({ action: "back" })}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2329 4.18414C10.4626 4.423 10.4551 4.80282 10.2163 5.0325L7.06605 8L10.2163 10.9675C10.4551 11.1972 10.4626 11.577 10.2329 11.8159C10.0032 12.0547 9.62339 12.0622 9.38452 11.8325L5.78452 8.4325C5.66688 8.31938 5.60039 8.16321 5.60039 8C5.60039 7.83679 5.66688 7.68062 5.78452 7.5675L9.38452 4.1675C9.62339 3.93782 10.0032 3.94527 10.2329 4.18414Z" fill="#737678" />
                  </svg>
                  Back
                </div>

                {number?.map((num, index) => (
                  <div
                    key={index}
                    className={`page-number ${((filterData?.current_page || 1) - 1) === index ? 'active' : ''}`}

                    onClick={() => handlePageChange({ action: "pageChange", page_number: num })}
                  >
                    {num}
                  </div>
                ))}

                <div className="move-btn next" onClick={() => handlePageChange({ action: "next" })}>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.76711 11.8159C5.53743 11.577 5.54488 11.1972 5.78374 10.9675L8.93395 8L5.78374 5.0325C5.54488 4.80282 5.53743 4.423 5.76711 4.18413C5.99679 3.94527 6.37661 3.93782 6.61548 4.1675L10.2155 7.5675C10.3331 7.68062 10.3996 7.83679 10.3996 8C10.3996 8.16321 10.3331 8.31938 10.2155 8.4325L6.61548 11.8325C6.37661 12.0622 5.99679 12.0547 5.76711 11.8159Z" fill="#737678" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-4 p-0 d-sm-inline-block d-none">
              <div className="card-showing-box">
                <div className="text" onClick={() => setShowCard(!showCard)}>Result per page</div>
                <div className="box" ref={pageRef} onClick={() => setShowCard(!showCard)}>{filterData?.per_page || 10}
                  {
                    !showCard ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                        <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                  }
                  {
                    showCard ?
                      <>
                        <div className="input-drop-menu">
                          {
                            num?.map((item) => (
                              <div key={`per-page-${item}`} className={filterData?.per_page === item ? "title active" : "title"} onClick={async () => {
                                setFilterData({ ...filterData, per_page: item }); setShowCard(false)
                                const data = await buildSearchPayloadAgencies({ ...filterData, per_page: item })
                                const queryString = objectToQueryString(data);
                                navigate(`/agency-listing?${queryString}`)
                              }}>{item}</div>
                            ))
                          }
                        </div>
                      </>
                      :
                      ''
                  }
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      <Modal
        open={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setSelectedAgency(null);
        }}
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
      >
        <Box className='card-contact-modal' sx={modalStyle}>
          <AgencyContactCard
            dontShowInfo={true}
            data={data}
            formAction={formAction}
            isPending={isPending}
            radio={true}
            mediaQuery={true}
            justify={true}
            image={true}
            contactData={selectedAgency}
            NewpropertyData={selectedAgency}
            onClose={() => {
              setContactModalOpen(false);
              setSelectedAgency(null);
            }}
          />
        </Box>
      </Modal>
    </>
  )
}

export default AgencyDetail