import { useEffect, useRef, useState } from 'react'
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton'
import PrimaryButton from '../Metiral/Button/PrimaryButton'
import WhatsAppButton from '../Metiral/Button/WhatsAppButton'
import { useAuth } from '../../Context/ContextProvider'
import { IoIosArrowDown } from 'react-icons/io'
import { useActionState } from "react";
import { Radio } from '@mui/material'
import CustomTooltip from '../Metiral/CustomTooltip'
import { FallbackImage } from '../Metiral/FallbackImage'
import CallModal from '../Metiral/CallModal';
import { useNavigate } from 'react-router-dom';
import img6 from '../../Asset/ProjectListing/Text.png'
import img7 from '../../Asset/ProjectListing/badge.png'
import AgencyTag from '../Metiral/AgencyTag';
import { buildPropertyWhatsappMessage, formatPropertyLocationLine, getPropertyDetailUrl } from '../../utils/propertyWhatsappMessage';
import featuredTag from '../../Asset/Agencylisting/Agencies detail  TAG 2.svg'

const phone = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
    <g clipPath="url(#clip0_6086_87125)">
        <path d="M13.9851 1.67992V4.01325C13.9851 4.16796 13.9236 4.31633 13.8142 4.42573C13.7048 4.53512 13.5564 4.59658 13.4017 4.59658C13.247 4.59658 13.0986 4.53512 12.9892 4.42573C12.8798 4.31633 12.8184 4.16796 12.8184 4.01325V2.51817L9.72672 5.5935C9.61641 5.69949 9.46888 5.7579 9.31591 5.75616C9.16295 5.75441 9.01678 5.69265 8.90892 5.58417C8.80105 5.4757 8.74012 5.32919 8.73924 5.17621C8.73836 5.02324 8.79761 4.87604 8.90422 4.76633L12.0076 1.67992H10.4851C10.3303 1.67992 10.182 1.61846 10.0726 1.50906C9.96318 1.39966 9.90172 1.25129 9.90172 1.09658C9.90172 0.941872 9.96318 0.793499 10.0726 0.684103C10.182 0.574707 10.3303 0.513249 10.4851 0.513249H12.8184C13.1278 0.513249 13.4246 0.636165 13.6433 0.854957C13.8621 1.07375 13.9851 1.3705 13.9851 1.67992ZM13.4571 10.2777C13.7952 10.6166 13.985 11.0758 13.985 11.5546C13.985 12.0333 13.7952 12.4925 13.4571 12.8315L12.9251 13.444C8.14705 18.0162 -3.4782 6.39442 1.02514 1.60233L1.69539 1.019C2.03494 0.690448 2.49009 0.508617 2.96255 0.512765C3.43502 0.516912 3.8869 0.706705 4.22064 1.04117C4.23814 1.05925 5.31905 2.46392 5.31905 2.46392C5.6397 2.80076 5.81824 3.24819 5.81758 3.71324C5.81693 4.17829 5.63714 4.62522 5.31555 4.96117L4.63947 5.81108C5.0133 6.7194 5.56292 7.54489 6.25677 8.24014C6.95061 8.93538 7.775 9.48667 8.68256 9.86233L9.53714 9.18275C9.87305 8.86134 10.3199 8.68165 10.7848 8.681C11.2497 8.68035 11.697 8.85878 12.0338 9.17925C12.0338 9.17925 13.4391 10.2602 13.4571 10.2777ZM12.6551 11.1258C12.6551 11.1258 11.2591 10.0513 11.2411 10.0338C11.1209 9.91468 10.9585 9.84782 10.7893 9.84782C10.62 9.84782 10.4576 9.91468 10.3375 10.0338C10.3217 10.049 9.14514 10.987 9.14514 10.987C9.06585 11.0501 8.97149 11.0915 8.87135 11.107C8.77121 11.1226 8.66875 11.1118 8.57405 11.0757C7.39759 10.6382 6.32903 9.9527 5.44088 9.06577C4.55274 8.17883 3.86581 7.1112 3.42672 5.93533C3.38831 5.83973 3.3759 5.73567 3.39076 5.63372C3.40561 5.53177 3.44721 5.43557 3.5113 5.35492C3.5113 5.35492 4.44872 4.17833 4.46447 4.16258C4.58363 4.04241 4.65048 3.88002 4.65048 3.71079C4.65048 3.54156 4.58363 3.37917 4.46447 3.259C4.44697 3.2415 3.37247 1.845 3.37247 1.845C3.25057 1.73555 3.09142 1.67688 2.92765 1.681C2.76387 1.68512 2.60788 1.75173 2.49164 1.86717L1.82139 2.4505C-1.47095 6.40667 8.60497 15.9243 12.0717 12.6483L12.6037 12.0358C12.7291 11.9207 12.8047 11.7612 12.8143 11.5913C12.8239 11.4213 12.7667 11.2543 12.6551 11.1258Z" fill="#698B75" />
    </g>
    <defs>
        <clipPath id="clip0_6086_87125">
            <rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
        </clipPath>
    </defs>
