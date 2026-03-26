import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import PayNowModal from '../Component/Modal/PayNowModal';

function CheckOut() {
    const { addToCart, loading, payLaterOrder, bankDetail, getCart, formatPriceWithCommas } =
        useAuth();
    const [allcartData, setallCartData] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const fetchCart = async () => {
        try {
            let result = await getCart();
            if (result?.success) {
                setallCartData(
                    result?.data?.data?.cart?.products
                        ? result?.data?.data?.cart?.products
                        : []
                );
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };
    const fetchCart1 = async () => {
        try {
            let result = await bankDetail();
            if (result?.success) {
                setAccounts(result?.data?.data?.accounts);
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };
    useEffect(() => {
        fetchCart()
        fetchCart1()
    }, [])
    const navigate = useNavigate()
    const subTotal = (data) => {
        
        let amount = 0
        data?.map((item) => {
            if(item.product_name){
                amount = amount + item.product_price
            }else if(item.package_name){
                let total = item.product_quantity * (item.price)
                amount = amount + total
            }
        })
        return amount
    }
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <div className='propshop-main h-100 portal-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>Bank Transfer</h3>
                    <p className='portal-breadCrums m-0'>Home - <span>Checkout</span></p>

                </div>

            </div>
            <div className='propshop_mian row mx-0 mt-3' style={{ gap: "20px 0" }}>
                <div className='col-xl-8 col-lg-7 ps-0 pe-xl-3 pe-lg-2 pe-0 h-lg-100'>
                    <div className='content checkout'>
                        <h6>Please make your payment at any of the banks listed below</h6>
                        {accounts?.map((item) => {
                            return (
                                <div className="account_detail">
                                    <div className="title d-flex align-items-center mb-3">
                                        <div className="bank_img">
                                            <img style={{ width: "32px" }} src={item?.logo} alt="bank" />
                                        </div>
                                        <div className="mx-2">
                                            <h6 className="m-0">{item?.name}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex detail_box align-items-center">
                                        <div style={{ width: "150px" }}>
                                            <h6 className="m-0 p-0">Account Title</h6>
                                        </div>
                                        <div>
                                            <p className="m-0 p-0">{item?.account_title}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex detail_box align-items-center">
                                        <div style={{ width: "150px" }}>
                                            <h6 className="m-0 p-0">Account No.</h6>
                                        </div>
                                        <div>
                                            <p className="m-0 p-0">{item?.account_number}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex detail_box align-items-center">
                                        <div style={{ width: "150px" }}>
                                            <h6 className="m-0 p-0">IBAN</h6>
                                        </div>
                                        <div>
                                            <p className="m-0 p-0">{item?.iban}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
                <div className='col-xl-4 col-lg-5 pe-0 ps-xl-3 ps-lg-2 ps-0 h-lg-100'>
                    <div className='content checkout'>
                        <h4>Order Summary</h4>
                        <div className='cart_list_main'>
                            {allcartData?.map((item) => {
                                return (
                                    <div
                                        className="w-100 cart_data_item"
                                        key={item?.id}
                                    >
                                        <div style={{ gap: "20px" }} className="data_pro d-flex align-items-center justify-content-between flex-wrap">


                                            {item?.product_name?<h6 className="p-0 m-0">
                                                {item?.product_name}
                                            </h6>:""}
                                            {item?.package_name?<h6 className="p-0 m-0">
                                                {item?.package_name}<span style={{fontSize: "12px",color: "#666",marginLeft: "4px"}}>({item?.product_quantity}X)</span>
                                            </h6>:""}
                                            <div className='price text-align-right'>Rs, {formatPriceWithCommas(item?.product_price || item?.price)}</div>

                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                        <hr className='m-0' />
                        <div className='sub_total'>
                            <h5>Subtotal</h5>
                            <h5>Rs, {formatPriceWithCommas(subTotal(allcartData))}</h5>
                        </div>
                        <div className="d-lg-block d-flex" style={{ gap: "0 12px" }}>
                            <div onClick={async () => {

                                handleOpen()
                            }} className='checkout_btn justify-content-center'>
                                <h6 className='m-0'>Pay Now</h6>
                            </div>
                            <div onClick={async () => {

                                let result = await payLaterOrder();
                                if (result?.success) {
                                    navigate("/agent-portal/order-history");
                                }
                            }} className='checkout_btn pay_later justify-content-center mt-lg-2'>
                                <h6 className='m-0'>Pay later</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PayNowModal open={open} setOpen={setOpen} />
        </div>
    )
}

export default CheckOut