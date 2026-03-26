import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/ContextProvider'
// import OrderDetail from './OrderDetail';
import { PiEyeLight } from 'react-icons/pi';
import OrderDetail from '../Component/Modal/OrderDetail';
import CustomTooltip from '../../Component/Metiral/CustomTooltip';
import Pagination from '../Component/Pagination/Pagination';
import { BsThreeDotsVertical } from 'react-icons/bs'
function OrderHistory() {
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        total_pages: 1,
        perPage: 10,
        total_items: 0,
    })
    const [orderList, setOrderLIst] = useState([])
    const [openDropdown, setOpenDropdown] = useState(null)
    const [orderStatus, setOrderStatus] = useState()
    const [orderData, setOrderData] = useState({
        orderCode: '',
        products: [],
        orderID: "",
        order_status: "",
        orderDateTime: ""
    })
    const { getOrderLIst, loading } = useAuth()
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [open1, setOpen1] = React.useState(false);
    const handleOpen1 = () => setOpen1(true);
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
    const fetchData = async (paginationDataParam) => {
        try {
            // Use provided pagination data or current state
            const paginationToUse = paginationDataParam || paginationData;
            let result = await getOrderLIst(paginationToUse);
            if (result?.success) {
                setOrderLIst(result?.data?.data?.orders?.data || []);
                if (result?.data?.data?.orders) {
                    const ordersData = result?.data?.data?.orders;
                    setPaginationData({
                        ...paginationToUse,
                        total_pages: ordersData?.last_page || ordersData?.total_pages || 1,
                        current_page: ordersData?.current_page || 1,
                        total_items: ordersData?.total || 0,
                    });
                }
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData(paginationData);
        // eslint-disable-next-line
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown_menu") && !e.target.closest(".icon")) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='propshop-main h-100 portal-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>Order History</h3>
                    <p className='portal-breadCrums m-0'>Home - <span>Order History</span></p>

                </div>

            </div>
            <div className='qouta-table-main order-table-main property-listing'>
                <div className="table_box_quota table_box" style={{ position: "relative", maxHeight: "unset", height: '100%' }}>
                    <table className='w-100' style={{ minWidth: "1200px" }}>
                        <thead>
                            <tr>
                                <th className='d-sm-none'>Actions</th>
                                <th>Order ID</th>
                                <th>Products</th>
                                <th>Date & Time</th>
                                <th>Order Status</th>
                                <th>Price (PKR)</th>
                                <th className='action-head-global'>Actions</th>
                            </tr>
                        </thead>
                        {loading ?
                            <tbody>
                                <tr>
                                    <td colSpan={6}>
                                        <div className='placeholder-glow'>
                                            <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                            <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                            <div className='placeholder w-100 mb-2' style={{ height: "60px" }} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                            : <tbody>{orderList?.length === 0 ? <tr><td colSpan='6' className='text-center'>No Record Found</td></tr> : orderList?.map((item, i) => {
                                const date = new Date(item?.created_at);
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
                                return (
                                    <tr>
                                        <td className={i % 2 !== 0 ? "active d-sm-none" : "d-sm-none"} style={{ width: '48px', minWidth: '48px' }}>

                                            <div className='action_buttons d-flex align-items-center' style={{ position: 'relative' }}>
                                                <button onClick={() => setOpenDropdown(item?.id)}>
                                                    <BsThreeDotsVertical className='icon' />
                                                </button>
                                                {openDropdown === item?.id &&
                                                    <div
                                                        className='dropdown_menu' style={{ left: '0', right: '0' }}>
                                                        <ul className='w-100 mb-0'>
                                                            {item?.order_status?.name === "Saved" && (
                                                                <li onClick={() => {
                                                                    handleOpen()
                                                                    setOrderData({
                                                                        orderCode: item?.order_code,
                                                                        products: item?.products,
                                                                        orderID: item?.id,
                                                                        order_status: item?.order_status?.name,
                                                                        orderDateTime: item?.created_at,
                                                                        total_price: item?.total_price
                                                                    })
                                                                    setOpenDropdown(null)
                                                                }}>
                                                                    Pay Now
                                                                </li>
                                                            )}
                                                            <li onClick={() => {
                                                                handleOpen1()
                                                                setOrderStatus(item?.order_status?.name)
                                                                setOrderData({
                                                                    orderCode: item?.order_code,
                                                                    products: item?.products,
                                                                    orderID: item?.id,
                                                                    order_status: item?.order_status?.name,
                                                                    orderDateTime: item?.created_at,
                                                                    total_price: item?.total_price
                                                                })
                                                                setOpenDropdown(null)
                                                            }}>
                                                                View
                                                            </li>
                                                        </ul>
                                                    </div>}
                                            </div>
                                        </td>
                                        <td className={i % 2 !== 0 ? "active" : ""}>{item?.order_code}</td>
                                        <td className={i % 2 !== 0 ? "active" : ""}>
                                            <div className='d-flex align-items-center'>
                                                {item?.products?.length}<div onClick={() => {
                                                    handleOpen1()
                                                    setOrderStatus(item?.order_status?.name)
                                                    setOrderData({
                                                        orderCode: item?.order_code,
                                                        products: item?.products,
                                                        orderID: item?.id,
                                                        order_status: item?.order_status?.name,
                                                        orderDateTime: item?.created_at,
                                                        total_price: item?.total_price
                                                    })
                                                }} className='d-sm-flex d-none align-items-center justify-content-center ms-2' style={{ cursor: "pointer", border: "1px solid #E3FEFF", height: "25px", width: "25px", fontSize: "15px", color: "#447158", background: "#F5F6FA", borderRadius: "50%" }}>
                                                    <CustomTooltip title={'View'} placement={'top'} padding={"4px 8px"}>
                                                        <PiEyeLight />
                                                    </CustomTooltip>
                                                </div>

                                            </div>
                                        </td>
                                        <td className={i % 2 !== 0 ? "active" : ""}> {`${formattedTime}, ${formattedDate}`}</td>
                                        <td className={`${getStatusClass(item?.order_status?.name)} status`}><span>{item?.order_status?.name}</span></td>
                                        <td className={i % 2 !== 0 ? "active" : ""}>Rs {item?.total_price}</td>
                                        <td className={i % 2 !== 0 ? "active action-head-global" : "action-head-global"}>
                                            <div className='table_action_button'>

                                                {item?.order_status?.name !== "Saved" ? <div style={{ background: "#447158", width: "max-content", borderRadius: "5px" }} className='action_btn d-flex'><button onClick={() => {
                                                    handleOpen1()
                                                    setOrderStatus(item?.order_status?.name)
                                                    setOrderData({
                                                        orderCode: item?.order_code,
                                                        products: item?.products,
                                                        orderID: item?.id,
                                                        order_status: item?.order_status?.name,
                                                        orderDateTime: item?.created_at,
                                                        total_price: item?.total_price
                                                    })
                                                }} className='py-0'>View</button></div> :
                                                    <div style={{ background: "#447158", width: "max-content", borderRadius: "5px" }} className='action_btn d-flex'>
                                                        <button onClick={() => {
                                                            handleOpen()
                                                            setOrderData({
                                                                orderCode: item?.order_code,
                                                                products: item?.products,
                                                                orderID: item?.id,
                                                                order_status: item?.order_status?.name,
                                                                orderDateTime: item?.created_at,
                                                                total_price: item?.total_price

                                                            })
                                                        }} style={{ borderRadius: "5px 0 0 5px", borderRight: "1px solid lightgray", }} className='btn1 py-0 pe-2'>Pay Now</button>
                                                        <button onClick={() => {
                                                            handleOpen1()
                                                            setOrderStatus(item?.order_status?.name)
                                                            setOrderData({
                                                                orderCode: item?.order_code,
                                                                products: item?.products,
                                                                orderID: item?.id,
                                                                order_status: item?.order_status?.name,
                                                                orderDateTime: item?.created_at,
                                                                total_price: item?.total_price

                                                            })
                                                        }} style={{ borderRadius: "0 5px 5px 0" }} className='btn2 py-0 ps-2'>View</button>
                                                    </div>}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}


                            </tbody>}
                    </table>
                    {paginationData?.total_pages > 1 ? <div className='global-table-footer d-flex justify-content-center'>
                        <div className='pagination w-100'>
                            <Pagination
                                fetchData={fetchData}
                                paginationData={paginationData}
                                setPaginationData={setPaginationData}
                            />
                        </div>
                    </div> : ""}
                </div>
                <OrderDetail orderData={orderData} orderStatus={orderStatus} fetchData={fetchData} order_status={orderData?.order_status} order_code={orderData?.orderCode} order_created_at={orderData?.orderDateTime} handleOpen={handleOpen} orderId={orderData?.orderID} cartData={orderData?.products} open={open} setOpen={setOpen} open1={open1} setOpen1={setOpen1} />
            </div>
        </div >
    )
}

export default OrderHistory