</svg>
const whatsapp = <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.4977 4.5C8.08742 4.5 4.5 8.08842 4.5 12.4999C4.5 14.2495 5.06421 15.872 6.02334 17.189L5.02653 20.1613L8.10148 19.1785C9.3662 20.0157 10.8755 20.5 12.5023 20.5C16.9126 20.5 20.5 16.9114 20.5 12.5001C20.5 8.08857 16.9126 4.50013 12.5023 4.50013L12.4977 4.5ZM10.2643 8.56361C10.1092 8.19209 9.9916 8.17802 9.75659 8.16847C9.67658 8.16382 9.5874 8.15918 9.48855 8.15918C9.18282 8.15918 8.86316 8.24851 8.67035 8.44601C8.43535 8.68586 7.85227 9.24546 7.85227 10.3931C7.85227 11.5407 8.68919 12.6506 8.80198 12.8059C8.91955 12.9609 10.4336 15.3501 12.7844 16.3238C14.6228 17.0857 15.1683 17.0151 15.5867 16.9258C16.1979 16.7941 16.9643 16.3424 17.1571 15.797C17.35 15.2514 17.3499 14.7857 17.2934 14.687C17.237 14.5882 17.0818 14.5319 16.8468 14.4142C16.6118 14.2966 15.4691 13.7322 15.2528 13.657C15.0412 13.5771 14.8391 13.6053 14.6793 13.8311C14.4536 14.1462 14.2327 14.4661 14.0539 14.6588C13.9129 14.8094 13.6824 14.8282 13.4897 14.7482C13.2311 14.6401 12.5071 14.3859 11.6137 13.5911C10.9225 12.9751 10.4523 12.2086 10.316 11.9782C10.1796 11.7431 10.302 11.6065 10.41 11.4796C10.5275 11.3337 10.6403 11.2303 10.7579 11.0939C10.8755 10.9576 10.9413 10.887 11.0165 10.727C11.0966 10.5719 11.04 10.4119 10.9836 10.2943C10.9272 10.1767 10.4571 9.0291 10.2643 8.56361Z" fill="#20A853" />
</svg>
const email = <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
    <g clipPath="url(#clip0_6086_32443)">
        <path d="M11.5833 0.583008H3.41667C2.6434 0.583934 1.90208 0.891522 1.3553 1.4383C0.808515 1.98508 0.500926 2.72641 0.5 3.49967L0.5 10.4997C0.500926 11.2729 0.808515 12.0143 1.3553 12.561C1.90208 13.1078 2.6434 13.4154 3.41667 13.4163H11.5833C12.3566 13.4154 13.0979 13.1078 13.6447 12.561C14.1915 12.0143 14.4991 11.2729 14.5 10.4997V3.49967C14.4991 2.72641 14.1915 1.98508 13.6447 1.4383C13.0979 0.891522 12.3566 0.583934 11.5833 0.583008ZM3.41667 1.74967H11.5833C11.9326 1.75036 12.2737 1.85556 12.5627 2.05173C12.8517 2.2479 13.0754 2.52606 13.205 2.85042L8.73783 7.31817C8.40908 7.64561 7.96399 7.82945 7.5 7.82945C7.03601 7.82945 6.59092 7.64561 6.26217 7.31817L1.795 2.85042C1.92459 2.52606 2.14827 2.2479 2.43728 2.05173C2.72628 1.85556 3.06738 1.75036 3.41667 1.74967ZM11.5833 12.2497H3.41667C2.95254 12.2497 2.50742 12.0653 2.17923 11.7371C1.85104 11.4089 1.66667 10.9638 1.66667 10.4997V4.37467L5.43733 8.14301C5.98487 8.68916 6.72665 8.99586 7.5 8.99586C8.27335 8.99586 9.01513 8.68916 9.56267 8.14301L13.3333 4.37467V10.4997C13.3333 10.9638 13.149 11.4089 12.8208 11.7371C12.4926 12.0653 12.0475 12.2497 11.5833 12.2497Z" fill="white" />
    </g>
    <defs>
        <clipPath id="clip0_6086_32443">
            <rect width="14" height="14" fill="white" transform="translate(0.5)" />
        </clipPath>
    </defs>
</svg>

const middleLogo = <svg xmlns="http://www.w3.org/2000/svg" width="56" height="71" viewBox="0 0 56 71" fill="none">
    <g opacity="0.08">
        <path d="M1.86924 18.8378L9.53311 13.417C9.90696 13.2301 10.0939 12.8562 10.0939 12.4824V9.6785C10.0939 7.62234 8.41156 6.12695 6.54233 6.12695H3.55155C1.49539 6.12695 0 7.80927 0 9.6785V18.0901C0 18.8378 1.12154 19.3985 1.86924 18.8378Z" fill="#1B573E" />
        <path d="M61.4979 67.8116C64.6756 67.8116 67.1056 65.3815 67.1056 62.2038V24.4453C67.1056 22.576 66.171 20.7068 64.4887 19.7722L35.3286 0.892877C33.4593 -0.415589 30.8424 -0.228664 28.9732 1.0798L2.43001 19.9591C0.934617 21.0806 0 22.7629 0 24.4453V62.0169C0 65.1946 2.43001 67.6246 5.60771 67.6246L61.4979 67.8116Z" fill="#1B573E" />
        <path d="M23.3744 36.7836H26.5521V20.5213H36.2722C36.2722 20.5213 47.1137 22.0167 47.4876 33.7929C47.4876 33.7929 47.6745 44.8214 36.2722 46.8775H23.1875V70.8037H26.5521V50.4291L35.3375 50.616C35.3375 50.616 49.7307 49.8683 50.8522 33.6059C50.8522 33.6059 51.2261 20.5213 37.0199 16.9697H23.1875V36.7836H23.3744Z" fill="white" />
        <path d="M30.0986 23.6982H35.8932C35.8932 23.6982 43.9309 25.7544 44.1178 32.8575C44.1178 32.8575 45.4263 41.6429 35.5193 43.6991H20.0047V70.9899H16.4531V23.6982H30.0986Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M38.6983 36.7834C37.5767 37.9049 35.7075 39.0265 33.2775 38.8395C27.6698 38.6526 24.4921 32.4841 27.2959 27.811C27.4828 27.4372 27.8567 27.0633 28.0436 26.6895C28.4175 26.3157 28.6044 26.1287 28.9782 25.7549C28.4175 25.7549 27.6698 26.3157 27.2959 26.5026C25.8005 27.4372 24.4921 29.1195 23.9313 30.8018C21.5013 38.2788 30.4736 44.2603 36.4552 39.4003C37.2029 39.2134 38.5113 37.718 38.6983 36.7834Z" fill="#1B573E" />
        <path fillRule="evenodd" clipRule="evenodd" d="M33.0935 29.8673L30.4766 30.9889L33.0935 31.5496L33.4673 34.5404L34.9627 32.1104L37.7666 32.6712L35.8973 30.615L37.3927 27.9981L34.5889 29.1196L32.7196 27.0635L33.0935 29.8673Z" fill="#1B573E" />
    </g>
