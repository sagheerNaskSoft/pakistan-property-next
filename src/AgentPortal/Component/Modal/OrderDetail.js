import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import { AiFillCloseCircle } from 'react-icons/ai';
import { RiAttachment2 } from 'react-icons/ri';
import { Box } from '@mui/material';
import { useAuth } from '../../../Context/ContextProvider';
import { MdRemoveShoppingCart } from 'react-icons/md';
import PrimaryButton from '../../../Component/Metiral/Button/PrimaryButton';
import PrimaryBorderButton from '../../../Component/Metiral/Button/PrimaryBorderButton';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    // boxShadow: 24,
    // borderRadius: "8px",
};
function OrderDetail({ orderData, open, fetchData, order_status, setOpen, handleOpen, open1, setOpen1, orderId, cartData, orderStatus, order_code, order_created_at }) {
    const handleClose = () => {
        setOpen(false)
        setViewBank(false)
    };
    const handleClose1 = () => setOpen1(false);
    const { updateOrder, loading, formatPriceWithCommas, bankDetail } = useAuth()
    const [fileName, setFileName] = useState("")
    const [data, setData] = useState({
        image: "",
    })
    const [fieldErrors, setFieldErrors] = React.useState({})
    const validateStep = () => {
        let errors = {

        };
        if (!data.image) {
            errors.image = "Image is required.";
        }


        setFieldErrors(errors);
        // Check if there are any errors
        return Object.keys(errors).length === 0;
    };
    const submit = async () => {
        if (validateStep()) {
            let result = await updateOrder(data)
            if (result?.success) {
                fetchData();
                handleClose()
                handleClose1()
                setData({
                    image: "",
                })
                setFileName("")
            }
        }

    }
    const handleFileChange = (event) => {
        let file = event.target.files[0]
        setFileName(file?.name || "");
        setData({ ...data, image: file, orderId });

    }
    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending for Approval':
                return 'status-approval';
            case 'Saved':
                return 'status-saved';
            case 'Approved':
                return 'status-approved';
            case 'Rejected':
                return 'status-rejected';

            default:
                return '';
        }
    };
    const [accounts, setAccounts] = useState([])
    useEffect(() => {



        const fetchCart1 = async () => {
            try {
                let result = await bankDetail();
                if (result?.success) {
                    setAccounts(result?.data?.data?.accounts)

                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchCart1()
        // eslint-disable-next-line
    }, []);
    const [viewBank, setViewBank] = useState(false)

    const date = new Date(order_created_at);
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    console.log(orderData, "cartData")

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    className: 'global-modal-background-color'
                }}
            >
                <Box className='order_view_modal global-modal-base-color' sx={style}>
                    <div className='modal_feature payment_modal '>
                        <div className="global-modal-paddingBox">
                            <div className="global-mobile-menu-header">

                                <h4 className='heading'>Payment Confirmation</h4>
                                <div className="close-button" onClick={handleClose} style={{ position: window.innerWidth <= 576 ? "unset" : "" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clipPath="url(#clip0_1586_5094)">
                                            <path d="M15.9999 7.99982C15.8124 7.81235 15.5581 7.70703 15.2929 7.70703C15.0278 7.70703 14.7735 7.81235 14.5859 7.99982L11.9999 10.5858L9.41395 7.99982C9.22534 7.81766 8.97274 7.71687 8.71055 7.71914C8.44835 7.72142 8.19754 7.82659 8.01213 8.012C7.82672 8.19741 7.72155 8.44822 7.71928 8.71042C7.717 8.97261 7.81779 9.22522 7.99995 9.41382L10.5859 11.9998L7.99995 14.5858C7.81779 14.7744 7.717 15.027 7.71928 15.2892C7.72155 15.5514 7.82672 15.8022 8.01213 15.9876C8.19754 16.173 8.44835 16.2782 8.71055 16.2805C8.97274 16.2828 9.22534 16.182 9.41395 15.9998L11.9999 13.4138L14.5859 15.9998C14.7745 16.182 15.0271 16.2828 15.2893 16.2805C15.5515 16.2782 15.8023 16.173 15.9878 15.9876C16.1732 15.8022 16.2783 15.5514 16.2806 15.2892C16.2829 15.027 16.1821 14.7744 15.9999 14.5858L13.4139 11.9998L15.9999 9.41382C16.1874 9.22629 16.2927 8.97198 16.2927 8.70682C16.2927 8.44165 16.1874 8.18735 15.9999 7.99982Z" fill="#2D2D2D" />
                                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1586_5094">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>


                            <div style={{ padding: window.innerWidth <= 576 ? "12px 16px 20px" : "" }}>
                                {viewBank && <div className='bank_detail_main scroll-box-y'>
                                    {accounts?.map((item) => {
                                        return (
                                            <>
                                                <div className='account_detail mt-2'>
                                                    <div className='title d-flex justify-content-between align-items-center mb-3'>
                                                        <div className='bank_img'>
                                                            <img style={{ width: "32px" }} src={item?.logo} alt='bank' />

                                                        </div>
                                                        <div className='mx-2'>
                                                            <h6 className='m-0'>{item?.name}</h6>

                                                        </div>
                                                    </div>

                                                    <div className='d-flex detail_box justify-content-between align-items-center'>
                                                        <div>
                                                            <h6 className='m-0 p-0'>Account Title</h6>

                                                        </div>
                                                        <div>
                                                            <p className='m-0 p-0'>{item?.account_title}</p>

                                                        </div>
                                                    </div>
                                                    <div className='d-flex detail_box justify-content-between align-items-center'>
                                                        <div>
                                                            <h6 className='m-0 p-0'>Account No.</h6>

                                                        </div>
                                                        <div>
                                                            <p className='m-0 p-0'>{item?.account_number}</p>

                                                        </div>
                                                    </div>
                                                    <div className='d-flex detail_box justify-content-between align-items-center'>
                                                        <div>
                                                            <h6 className='m-0 p-0'>IBAN</h6>

                                                        </div>
                                                        <div>
                                                            <p className='m-0 p-0'>{item?.iban}</p>

                                                        </div>
                                                    </div>

                                                </div>

                                            </>
                                        )
                                    })}

                                </div>}
                                <h6 className='p-0 m-0'>Submit your payment receipt to complete your order.
                                </h6>
                                <p className='pera_text p-0 m-0 my-2'>Once submitted and verified by the administration, your order will be successfully processed, and you will receive your ordered products.</p>
                                <div className='inp_login'>
                                    <div className='d-flex justify-content-between p-0 align-items-center'>
                                        <label>Attach File</label>
                                        <button style={{ background: "none", border: "none", color: "#1b573e", fontSize: "14px", textDecoration: "underline" }} onClick={() => setViewBank(!viewBank)}>{viewBank ? "Hide" : "View"} Bank Details</button>
                                    </div>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <input onChange={handleFileChange} id='receipt' accept=".png,.jpeg,.jpg,.webp" type="file" hidden />
                                        <input value={fileName} onClick={() => document.getElementById('receipt').click()} readOnly type="text" placeholder='Attach File' />
                                        <RiAttachment2 style={{ position: "absolute", left: "15px", top: "21px", fontSize: "14px" }} />
                                        <label className='attach_lable' style={{ position: "absolute", right: "4px", top: "13.5px" }} >
                                            Attach File
                                        </label>
                                    </div>
                                    {fieldErrors?.image && <span className='global-error_message'>{fieldErrors?.image}</span>}
                                </div>
                            </div>
                        </div>
                        <div className='model_footer d-flex justify-content-end global-modal-footer mt-3 global-footer-button-box'>
                            <PrimaryBorderButton onFunction={handleClose} text="Cancel" />
                            <PrimaryButton onFunction={submit} text={loading ? <div className="spinner-border text-light button_loading" role="status">

                            </div> : "Submit"} />

                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    className: 'global-modal-background-color'
                }}
            >
                <Box className='order_view_modal global-modal-base-color' sx={style}>
                    <div className='modal_feature payment_modal add_propertey_main '>

                        <div className="global-mobile-menu-header">
                            <h4 className='heading d-sm-none d-flex'>Order ID: {order_code}</h4>
                            <div className="close-button" style={{ position: window.innerWidth <= 576 ? "unset" : "" }} onClick={handleClose1}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_1586_5094)">
                                        <path d="M15.9999 7.99982C15.8124 7.81235 15.5581 7.70703 15.2929 7.70703C15.0278 7.70703 14.7735 7.81235 14.5859 7.99982L11.9999 10.5858L9.41395 7.99982C9.22534 7.81766 8.97274 7.71687 8.71055 7.71914C8.44835 7.72142 8.19754 7.82659 8.01213 8.012C7.82672 8.19741 7.72155 8.44822 7.71928 8.71042C7.717 8.97261 7.81779 9.22522 7.99995 9.41382L10.5859 11.9998L7.99995 14.5858C7.81779 14.7744 7.717 15.027 7.71928 15.2892C7.72155 15.5514 7.82672 15.8022 8.01213 15.9876C8.19754 16.173 8.44835 16.2782 8.71055 16.2805C8.97274 16.2828 9.22534 16.182 9.41395 15.9998L11.9999 13.4138L14.5859 15.9998C14.7745 16.182 15.0271 16.2828 15.2893 16.2805C15.5515 16.2782 15.8023 16.173 15.9878 15.9876C16.1732 15.8022 16.2783 15.5514 16.2806 15.2892C16.2829 15.027 16.1821 14.7744 15.9999 14.5858L13.4139 11.9998L15.9999 9.41382C16.1874 9.22629 16.2927 8.97198 16.2927 8.70682C16.2927 8.44165 16.1874 8.18735 15.9999 7.99982Z" fill="#2D2D2D" />
                                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1586_5094">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                        <div className="global-modal-paddingBox" style={{ paddingBottom: order_status == "saved" ? "" : "24px", padding: window.innerWidth <= 576 ? "12px 16px 20px" : "" }}>
                            <h4 className='heading d-sm-flex d-none'>Order ID: {order_code}</h4>
                            <div className='d-flex justify-content-between header_date mt-3 mb-2'><span><div className="bold">Date Time:</div> {formattedDate}, {formattedTime}</span> <div className='d-flex align-items-center' style={{ gap: "4px" }}><span><div className="bold">Order Status:</div></span> <span className={`${getStatusClass(orderStatus)} status status-css`}>{orderStatus}</span></div> </div>
                            <hr className='p-0 m-0' />
                            <div style={{ border: "none" }} className='locationPurpos order_summery py-0 '>
                                {cartData?.length ? <>
                                    <div className='cart_item pb-3 d-flex flex-column' style={{ gap: "12px" }}>
                                        {cartData?.length ? <>
                                            {cartData?.map((item) => {
                                                return (
                                                    <div className='d-flex justify-content-between align-items-center cart_list' >
                                                        {item?.product?.name === "Listing" ? <><span>{item?.product?.name} ({item?.quantity}X)</span><span>Rs {formatPriceWithCommas(item?.total_price)}</span></> : <>
                                                            <div>
                                                                <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                                                                    <span>{item?.product?.name}</span>
                                                                    <p style={{ padding: "0", margin: "0", fontSize: "11px" }}>{item?.name?.replace("Listing", "Credits")} <span>({item?.quantity}X)</span></p>
                                                                </div>
                                                                {
                                                                    item?.product?.type !== "credits" ? <p style={{ padding: "0", fontSize: "11px" }}>{"Listing"} <span>({item?.quantity}X)</span></p> : ""
                                                                }

                                                            </div>
                                                            <span>Rs {formatPriceWithCommas(item?.total_price)}</span>
                                                        </>}
                                                    </div>
                                                )
                                            })}</> : ""}
                                        {/* {cartData1?.length ? <>
                 
                                {cartData1?.map((item) => {
                                    return (
                                        <div className='d-flex justify-content-between'>
                                            <span>{item?.name} ({item?.quantity})</span><span>Rs {formatPriceWithCommas(item?.price)}</span>
                                        </div>
                                    )
                                })}
                            </> : ""} */}
                                    </div>
                                    <hr className='p-0 m-0 mt-2' />
                                    <div className='d-flex justify-content-between align-items-center total m-0 p-0'>
                                        <h6>Total</h6><h6 style={{ lineHeight: "0" }}>Rs {formatPriceWithCommas(orderData?.total_price)}</h6>
                                    </div>
                                </>
                                    : <div className='no_cart'>
                                        <MdRemoveShoppingCart className='icon' />
                                        <span className='mt-3'>No Item(s) in Cart</span>
                                        <span>Rs 00</span>
                                    </div>}
                            </div>

                        </div>                        {/* <hr className='p-0 m-0' /> */}

                        {order_status === "Saved" && <div className='model_footer d-flex justify-content-end mt-3 global-modal-footer global-footer-button-box'>
                            <PrimaryBorderButton onFunction={handleClose1} text="Cancel" />
                            <PrimaryButton onFunction={handleOpen} text={loading ? <div className="spinner-border text-light button_loading" role="status">
                            </div> : "Pay Now"} role="status" />

                        </div>}
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default OrderDetail