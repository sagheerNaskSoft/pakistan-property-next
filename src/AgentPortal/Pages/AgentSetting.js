import React, { useState } from 'react'
import Profile from '../Component/Setting/Profile'
import Preferences from '../Component/Setting/Preferences'
import Password from '../Component/Setting/Password'

function AgentSetting({ role }) {
    const [activeTab, setActiveTab] = useState(role === "agent" ? 1 : 2)
    return (
        <div className='setting propshop-main h-100 portal-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>Settings</h3>
                    <p className='portal-breadCrums m-0'>Home - <span>Settings</span></p>
                </div>
            </div>
            <div className='row mx-0 main_box' style={{ gap: "12px 0" }}>
                <div className='col-lg-3 h-lg-100 ps-0 pe-lg-3 pe-0'>
                    <div className='boxes d-lg-block d-flex align-items-center'>
                        {role === "agent" && <div className={`${activeTab === 1 ? "active" : ""} tab_box`} onClick={() => setActiveTab(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="#2D2D2D" />
                            <path d="M17.0809 14.1499C14.2909 12.2899 9.74094 12.2899 6.93094 14.1499C5.66094 14.9999 4.96094 16.1499 4.96094 17.3799C4.96094 18.6099 5.66094 19.7499 6.92094 20.5899C8.32094 21.5299 10.1609 21.9999 12.0009 21.9999C13.8409 21.9999 15.6809 21.5299 17.0809 20.5899C18.3409 19.7399 19.0409 18.5999 19.0409 17.3599C19.0309 16.1299 18.3409 14.9899 17.0809 14.1499Z" fill="#2D2D2D" />
                        </svg><p className='m-0'>Profile</p></div>}
                        <div className={`${activeTab === 2 ? "active" : ""} tab_box`} onClick={() => setActiveTab(2)}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15.1636 3C13.7409 3 12.5495 3.99037 12.2412 5.31931H3.81818C3.36631 5.31931 3 5.68562 3 6.13749C3 6.58936 3.36631 6.95567 3.81818 6.95567H12.3191C12.7181 8.14396 13.8409 9 15.1636 9C16.4864 9 17.6091 8.14396 18.0082 6.95567H20.1818C20.6337 6.95567 21 6.58936 21 6.13749C21 5.68562 20.6337 5.31931 20.1818 5.31931H18.0861C17.7778 3.99037 16.5864 3 15.1636 3Z" fill="#2D2D2D" />
                            <path d="M7.52727 9C6.14741 9 4.98512 9.9316 4.63508 11.2002L3.79675 11.2221C3.34503 11.234 2.98845 11.6098 3.00029 12.0615C3.01213 12.5132 3.38791 12.8698 3.83963 12.8579L4.64554 12.8368C5.00778 14.0865 6.16084 15 7.52727 15C8.88587 15 10.0335 14.0969 10.4027 12.8583H20.1818C20.6337 12.8583 21 12.492 21 12.0401C21 11.5882 20.6337 11.2219 20.1818 11.2219H10.4254C10.0827 9.94227 8.91502 9 7.52727 9Z" fill="#2D2D2D" />
                            <path d="M15.1636 15C13.8114 15 12.6681 15.8947 12.2934 17.1244H3.81818C3.36631 17.1244 3 17.4907 3 17.9426C3 18.3944 3.36631 18.7608 3.81818 18.7608H12.2609C12.5977 20.0492 13.7696 21 15.1636 21C16.5576 21 17.7296 20.0492 18.0663 18.7608H20.1818C20.6337 18.7608 21 18.3944 21 17.9426C21 17.4907 20.6337 17.1244 20.1818 17.1244H18.0338C17.6592 15.8947 16.5159 15 15.1636 15Z" fill="#2D2D2D" />
                        </svg><p className='m-0'>
                                Preferences</p></div>
                        <div className={`${activeTab === 3 ? "active" : ""} tab_box special_tab_box`} onClick={() => setActiveTab(3)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13.6667 9L12 12M12 12L10.3333 9M12 12H9.5M12 12H14.5M12 12L10.3333 15M12 12L13.6667 15M6.16667 9.00006L4.5 12M4.5 12L2.83333 9.00006M4.5 12H2M4.5 12H7M4.5 12L2.83333 15M4.5 12L6.16667 15M21.1667 9.00006L19.5 12M19.5 12L17.8333 9.00006M19.5 12H17M19.5 12H22M19.5 12L17.8333 15M19.5 12L21.1667 15" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg><p className='m-0'>Password</p></div>
                    </div>
                </div>
                <div className='col-lg-9 h-100 pe-0 ps-xl-3 ps-0'>
                    {activeTab === 1 && <Profile />}
                    {activeTab === 2 && <Preferences />}
                    {activeTab === 3 && <Password />}
                </div>
            </div>
        </div>
    )
}

export default AgentSetting