</svg>

const largeLogo = <svg xmlns="http://www.w3.org/2000/svg" width="164" height="173" viewBox="0 0 164 173" fill="none">
    <g opacity="0.06">
        <path d="M4.55505 45.902L23.2307 32.6924C24.1417 32.2369 24.5972 31.3259 24.5972 30.4149V23.5823C24.5972 18.5718 20.4977 14.9277 15.9427 14.9277H8.65458C3.64403 14.9277 0 19.0273 0 23.5823V44.08C0 45.902 2.73303 47.2686 4.55505 45.902Z" fill="#1B573E" />
        <path d="M149.861 165.246C157.605 165.246 163.526 159.325 163.526 151.581V59.5694C163.526 55.0143 161.249 50.4593 157.149 48.1818L86.0904 2.17581C81.5353 -1.01273 75.1582 -0.55722 70.6032 2.63131L5.92156 48.6373C2.27752 51.3703 0 55.4698 0 59.5694V151.126C0 158.869 5.92156 164.791 13.6651 164.791L149.861 165.246Z" fill="#1B573E" />
        <path d="M56.9555 89.6331H64.6991V50.0042H88.3853C88.3853 50.0042 114.805 53.6482 115.716 82.345C115.716 82.345 116.171 109.22 88.3853 114.23H56.5V172.535H64.6991V122.885L86.1078 123.34C86.1078 123.34 121.182 121.518 123.915 81.8895C123.915 81.8895 124.826 50.0042 90.2073 41.3496H56.5V89.6331H56.9555Z" fill="white" />
        <path d="M73.3378 57.7451H87.4584C87.4584 57.7451 107.045 62.7557 107.501 80.0648C107.501 80.0648 110.689 101.474 86.5474 106.484H48.7405V172.988H40.0859V57.7451H73.3378Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M94.2912 89.6345C91.5582 92.3676 87.0032 95.1006 81.0816 94.6451C67.4165 94.1896 59.6729 79.1579 66.5055 67.7703C66.961 66.8593 67.872 65.9483 68.3275 65.0373C69.2385 64.1263 69.694 63.6708 70.605 62.7598C69.2385 62.7598 67.4165 64.1263 66.5055 64.5818C62.8614 66.8593 59.6729 70.9589 58.3064 75.0584C52.3848 93.2786 74.249 107.855 88.8252 96.0116C90.6472 95.5561 93.8357 91.9121 94.2912 89.6345Z" fill="#1B573E" />
        <path fillRule="evenodd" clipRule="evenodd" d="M80.6271 72.7808L74.25 75.5138L80.6271 76.8803L81.5381 84.1684L85.1821 78.2469L92.0147 79.6134L87.4596 74.6028L91.1037 68.2258L84.2711 70.9588L79.716 65.9482L80.6271 72.7808Z" fill="#1B573E" />
    </g>
</svg>

const smallLogo = <svg xmlns="http://www.w3.org/2000/svg" width="23" height="43" viewBox="0 0 23 43" fill="none">
    <g opacity="0.06">
        <path d="M1.13223 11.4091L5.77435 8.12564C6.0008 8.01242 6.11402 7.78598 6.11402 7.55953V5.86119C6.11402 4.61574 5.09502 3.70996 3.96279 3.70996H2.15123C0.905781 3.70996 0 4.72897 0 5.86119V10.9562C0 11.4091 0.679336 11.7488 1.13223 11.4091Z" fill="#1B573E" />
        <path d="M37.2503 41.0745C39.175 41.0745 40.6469 39.6026 40.6469 37.6779V14.8069C40.6469 13.6747 40.0808 12.5424 39.0618 11.9763L21.3991 0.54083C20.2669 -0.251729 18.6817 -0.138506 17.5495 0.654053L1.47189 12.0895C0.566112 12.7689 0 13.7879 0 14.8069V37.5646C0 39.4894 1.47189 40.9613 3.39668 40.9613L37.2503 41.0745Z" fill="#1B573E" />
        <path d="M14.1523 22.2789H16.0771V12.4286H21.9646C21.9646 12.4286 28.5316 13.3344 28.758 20.4674C28.758 20.4674 28.8712 27.1475 21.9646 28.393H14.0391V42.8855H16.0771V30.5442L21.3985 30.6574C21.3985 30.6574 30.1167 30.2045 30.796 20.3542C30.796 20.3542 31.0225 12.4286 22.4175 10.2773H14.0391V22.2789H14.1523Z" fill="white" />
        <path d="M18.2262 14.3535H21.7361C21.7361 14.3535 26.6047 15.599 26.7179 19.9014C26.7179 19.9014 27.5104 25.2229 21.5096 26.4683H12.1122V42.9988H9.96094V14.3535H18.2262Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23.4338 22.2797C22.7545 22.9591 21.6223 23.6384 20.1504 23.5252C16.7537 23.412 14.8289 19.6756 16.5272 16.8451C16.6405 16.6186 16.8669 16.3922 16.9801 16.1657C17.2066 15.9393 17.3198 15.8261 17.5462 15.5996C17.2066 15.5996 16.7537 15.9393 16.5272 16.0525C15.6215 16.6186 14.8289 17.6376 14.4892 18.6566C13.0173 23.1855 18.452 26.8087 22.0751 23.8649C22.528 23.7516 23.3206 22.8459 23.4338 22.2797Z" fill="#1B573E" />
        <path fillRule="evenodd" clipRule="evenodd" d="M20.0382 18.0899L18.4531 18.7693L20.0382 19.1089L20.2647 20.9205L21.1705 19.4486L22.8688 19.7883L21.7366 18.5428L22.6424 16.9577L20.944 17.6371L19.8118 16.3916L20.0382 18.0899Z" fill="#1B573E" />
    </g>
</svg>


