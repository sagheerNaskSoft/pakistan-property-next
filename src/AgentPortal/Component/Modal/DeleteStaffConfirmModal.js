import { Modal } from '@mui/material'
import React, { useState } from 'react'
import { useAuth } from '../../../Context/ContextProvider'
import { Box } from '@mui/material'
import './ModalDeleteStaff.css'
import DropDownField from '../Inputs/DropDownField'
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 412,
    boxShadow: 24,
    borderRadius: "12px",
};
function DeleteStaffConfirmModal({ open, setOpen, agentId,agentList }) {
    const { deleteAgencyStaff } = useAuth()
    const [data, setData] = useState({
        transfer_to_agent_id:""
    })
    const handleClose = () => {
        setOpen(false)
    }
    const handleDelete = async () => {
        
        let result = await deleteAgencyStaff({
            agency_id: agentId,
            transfer_to_agent_id: data?.transfer_to_agent_id?.id
        })
        if (result.success) {
            setOpen(false)
        }
    }
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
            <Box sx={style}>

                <div className='delete_staff_confirm_modal global-modal-base-color'>
                    <svg style={{marginBottom: '16px'}} xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
                        <g clipPath="url(#clip0_1832_5303)">
                            <path d="M44 87.9141C68.2531 87.9141 87.9141 68.2531 87.9141 44C87.9141 19.7469 68.2531 0.0859375 44 0.0859375C19.7469 0.0859375 0.0859375 19.7469 0.0859375 44C0.0859375 68.2531 19.7469 87.9141 44 87.9141Z" fill="#C94444" />
                            <path d="M51.7344 20.5709C51.7344 19.2857 50.6743 18.3906 49.3891 18.3906H38.6109C37.3258 18.3906 36.2656 19.2857 36.2656 20.5709V22.8594H51.7344V20.5709Z" fill="#FFFFFE" />
                            <path d="M62.4475 24.0625H52.3241H35.6759H25.5525C24.443 24.0625 23.5469 24.9334 23.5469 26.0428V26.6009C23.5469 27.7104 24.443 28.7031 25.5525 28.7031H27.1893H60.8108H62.4475C63.557 28.7031 64.4531 27.7104 64.4531 26.6009V26.0428C64.4531 24.9334 63.557 24.0625 62.4475 24.0625Z" fill="#FFFFFE" />
                            <path d="M29.594 66.6076C29.7051 68.3849 31.1947 69.7812 32.9848 69.7812H55.0147C56.8046 69.7812 58.2942 68.3849 58.4058 66.599L60.1768 29.9062H27.8237L29.594 66.6076ZM50.1878 38.9275C50.1878 38.5938 50.4557 38.3231 50.7893 38.3231C51.1229 38.3231 51.3909 38.5937 51.3909 38.9275V59.747C51.3909 60.0806 51.1229 60.3513 50.7893 60.3513C50.4557 60.3513 50.1878 60.0808 50.1878 59.747V38.9275ZM43.4846 38.9275C43.4846 38.5938 43.6667 38.3231 44.0003 38.3231C44.3339 38.3231 44.5159 38.5937 44.5159 38.9275V59.747C44.5159 60.0806 44.3339 60.3513 44.0003 60.3513C43.6667 60.3513 43.4846 60.0808 43.4846 59.747V38.9275ZM36.6096 38.9275C36.6096 38.5938 36.8776 38.3231 37.2112 38.3231C37.5448 38.3231 37.8128 38.5937 37.8128 38.9275V59.747C37.8128 60.0806 37.5448 60.3513 37.2112 60.3513C36.8776 60.3513 36.6096 60.0808 36.6096 59.747V38.9275Z" fill="#FFFFFE" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1832_5303">
                                <rect width="88" height="88" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    
                    <h5 className='m-0'>Are you sure you want to delete this user?</h5>
                    <p className='m-0'>You can’t view it’s properties and previous activities after it.</p>
                    <div className='w-100 mt-2'>
                    <DropDownField  active={true} getName={'name'} width={'100%'} label={"Transfer to Agent"} data={data} setData={setData} varName={"transfer_to_agent_id"} menuData={agentList} />

                    </div>

                    <div style={{gap: '8px',marginTop: '24px'}} className='d-flex justify-content-center align-items-center'>
                        <button  onClick={handleClose}>No</button>
                        <button className='yes_button' onClick={handleDelete}>Yes</button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default DeleteStaffConfirmModal