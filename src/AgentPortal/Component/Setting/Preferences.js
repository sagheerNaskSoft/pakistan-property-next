import React, { useEffect, useState } from 'react'
import DropDownField from '../Inputs/DropDownField';
import { useAuth } from '../../../Context/ContextProvider';
import IOSSwitch from '../Inputs/IOSSwitch';

const unit = [{
    name: "PKR",
    id: "PKR"
},
{
    name: "USD",
    id: "USD"
},
{
    name: "EUR",
    id: "EUR"
},
{
    name: "GBP",
    id: "GBP"
},
{
    name: "SAR",
    id: "SAR"
},
{
    name: "AED",
    id: "AED"
},
]

function Preferences() {
    const { areaUnit, updateSetting } = useAuth()
    const [data, setData] = useState({
        notification: false,
        newsletter: false,
        currency: {
            name: "PKR",
            id: "PKR"
        },
        area_unit: {
            id: 4,
            name: "Marla",
            code: "marla"
        },
    })
    useEffect(() => {
        const user_data = JSON.parse(localStorage.getItem("agent_data"))
        let setting = user_data?.data?.user?.setting
        if (setting) {
            setData({
                notification: setting?.email_notif,
                newsletter: setting?.news_letter,
                currency: setting?.currency ? unit?.find((item) => item?.id === setting?.currency) : {
                    name: "PKR",
                    id: "PKR"
                },
                area_unit: setting?.area_unit
                    ? areaUnit?.find((item) => item?.id === setting?.area_unit) || {
                        id: 4,
                        name: "Marla",
                        code: "marla",
                    }
                    : {
                        id: 4,
                        name: "Marla",
                        code: "marla",
                    },

            })
        }
        else {
            setData({
                notification: false,
                newsletter: false,
                currency: {
                    name: "PKR",
                    id: "PKR"
                },
                area_unit: {
                    id: 4,
                    name: "Marla",
                    code: "marla"
                },

            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaUnit])

    const handleSubmit = async () => {
        await updateSetting({
            email_notif: data?.notification,
            news_letter: data?.newsletter,
            currency: data?.currency?.id,
            area_unit: data?.area_unit?.id,
        })
    };

    return (
        <div className='h-100'>
            <div className='profile_setting_form boxes boxes_1'>
                <h6 className='title_head m-0'>Preferences</h6>
                <p className='pera m-0'>Customise your experience by selecting from the options below</p>
                <hr />
                <div style={{ height: "470px" }}>
                    <div className="input-box">
                        <label>Email Notifications</label>
                        <div className='d-flex align-items-center' style={{ gap: '12px', marginTop: '10px' }}>
                            <IOSSwitch
                                checked={data?.notification}
                                onChange={(e) =>
                                    setData((prev) => ({ ...prev, notification: e.target.checked }))
                                }
                            />
                            <div className='para'>{data?.notification ? 'Disable to unsubscribe from email notifications' : 'Enable to receive email notifications'}</div>
                        </div>
                    </div>
                    <div className="input-box">
                        <label>Newsletters</label>
                        <div className='d-flex align-items-center' style={{ gap: '12px', marginTop: '10px' }}>
                            <IOSSwitch
                                checked={data?.newsletter}
                                onChange={(e) =>
                                    setData((prev) => ({ ...prev, newsletter: e.target.checked }))
                                }
                            />
                            <div className='para'>{data?.newsletter ? 'Disable to unsubscribe from newsletters' : 'Enable to subscribe to newsletters'}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: "8px" }} className='inp_box'>
                        <label>Currency</label>
                        <DropDownField active={true} width={"100%"} getName={"name"} data={data} setData={setData} varName={"currency"} menuData={unit} />
                    </div>
                    <div className='inp_box'>
                        <label>Area Unit</label>
                        <DropDownField active={true} width={"100%"} getName={"name"} data={data} setData={setData} varName={"area_unit"} menuData={areaUnit} />
                    </div>
                </div>
            </div>
            <div className='bottom_btn'>
                <button type="button" onClick={handleSubmit}>Save Changes</button>
            </div>
        </div>
    )
}

export default Preferences