function AgencyContactCard({ NewpropertyData, dontShowInfo, data, formAction, isPending, subject, radio, mediaQuery, justify, image, contactData, propertyData, onClose, modifyCard, modifyCardState }) {
    const navigate = useNavigate();
    const callingRef = useRef(null);
    const [show, setShow] = useState(false)
    const { callingCode, formatPakistaniPhoneNumber, setOpen: setSnackbarOpen, setError: setSnackbarError, handleOpenWhatsapp, whatsappImpretion, loginData } = useAuth()
    const [selectedCode, setSelectedCode] = useState({
        flag: 'https://flagcdn.com/pk.svg',
        callingCode: '+92'
    });
    const [phoneValue, setPhoneValue] = useState(data?.values?.number || "");
    const [callModalOpen, setCallModalOpen] = useState(false);
    const prevSuccessRef = useRef(data?.success);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (callingRef.current && !callingRef.current.contains(event.target)) {
                setShow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Sync phoneValue with form data
    useEffect(() => {
        if (data?.values?.number !== undefined) {
            setPhoneValue(data.values.number || "");
        }
    }, [data?.values?.number]);

    // Handle call button click - always show modal
    const handleCall = () => {
        // Priority: contactData > developer > user
        let phoneNumber = null;
        if (contactData?.phone_number) {
            phoneNumber = contactData.phone_number;
        } else if (NewpropertyData?.developer) {
            phoneNumber = NewpropertyData?.phone_number || NewpropertyData?.contacts?.[0];
        } else {
            phoneNumber = NewpropertyData?.user?.phone_number;
        }

        // Get all contacts - check if contactData has multiple numbers or if there are other sources
        let allContacts = [];
        if (contactData?.phone_number) {
            allContacts.push(contactData.phone_number);
        }

        let dataPhoneNumber = null;
        if (NewpropertyData?.developer) {
            dataPhoneNumber = NewpropertyData?.phone_number || NewpropertyData?.contacts?.[0];
        } else {
            dataPhoneNumber = NewpropertyData?.user?.phone_number;
        }

        if (dataPhoneNumber && dataPhoneNumber !== contactData?.phone_number) {
            allContacts.push(dataPhoneNumber);
        }

        // If developer has contacts array, add all of them
        if (NewpropertyData?.developer && NewpropertyData?.contacts && Array.isArray(NewpropertyData.contacts)) {
            NewpropertyData.contacts.forEach(contact => {
                if (contact && !allContacts.includes(contact)) {
                    allContacts.push(contact);
                }
            });
        }

        // If no contacts found, use phoneNumber as fallback
        if (allContacts.length === 0 && phoneNumber) {
            allContacts = [phoneNumber];
        }

        if (allContacts.length > 0) {
            setCallModalOpen(true);
        }
    };

    // Handle WhatsApp click - open chat
    const handleWhatsAppClick = () => {
        // Priority: contactData > developer > user
        let phoneNumber = null;
        if (contactData?.phone_number) {
            phoneNumber = contactData.phone_number;
        } else if (NewpropertyData?.developer) {
            phoneNumber = NewpropertyData?.phone_number || NewpropertyData?.whatsapp || NewpropertyData?.contacts?.[0];
        } else {
            phoneNumber = NewpropertyData?.user?.phone_number;
        }

        if (phoneNumber) {
            const cleanNumber = phoneNumber.toString().replace(/\s+/g, '').replace(/[^0-9]/g, '');
            const userName = loginData?.data?.user?.name;
            const slug = NewpropertyData?.slug || propertyData?.slug;
            const city = formatPropertyLocationLine({
                location: NewpropertyData?.location || propertyData?.location,
                city: NewpropertyData?.city ?? propertyData?.city,
            });
            const msg = buildPropertyWhatsappMessage({
                userName: (userName && String(userName).trim()) || 'there',
                propertyTitle: NewpropertyData?.title || NewpropertyData?.property_title || propertyData?.title,
                city,
                propertyUrl: slug ? getPropertyDetailUrl(slug) : (typeof window !== 'undefined' ? window.location.href : ''),
            });
            handleOpenWhatsapp(cleanNumber, msg);
            whatsappImpretion && whatsappImpretion("whatsapp", NewpropertyData?.id || propertyData?.id);
        }
    };

    const CustomCheckedIcon = (
        <span
            style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1px solid #447158',
                backgroundColor: '#447158',
                boxShadow: 'inset 0 0 0 4px white',
                display: 'inline-block',
            }}
        />
    );

    const CustomRadioIcon = (
        <span
            style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1px solid #737678',
                display: 'inline-block',
            }}
        />
    );

    const [selectedValue, setSelectedValue] = useState(data?.values?.role || 'Buyer/Tenant');
    const [keepInformed, setKeepInformed] = useState(data?.values?.keepInformed || false);
    const [subjectValue, setSubjectValue] = useState(data?.values?.subject || "");

    const handleChange1 = (event) => {
        setSelectedValue(event.target.value);
    };

    const controlProps = (item) => ({
        checked: selectedValue === item,
        onChange: handleChange1,
        value: item,
        name: "role",
        inputProps: { 'aria-label': item },
    });

    // Sync values with form data when it resets
    useEffect(() => {
        if (data?.values?.role !== undefined) {
            setSelectedValue(data.values.role || 'Buyer/Tenant');
        }
        if (data?.values?.keepInformed !== undefined) {
            setKeepInformed(data.values.keepInformed || false);
        }
        if (data?.values?.subject !== undefined) {
            setSubjectValue(data.values.subject || "");
        }
    }, [data?.values?.role, data?.values?.keepInformed, data?.values?.subject]);

    // Show snackbar on form submission success (only when success changes from false/undefined to true)
    useEffect(() => {
        const prevSuccess = prevSuccessRef.current;
        const currentSuccess = data?.success;
        
        // Only show snackbar if success changed from false/undefined to true
        if (currentSuccess === true && prevSuccess !== true && data?.message) {
            setSnackbarError({
                message: data.message,
                color: "success"
            });
            setSnackbarOpen(true);
        }
        
        // Update the ref to track current success state
        prevSuccessRef.current = currentSuccess;
    }, [data?.success, data?.message, setSnackbarError, setSnackbarOpen]);
    return (
        <>
            <div className='agency-contact-card' style={{
                padding: modifyCard ? '24px 16px' : '', position: modifyCard ? 'relative' : '', borderRadius: dontShowInfo ? '8px' : '', background: dontShowInfo ? 'linear-gradient(96deg, rgba(255, 255, 255, 0.70) 0.34%, rgba(255, 255, 255, 0.50) 98.94%)' : '',
                boxShadow: dontShowInfo ? '0 4px 50px 0 rgba(0, 0, 0, 0.35)' : '',
                backdropFilter: dontShowInfo ? 'blur(7.5px)' : '',
                }}>

            {
                modifyCard &&
                <div className="input-section-close-btn  d-flex justify-content-center align-items-center" style={{width:'24px', height:'24px' , cursor:'pointer' , zindex:'9'}}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  onClick={() => modifyCardState(false)} style={{cursor:'pointer'}}>
                        <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                    </svg>
                </div>
            }
            <div className="d-sm-none d-flex flex-row-reverse justify-content-between align-items-center" style={{ borderBottom: '1px solid #bbb', padding: "8px 16px", height: '57px' }}>
                <div className="loan-model-img" style={{ position: 'unset' }}>
                    <svg onClick={() => {
                        if (onClose) {
                            onClose();
                        }
                    }} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_4778_102023)">
                            <path d="M15.9994 7.99982C15.8119 7.81235 15.5576 7.70703 15.2924 7.70703C15.0273 7.70703 14.773 7.81235 14.5854 7.99982L11.9995 10.5858L9.41346 7.99982C9.22486 7.81766 8.97226 7.71687 8.71006 7.71914C8.44786 7.72142 8.19705 7.82659 8.01164 8.012C7.82623 8.19741 7.72107 8.44822 7.71879 8.71042C7.71651 8.97261 7.8173 9.22522 7.99946 9.41382L10.5855 11.9998L7.99946 14.5858C7.8173 14.7744 7.71651 15.027 7.71879 15.2892C7.72107 15.5514 7.82623 15.8022 8.01164 15.9876C8.19705 16.173 8.44786 16.2782 8.71006 16.2805C8.97226 16.2828 9.22486 16.182 9.41346 15.9998L11.9995 13.4138L14.5854 15.9998C14.7741 16.182 15.0267 16.2828 15.2888 16.2805C15.551 16.2782 15.8019 16.173 15.9873 15.9876C16.1727 15.8022 16.2778 15.5514 16.2801 15.2892C16.2824 15.027 16.1816 14.7744 15.9994 14.5858L13.4135 11.9998L15.9994 9.41382C16.1869 9.22629 16.2922 8.97198 16.2922 8.70682C16.2922 8.44165 16.1869 8.18735 15.9994 7.99982Z" fill="#2D2D2D" />
                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                        </g>
                        <defs>
                            <clipPath id="clip0_4778_102023">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>

                <h1 className='loan-model-heading mb-0'>Contact Form</h1>
            </div>
            {
                modifyCard ?
                    <div className="new-contactheader">
                        Email Us

                    </div>
                    : ""
            }
            <div className='property-detail-changes-sectoin' style={{ display: modifyCard ? 'none' : '' }}>
                <div className='detail-chanes-icons d-sm-block d-none'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 6H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 10H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 14H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 18H14" stroke="#447158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h5 className=" d-sm-block d-none">Get in Touch</h5>
                <h6 className=" d-sm-block d-none">We'll respond within 2 hours</h6>
                <div className="agent-card d-sm-none d-block">
                    {
                        (NewpropertyData?.user?.agency || NewpropertyData?.developer) ?
                            "" :
                            <div className="upper-detail-section flex-column">
                                <div className="img-upe-section">
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (NewpropertyData?.user?.id && NewpropertyData?.user?.username) {
                                                navigate(`/agent-profile/${NewpropertyData.user.id}/${NewpropertyData.user.username}`);
                                            }
                                        }}
                                    >
                                        <FallbackImage
                                            className='agent-avatar'
                                            src={NewpropertyData?.user?.avatar}
                                            alt="profile"
                                            pageName="AgentDefault"
                                        />
                                    </div>
                                    <span>
                                        <FallbackImage src={img7} alt='.../' pageName="PropertyDetail" />
                                    </span>
                                </div>

                                <div className="upper-heading-section">
                                    <h4 style={{ textAlign: "center", width: "100%" }}>{NewpropertyData?.user?.name}</h4>

                                    <div className="rating-row">
                                        <span className="star">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path
                                                    d="M7.683 1.53c.03-.06.075-.108.131-.142A.334.334 0 0 1 8 1.333c.066 0 .13.018.186.054.056.035.1.083.13.143l1.54 3.119c.101.205.25.383.436.518.185.135.4.222.626.256l3.444.504c.172.025.3.156.333.326a.47.47 0 0 1-.091.369l-2.49 2.426a1.28 1.28 0 0 0-.357.98l.588 3.427a.34.34 0 0 1-.48.366l-3.078-1.62a1.56 1.56 0 0 0-1.316 0l-3.078 1.62a.34.34 0 0 1-.48-.366l.588-3.426a1.28 1.28 0 0 0-.357-.98L1.44 6.53a.47.47 0 0 1-.091-.369.39.39 0 0 1 .333-.326l3.443-.504c.226-.034.441-.121.626-.256.185-.135.335-.313.436-.518L7.683 1.53Z"
                                                    fill="#FFB900"
                                                    stroke="#FFB900"
                                                    strokeWidth="1.333"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span className="rating-value">{parseInt(NewpropertyData?.user?.average_rating).toFixed(1) || 5}</span>
                                        <span className="rating-count">{NewpropertyData?.user?.ratings_count} Ratings</span>
                                    </div>

                                    {/* <div className="view-profile" type="button"
                            onClick={() => navigate(`/agent-profile/${NewpropertyData?.user?.id}/${NewpropertyData?.user?.username}`)}>View Profile</div> */}
                                </div>
                            </div>
                    }

                    {/* middle: agency card */}
                    {NewpropertyData?.user?.agency && <div className="agency-card" style={{ paddingTop: NewpropertyData?.user?.agency?.agency_profile?.package?.name ? '0' : '0px' }}>
                        <div className="agency-logo-box" >
                            <div
                                className="agency-logo"
                                style={{ marginBottom: '16px', borderRadius: '4px', cursor: 'pointer' }}
                                onClick={() => {
                                    const agencyId = NewpropertyData?.user?.agency?.id ||
                                        NewpropertyData?.user?.agency?.agency_id ||
                                        NewpropertyData?.user?.agency?.agency_profile?.agency_id ||
                                        NewpropertyData?.user?.agency?.agency_profile?.agency_profile_id;
                                    if (agencyId) {
                                        navigate(`/agency-detail/${agencyId}`);
                                    }
                                }}
                            >
                                <FallbackImage src={NewpropertyData?.user?.agency?.agency_profile?.agency_image || img6} alt={NewpropertyData?.user?.agency?.name} pageName="AgencyDefault" />
                            </div>

                        </div>
                        <h3>{NewpropertyData?.user?.agency?.agency_profile?.agency_name || NewpropertyData?.user?.agency?.name}</h3>
                        <p className="agency-role">Agent:{" " + NewpropertyData?.user?.name}</p>
                        <div className="rating-row">
                            <span className="star">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M7.683 1.53c.03-.06.075-.108.131-.142A.334.334 0 0 1 8 1.333c.066 0 .13.018.186.054.056.035.1.083.13.143l1.54 3.119c.101.205.25.383.436.518.185.135.4.222.626.256l3.444.504c.172.025.3.156.333.326a.47.47 0 0 1-.091.369l-2.49 2.426a1.28 1.28 0 0 0-.357.98l.588 3.427a.34.34 0 0 1-.48.366l-3.078-1.62a1.56 1.56 0 0 0-1.316 0l-3.078 1.62a.34.34 0 0 1-.48-.366l.588-3.426a1.28 1.28 0 0 0-.357-.98L1.44 6.53a.47.47 0 0 1-.091-.369.39.39 0 0 1 .333-.326l3.443-.504c.226-.034.441-.121.626-.256.185-.135.335-.313.436-.518L7.683 1.53Z"
                                        fill="#FFB900"
                                        stroke="#FFB900"
                                        strokeWidth="1.333"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span className="rating-value">{parseInt(NewpropertyData?.user?.average_rating).toFixed(1) || 5}</span>
                            <span className="rating-count">{NewpropertyData?.user?.ratings_count} Ratings</span>
                        </div>
                    </div>}

                    {/* middle: developer card */}
                    {NewpropertyData?.developer && <div className="agency-card" style={{ paddingTop: NewpropertyData?.developer?.developer_profile?.package?.name ? '0' : '0px' }}>
                        <div className="agency-logo-box" >
                            <div
                                className="agency-logo"
                                style={{ marginBottom: '16px', borderRadius: '4px', cursor: 'pointer' }}
                                onClick={() => {
                                    const developerId = NewpropertyData?.developer?.id ||
                                        NewpropertyData?.developer?.developer_id ||
                                        NewpropertyData?.developer?.developer_profile?.developer_id ||
                                        NewpropertyData?.developer?.developer_profile?.developer_profile_id;
                                    if (developerId) {
                                        navigate(`/developer-detail/${developerId}`);
                                    }
                                }}
                            >
                                <FallbackImage src={NewpropertyData?.developer?.logo || NewpropertyData?.developer?.logo_url} alt={NewpropertyData?.developer?.name} pageName="AgencyDefault" />
                            </div>

                        </div>
                        <h3>{NewpropertyData?.developer?.developer_profile?.developer_name || NewpropertyData?.developer?.name}</h3>
                    </div>}

                    {/* bottom note */}
                    <div className="respond-note d-sm-block d-none">
                        <h6>Usually responds</h6>
                        <h5>within 2 hours</h5>
                    </div>
                </div>
            </div>
            <div className="special-box">
                <div className="above-portion global-scroll-box">

                    {
                        modifyCard ? "" :
                            <div className="button-box" style={{ justifyContent: justify ? "start" : '' }}>
                                <PrimaryBorderButton
                                    width={true}
                                    height={'32px'}
                                    icon={phone}
                                    text={"Call"}
                                    mediaQuery={mediaQuery}
                                    onFunction={handleCall}
                                />
                                <WhatsAppButton
                                    width={true}
                                    height={'32px'}
                                    icon={whatsapp}
                                    text={"WhatsApp"}
                                    contactNumber={(() => {
                                        if (contactData?.phone_number) {
                                            return contactData.phone_number.replace(/[^0-9]/g, '');
                                        } else if (NewpropertyData?.developer) {
                                            return (NewpropertyData?.phone_number || NewpropertyData?.whatsapp || NewpropertyData?.contacts?.[0] || '').toString().replace(/[^0-9]/g, '');
                                        } else {
                                            return (NewpropertyData?.user?.phone_number || '').toString().replace(/[^0-9]/g, '');
                                        }
                                    })()}
                                    onFunction={handleWhatsAppClick}
                                />
                                {/* <div className="primary-border-button email-button" style={{height:'32px',display:'inline-flex',alignItems:'center',cursor:'pointer'}} onClick={()=>{
        const emailAddr = contactData?.email || '';
        const subject = encodeURIComponent('Property Inquiry');
        const body = encodeURIComponent('Hi, I am interested in your listing on Pakistan-Property. Please provide more details.');
        window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${emailAddr}&su=${subject}&body=${body}&tf=1`, '_blank');
    }}>
        {email}
        <div className="text">Email</div>
    </div> */}
                            </div>
                    }
                    <form className="input-box" action={formAction} id="contact-form">
                        {/* Name */}
                        <span>
                            <div className={data?.errors?.name ? "input error" : "input"}>
                                <input type="text" name="name" placeholder="Name*" disabled={isPending} defaultValue={data.values.name || ""} />
                            </div>
                            {data?.errors?.name && <p className="message">{data.errors.name}</p>}
                        </span>
                        {/* Email */}
                        <span>
                            <div className={data?.errors?.email ? "input error" : "input"}>
                                <input type="email" name="email" placeholder="Email*" disabled={isPending} defaultValue={data.values.email || ""} />
                            </div>
                            {data?.errors?.email && <p className="message">{data.errors.email}</p>}
                        </span>
                        {/* Phone */}
                        <span>
                            <div className={data?.errors?.number ? "phone-input error" : "phone-input"}>
                                <div ref={callingRef} style={{cursor:'not-allowed'}} className="flag">
                                    <FallbackImage src={selectedCode?.flag} alt="flag" componentName="AgencyContactCard" />
                                    <div className="d-flex align-items-center">
                                        {selectedCode?.callingCode}
                                        <IoIosArrowDown
                                            style={{ transform: show ? "rotate(180deg)" : "rotate(0deg)" }}
                                            className="icon ms-1"
                                        />
                                    </div>
                                    {show && (
                                        <div className="option_code">
                                            {callingCode?.map((item, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        setSelectedCode({
                                                            flag: item.flag,
                                                            callingCode: item.callingCode,
                                                        })
                                                    }
                                                    className="d-flex option_value"
                                                >
                                                    <FallbackImage src={item.flag} alt="code" componentName="AgencyContactCard" />
                                                    <span>{item.callingCode}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    className="phone"
                                    type="text"
                                    name="number"
                                    placeholder="**********"
                                    disabled={isPending}
                                    value={phoneValue}
                                    onChange={(e) => {
                                        const formatted = formatPakistaniPhoneNumber(e.target.value);
                                        setPhoneValue(formatted);
                                    }}
                                    maxLength={10}
                                />
                                <input type="hidden" name="callingCode" value={selectedCode?.callingCode || ""} />
                            </div>
                            {data?.errors?.number && <p className="message">{data.errors.number}</p>}
                        </span>
                        {/* Subject */}
                        {
                            subject ?
                                <span>
                                    <div className={data?.errors?.subject ? "input error" : "input"}>
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder={modifyCard ? "Subject" : "Subject*"}
                                            disabled={isPending}
                                            value={subjectValue}
                                            onChange={(e) => setSubjectValue(e.target.value)}
                                        />
                                    </div>
                                    {data?.errors?.subject && <p className="message">{data.errors.subject}</p>}
                                </span>
                                : ""
                        }
                        {/* Message */}
                        <span>
                            <div className={data?.errors?.message ? "text-area-input error" : "text-area-input"}>
                                <textarea name="message" placeholder="Message*" rows={5} disabled={isPending} defaultValue={data.values.message || ""} />
                            </div>
                            {data?.errors?.message && <p className="message">{data.errors.message}</p>}
                        </span>
                        {/* Terms note */}
                        {
                            subject ?
                                <div className="text">
                                    By submitting this form, you confirm that the information provided is accurate and that you
                                    agree to our <span>Terms & Conditions</span> and <span>Privacy Policy</span>.
                                </div>
                                : ''
                        }
                        {/* Radio Button */}
                        {
                            radio ?
                                <>


                                    <div className="checkbox-group" style={{ paddingBottom: "0px" }}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={keepInformed}
                                                onChange={(e) => setKeepInformed(e.target.checked)}
                                                value="true"
                                                name="keepInformed"
                                            />
                                            Keep me informed about similar properties
                                        </label>
                                    </div>
                                    <div className="radio-group mt-0">
                                        <div className="radio-gol d-flex align-items-start ">
                                            <div className="radio-pera">
                                                <p className='mb-0'>I am a:</p>
                                            </div>

                                            <div className="d-flex align-items-center flex-wrap" style={{ gap: "5px" }}>
                                                <div style={{ gap: "5px", display: "flex", alignItems: 'center' }}>
                                                    <Radio
                                                        {...controlProps('Buyer/Tenant')}
                                                        sx={{ padding: "1px" }}
                                                        icon={CustomRadioIcon}
                                                        checkedIcon={CustomCheckedIcon}
                                                    />
                                                    <label>Buyer/Tenant</label>
                                                </div>

                                                <div style={{ gap: "5px", display: "flex", alignItems: 'center' }}>
                                                    <Radio
                                                        {...controlProps('Agent')}
                                                        sx={{ padding: "1px" }}
                                                        icon={CustomRadioIcon}
                                                        checkedIcon={CustomCheckedIcon}
                                                    />
                                                    <label>Agent</label>
                                                </div>

                                                <div style={{ gap: "5px", display: "flex", alignItems: 'center' }}>
                                                    <Radio
                                                        {...controlProps('other')}
                                                        sx={{ padding: "1px" }}
                                                        icon={CustomRadioIcon}
                                                        checkedIcon={CustomCheckedIcon}
                                                    />
                                                    <label>Other</label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* Hidden input to submit role value */}
                                    <input type="hidden" name="role" value={selectedValue} />
                                </>
                                : ""
                        }
                        {/* Submit button */}
                        <button type="submit" disabled={isPending} className='d-sm-block d-none' style={{ position: 'relative' }}>
                            <PrimaryButton icon={isPending ? '' : email} text={
                                isPending ?
                                    <div className="spinner-border spinner-border-sm text-light" role="status" />
                                    :
                                    "Email"
                            } width={true} />
                        </button>
                    </form>
                </div >
            </div>
            {/* <div className="middle-logo">{middleLogo}</div>
                <div className="large-logo" style={{ right: image ? "28%" : '' }}>{largeLogo}</div>
                <div className="small-logo">{smallLogo}</div> */}
            <div className="button d-sm-none d-block">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={(e) => {
                        e.preventDefault();
                        const form = document.getElementById('contact-form');
                        if (form) {
                            const formData = new FormData(form);
                            formAction(formData);
                        }
                    }}
                >
                    <PrimaryButton icon={isPending ? '' : email} text={
                        isPending ?
                            <div className="spinner-border spinner-border-sm text-light" role="status" />
                            :
                            "Email"
                    } width={true} />
                </button>
            </div>
        </div >
        {
            dontShowInfo? "":
                <div className="contact-information d-lg-block d-none">
                    <div className="contact-title-1">Contact Information</div>
                    <div className="tab-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.6693 8.33366C16.6693 12.4945 12.0534 16.8278 10.5034 18.1662C10.359 18.2747 10.1833 18.3335 10.0026 18.3335C9.82194 18.3335 9.64617 18.2747 9.50177 18.1662C7.95177 16.8278 3.33594 12.4945 3.33594 8.33366C3.33594 6.56555 4.03832 4.86986 5.28856 3.61961C6.5388 2.36937 8.23449 1.66699 10.0026 1.66699C11.7707 1.66699 13.4664 2.36937 14.7166 3.61961C15.9669 4.86986 16.6693 6.56555 16.6693 8.33366Z" stroke="#447158" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 10.833C11.3807 10.833 12.5 9.71372 12.5 8.33301C12.5 6.9523 11.3807 5.83301 10 5.83301C8.61929 5.83301 7.5 6.9523 7.5 8.33301C7.5 9.71372 8.61929 10.833 10 10.833Z" stroke="#447158" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-box">
                            <CustomTooltip title={`${contactData?.address}`} placement="left">
                                <div className='text-title'>Address</div>
                                <div className="text-para" >{contactData?.address}</div>
                            </CustomTooltip>
                        </div>
                    </div>
                    <div className="tab-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g clipPath="url(#clip0_8027_298519)">
                                <path d="M11.5241 13.807C11.6962 13.886 11.8901 13.9041 12.0738 13.8582C12.2575 13.8123 12.4202 13.7052 12.5349 13.5545L12.8307 13.167C12.986 12.96 13.1873 12.792 13.4187 12.6763C13.6501 12.5606 13.9053 12.5003 14.1641 12.5003H16.6641C17.1061 12.5003 17.53 12.6759 17.8426 12.9885C18.1551 13.301 18.3307 13.725 18.3307 14.167V16.667C18.3307 17.109 18.1551 17.5329 17.8426 17.8455C17.53 18.1581 17.1061 18.3337 16.6641 18.3337C12.6858 18.3337 8.87051 16.7533 6.05746 13.9403C3.24442 11.1272 1.66406 7.31191 1.66406 3.33366C1.66406 2.89163 1.83966 2.46771 2.15222 2.15515C2.46478 1.84259 2.8887 1.66699 3.33073 1.66699H5.83073C6.27276 1.66699 6.69668 1.84259 7.00924 2.15515C7.3218 2.46771 7.4974 2.89163 7.4974 3.33366V5.83366C7.4974 6.0924 7.43715 6.34759 7.32144 6.57901C7.20573 6.81044 7.03772 7.01175 6.83073 7.16699L6.44073 7.45949C6.28774 7.57631 6.17991 7.74248 6.13555 7.92978C6.0912 8.11709 6.11305 8.31397 6.1974 8.48699C7.3363 10.8002 9.20942 12.671 11.5241 13.807Z" stroke="#447158" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_8027_298519">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <div className="text-box">
                            <CustomTooltip title={contactData?.phone_number?.startsWith('+') ? contactData?.phone_number : `+${contactData?.phone_number}`} placement="left">
                                <div className='text-title'>Phone</div>
                                <div className="text-para">{contactData?.phone_number?.startsWith('+') ? contactData?.phone_number : `+${contactData?.phone_number}`}</div>

                            </CustomTooltip>
                        </div>
                    </div>
                    <div className="tab-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M18.3307 5.83301L10.8382 10.6055C10.584 10.7532 10.2952 10.831 10.0011 10.831C9.70712 10.831 9.41832 10.7532 9.16406 10.6055L1.66406 5.83301" stroke="#447158" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.6641 3.33301H3.33073C2.41025 3.33301 1.66406 4.0792 1.66406 4.99967V14.9997C1.66406 15.9201 2.41025 16.6663 3.33073 16.6663H16.6641C17.5845 16.6663 18.3307 15.9201 18.3307 14.9997V4.99967C18.3307 4.0792 17.5845 3.33301 16.6641 3.33301Z" stroke="#447158" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-box">
                            <CustomTooltip title={`${contactData?.email}`} placement="left">
                                <div className='text-title'>Email</div>
                                <div className="text-para email">{contactData?.email}</div>
                            </CustomTooltip>
                        </div>
                    </div>
                </div>
        }
            < CallModal
    open = { callModalOpen }
    setOpen = { setCallModalOpen }
    contact = {(() => {
        if (NewpropertyData?.developer?.whatsapp) {
            return [NewpropertyData?.developer?.whatsapp];
        }
        if (contactData?.phone_number) {
            return [contactData.phone_number];
        } else if (NewpropertyData?.developer) {
            if (Array.isArray(NewpropertyData?.contacts)) {
                return NewpropertyData.contacts;
            } else if (NewpropertyData?.phone_number) {
                return [NewpropertyData.phone_number];
            } else {
                return [];
            }
        }
        else if (NewpropertyData?.developer?.whatsapp) {
            return [NewpropertyData?.developer?.whatsapp];
        } else {
            return NewpropertyData?.user?.phone_number ? [NewpropertyData?.user?.phone_number] : [];
        }
    })()
}
propertyId = { NewpropertyData?.id || propertyData?.id}
            />
        </>
    )
}

export default AgencyContactCard
