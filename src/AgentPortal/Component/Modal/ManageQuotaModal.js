import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SingleInput from '../Inputs/SingleInput';
import { useAuth } from '../../../Context/ContextProvider';
import { FaMinus, FaPlus } from 'react-icons/fa';
import PrimaryBorderButton from '../../../Component/Metiral/Button/PrimaryBorderButton';
import PrimaryButton from '../../../Component/Metiral/Button/PrimaryButton';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1190,


};
function ManageQuotaModal({ open, setOpen, data, setData }) {
    const { getProductList, button_loading, getQoutaState, manageQuota } = useAuth()
    const [products, setProducts] = useState([])
    const [qoutaData, setQuotaData] = useState([])
    const [productLogs, setproductLogs] = useState([]);
    const handleClose = () => {
        setOpen(false)
        setQuotaData([])
    }
    useEffect(() => {

        const fetchqouta = async () => {
            try {
                let result = await getQoutaState();

                if (result?.success) {
                    setproductLogs(result?.data?.data?.offer_logs);
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        const fetchProduct = async () => {
            try {
                let result = await getProductList();
                if (result?.success) {
                    let product = result?.data?.data?.products;
                    const listingsHeaders = product.filter(
                        (header) => header.type === "listings"
                    );
                    const creditsHeaders = product.filter(
                        (header) => header.type === "credits"
                    );
                    setProducts([...listingsHeaders, ...creditsHeaders])



                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchProduct();
        fetchqouta();
        // eslint-disable-next-line
    }, []);

    const handleSubmit = async () => {
        let result = await manageQuota({
            agentId: data?.id,
            data: qoutaData
        });
        if (result?.success) {

            handleClose()

        }
    }

    const handleDecreaseQuantity = (product) => {

        setQuotaData((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.offer_id === product.offer_id
            );

            if (!existingItem) return prevCart; // agar product cart me nahi hai

            // agar quantity 1 se zyada hai → kam karo
            if (existingItem?.quantity > 1) {
                // productLogs me same offer_id wala item dhoondo
                let updatedLogs = productLogs?.map((logItem) => {
                    if (logItem?.offer_id === product?.offer_id) {
                        return {
                            ...logItem,
                            available: logItem.available + 1, // available + 1
                        };
                    }
                    return logItem;
                });

                // agar chaho to state me set bhi kar sakte ho
                setproductLogs(updatedLogs);
                return prevCart.map((item) =>
                    item.offer_id === product.offer_id
                        ? {
                            ...item,
                            quantity: item.quantity - 1,

                        }
                        : item
                );
            }

            // agar quantity 1 thi ya 0 ho gayi → cart se hata do
            return prevCart.filter((item) => item.offer_id !== product.offer_id);
        });
    };
    const handleAddQuantity = (product) => {

        setQuotaData((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.offer_id === product.offer_id
            );
            let updatedLogs = productLogs?.map((logItem) => {
                if (logItem?.offer_id === product?.offer_id) {
                    return {
                        ...logItem,
                        available: logItem.available - 1, // available + 1
                    };
                }
                return logItem;
            });

            // agar chaho to state me set bhi kar sakte ho
            setproductLogs(updatedLogs);
            if (existingItem) {

                return prevCart.map((item) =>
                    item.offer_id === product.offer_id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                );
            } else {
                // agar cart me nai hai to naya add karo
                return [
                    ...prevCart,
                    {
                        offer_id: product.offer_id,
                        quantity: 1,

                    },
                ];
            }

        });
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{
                className: 'global-modal-background-color'
              }}
        >
            <Box sx={style} className='manage_quota_modal'>
                <div className='modal_main qouta_credit global-modal-base-color'>
                    <div className='padding'>
                        <div className='modal_header d-flex justify-content-between align-items-center global-mobile-menu-header'>
                            <div style={{ width: window.innerWidth >= 576 ? "95%" : "fit-content" }}>
                                <h6 className='modal_headig text-center heading' style={{marginBottom:window.innerWidth <= 576 ? "0" : "34px"}}>Manage Quota for {data?.name}</h6>

                            </div>
                            <button onClick={handleClose} className='close_btn_header' style={{position: window.innerWidth <= 576 ? "unset" : ""}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_1163_6568)">
                                        <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1163_6568">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                       <div className="special-modal-padding">
                       <h5 className='mb-0 mt-lg-0 mt-3 title-heading'>Available Quota of Agency</h5>
                        <div style={{ marginBottom: "20px" }} className='listing-header'>
                            {products.map((product) => {
                                const log = productLogs?.find(
                                    (log) => log.offer_slug === product.offer_slug
                                );
                                return (
                                    <div className={`card_quota ${product?.offer_slug}`}>
                                        <div className='d-flex justify-content-between w-100 align-items-center'>
                                            <img src={product?.image} alt='...' />
                                            <h5 className='m-0 total'>{log?.total || 0}</h5>
                                        </div>
                                        <div className='w-100'>
                                            <h5 className='productName'>{product?.name}</h5>
                                            <div className='data_qouta d-flex justify-content-between w-100 align-items-center'>
                                                <div className='border_gr d-flex justify-content-between w-50 align-items-center pe-md-2' style={{gap:"10px"}}>
                                                    <h5>Available</h5>
                                                    <h6>{log?.available || 0}</h6>
                                                </div>
                                                <div className='d-flex justify-content-between w-50 align-items-center ps-md2' style={{gap:"10px"}}>
                                                    <h5>Used</h5>
                                                    <h6>{log?.used || 0}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <h5 className='mb-0 title-heading'>Quota Assigned to {data?.name}</h5>
                        <div className='manage_section'>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: "560px" }}>Current Listings</th>
                                        <th>Add Quota</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {products?.map((item) => {
                                        let qouta = qoutaData?.find((items) => {
                                            if (items?.offer_id === item?.offer_id) {
                                                return items
                                            }
                                        })
                                        return (
                                            <tr >
                                                <td>
                                                    <h6 className='mb-0' style={{ marginTop: "16px" }}>{item?.name}</h6>
                                                    <p className='mb-0'>{qouta?.quantity ? (qouta?.quantity > 9 ? qouta?.quantity : "0" + qouta?.quantity) : "00"}</p>
                                                </td>
                                                <td>
                                                    <div className='btn-container'>
                                                        <button onClick={() => handleDecreaseQuantity({
                                                            offer_id: item?.offer_id,
                                                        })} disabled={qouta?.quantity && qouta?.quantity > 0 ? false : true} className={qouta?.quantity && qouta?.quantity > 0 ? "active" : ""}>
                                                            <FaMinus className='m-0 p-0' />
                                                        </button>
                                                        <input readOnly value={qouta?.quantity ? qouta?.quantity : "0"} />
                                                        <button onClick={() => handleAddQuantity({
                                                            offer_id: item?.offer_id,
                                                        })} className='active'>
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>

                        </div>
                       </div>
                    </div>

                    <div className='modal_footer global-footer-button-box'>
                        <PrimaryBorderButton text="Cancel" onFunction={handleClose} />
<PrimaryButton text={button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status">
                        </div> : "Apply"} onFunction={handleSubmit} />
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default ManageQuotaModal