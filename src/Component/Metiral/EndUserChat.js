import React from 'react'
import { useNavigate } from 'react-router-dom'
import './EndUserChat.css'
import defaultImg from '../../Asset/DefaultImages/profileDefault.png'
import PrimaryButton from './Button/PrimaryButton'
import { useAuth } from '../../Context/ContextProvider'
import { BsFileEarmarkPdf } from 'react-icons/bs'
import { MdInsertDriveFile } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BiCheckDouble } from 'react-icons/bi'
import echo from '../../echo'

// Previous/suggested offer values (pill tags)
const OFFER_TAGS = ['237,500,000', '237,500,000', '237,500,000', '237,500,000', '237,500,000']

function timeFormatAgo(time) {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} min ago`
    if (seconds > 0) return `${seconds} sec ago`
    return 'Just now'
}

function EndUserChat({ open, setOpen, propertySlug, agentId, propertyData, userOfProperty }) {
    const navigate = useNavigate()
    const { formatPriceWithCommas, getChatContacts, sendUserLog, getChatMessages, sendChatMessage, loginData, markMessagesAsRead } = useAuth()
    const [activeTab, setActiveTab] = React.useState('chat')
    const [offerAmount, setOfferAmount] = React.useState('230000000') // digits only for formatting
    const [isClosing, setIsClosing] = React.useState(false)
    const chatThreadScrollRef = React.useRef(null)
    const [attachments, setAttachments] = React.useState([])
    const [attachmentPreviews, setAttachmentPreviews] = React.useState([])
    const [selectedPreviewIndex, setSelectedPreviewIndex] = React.useState(0)
    const [clinetList, setClinetList] = React.useState([])
    const [selectedClient, setSelectedClient] = React.useState(null)
    const [messageList, setMessageList] = React.useState([])
    const [message, setMessage] = React.useState('')

    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'image'
        if (file.type.startsWith('video/')) return 'video'
        if (file.type === 'application/pdf') return 'pdf'
        return 'other'
    }

    const createPreview = (file) => {
        return new Promise((resolve) => {
            const fileType = getFileType(file)
            if (fileType === 'image' || fileType === 'video') {
                const reader = new FileReader()
                reader.onload = (e) => resolve({ url: e.target.result, type: fileType, file })
                reader.onerror = () => resolve({ url: null, type: fileType, file })
                reader.readAsDataURL(file)
            } else {
                resolve({ url: null, type: fileType, file })
            }
        })
    }

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return
        const newAttachments = [...attachments, ...files]
        setAttachments(newAttachments)
        const previewPromises = files.map((file) => createPreview(file))
        const newPreviews = await Promise.all(previewPromises)
        const updatedPreviews = [...attachmentPreviews, ...newPreviews]
        setAttachmentPreviews(updatedPreviews)
        if (attachmentPreviews.length === 0) setSelectedPreviewIndex(0)
        e.target.value = null
    }

    const removeAttachment = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index)
        const newPreviews = attachmentPreviews.filter((_, i) => i !== index)
        setAttachments(newAttachments)
        setAttachmentPreviews(newPreviews)
        if (newPreviews.length === 0) setSelectedPreviewIndex(0)
        else if (selectedPreviewIndex >= newPreviews.length) setSelectedPreviewIndex(newPreviews.length - 1)
        else if (selectedPreviewIndex > index) setSelectedPreviewIndex(selectedPreviewIndex - 1)
    }

    const clearAllAttachments = () => {
        setAttachments([])
        setAttachmentPreviews([])
        setSelectedPreviewIndex(0)
    }

    // Match thread only by property_slug + agent id (never by name alone — different property = new chat)
    const threadMatchesProperty = (t, slug, agent) => {
        if (!slug || !agent) return false
        const threadSlug = t?.property_slug ?? t?.last_message?.property_slug
        const threadAgentId = t?.other_user?.id
        return threadSlug === slug && threadAgentId === agent
    }

    // Load chat threads when panel opens and user is logged in
    React.useEffect(() => {
        if (!open || !loginData?.data?.user?.id) return
        getChatContacts().then((res) => {
            if (res?.success && res?.data?.data?.threads) {
                const threads = res.data.data.threads
                setClinetList(threads)
                if (propertySlug && agentId && threads.length > 0) {
                    const match = threads.find((t) => threadMatchesProperty(t, propertySlug, agentId))
                    if (match) setSelectedClient(match)
                    else setSelectedClient(null)
                }
            }
        })
    }, [open, loginData?.data?.user?.id, propertySlug, agentId])

    // Load messages when selectedClient has a thread
    React.useEffect(() => {
        if (!selectedClient?.id) {
            setMessageList([])
            return
        }
        const threadId = selectedClient?.id
        getChatMessages(threadId).then((res) => {
            if (res?.success && res?.data?.data?.messages) {
                setMessageList((res.data.data.messages || []).reverse())
                markMessagesAsRead(threadId)
            }
        })
    }, [selectedClient?.id])

    // Keep scroll at bottom when messages change or panel opens
    React.useEffect(() => {
        if (!open) return
        const el = chatThreadScrollRef.current
        if (el) {
            const t = setTimeout(() => { el.scrollTop = el.scrollHeight }, 0)
            return () => clearTimeout(t)
        }
    }, [open, messageList])

    // Clear preview when panel closes
    React.useEffect(() => {
        if (!open) clearAllAttachments()
    }, [open])

    // Clear preview when switching to Offer tab (only on transition to offer)
    const prevActiveTabRef = React.useRef(activeTab)
    React.useEffect(() => {
        if (prevActiveTabRef.current !== 'offer' && activeTab === 'offer') clearAllAttachments()
        prevActiveTabRef.current = activeTab
    }, [activeTab])

    // Clear preview when user selects a different chat
    const prevClientRef = React.useRef(selectedClient)
    React.useEffect(() => {
        if (prevClientRef.current !== selectedClient) {
            clearAllAttachments()
            prevClientRef.current = selectedClient
        }
    }, [selectedClient])

    // Real-time: Echo listener for new messages and read receipts
    React.useEffect(() => {
        const myId = loginData?.data?.user?.id
        if (!myId) return
        const channel = echo.private(`chat.${myId}`)
        channel.listen('.chat.message', (e) => {
            const incomingMessage = e?.message
            if (!incomingMessage) return
            const senderId = incomingMessage.sender_id
            const receiverId = incomingMessage.receiver_id
            const currentAgentId = selectedClient?.other_user?.id ?? agentId
            const currentPropertySlug = selectedClient?.last_message?.property_slug ?? selectedClient?.property_slug ?? propertySlug
            const messagePropertySlug = incomingMessage?.property_slug
            const isForCurrentConversation = (receiverId === myId && senderId === currentAgentId && messagePropertySlug === currentPropertySlug) || (senderId === myId && receiverId === currentAgentId && messagePropertySlug === currentPropertySlug)
            if (senderId === myId) {
                setMessageList((prev) => {
                    if (prev.find((m) => m.id === incomingMessage.id)) return prev
                    return [...prev, incomingMessage]
                })
            } else if (receiverId === myId && isForCurrentConversation) {
                setMessageList((prev) => {
                    if (prev.find((m) => m.id === incomingMessage.id)) return prev
                    return [...prev, incomingMessage]
                })
            }
            setClinetList((prevList) => {
                const isFromMe = senderId === myId
                const otherId = isFromMe ? receiverId : senderId
                const otherUser = isFromMe ? (incomingMessage?.receiver || e.receiver) : (incomingMessage?.sender || e.sender)
                    || { id: otherId, name: '', avatar: null }
                const msgSlug = incomingMessage?.property_slug
                const idx = prevList.findIndex((item) => (item?.other_user?.id === senderId || item?.other_user?.id === receiverId) && (item?.property_slug === msgSlug || item?.last_message?.property_slug === msgSlug))
                if (idx === -1) return [{ other_user: otherUser, last_message: incomingMessage, last_message_at: incomingMessage.created_at, property_slug: msgSlug }, ...prevList]
                const updated = [...prevList]
                const one = { ...updated[idx], other_user: updated[idx].other_user || otherUser, last_message: incomingMessage, last_message_at: incomingMessage.created_at, property_slug: msgSlug || updated[idx].property_slug }
                updated.splice(idx, 1)
                return [one, ...updated]
            })
        })
        channel.listen('.chat.read', (e) => {
            setMessageList((prev) => prev.map((msg) => {
                if (e.chat_thread_id && msg.chat_thread_id === e.chat_thread_id && msg.sender_id === myId)
                    return { ...msg, read_at: e.read_at || new Date().toISOString() }
                return msg
            }))
        })
        return () => {
            channel.stopListening('.chat.message')
            channel.stopListening('.chat.read')
        }
    }, [loginData?.data?.user?.id, agentId, selectedClient?.other_user?.id])

    const handleClose = () => {
        setIsClosing(true)
    }

    const handleAnimationEnd = (e) => {
        if (e.animationName === 'sliderClose') {
            setOpen(false)
            setIsClosing(false)
        }
    }

    const appendPropertyData = (formData, slug) => {
        formData.append('property_slug', slug)
        const propId = propertyData?.property_id ?? propertyData?.id
        if (propId != null) formData.append('property_id', propId)
    }

    const handleSendMessage = async () => {
        const receiverId = selectedClient?.other_user?.id ?? agentId
        const slug = selectedClient?.last_message?.property_slug ?? selectedClient?.property_slug ?? propertySlug
        if ((!message?.trim() && attachments.length === 0) || !receiverId || !slug) return
        const formData = new FormData()
        formData.append('receiver_id', receiverId)
        formData.append('body', message.trim())
        appendPropertyData(formData, slug)
        attachments.forEach((file, index) => formData.append(`attachments[${index}]`, file))
        const res = await sendChatMessage(formData)
        
        if (res?.success) {
            await sendUserLog('chat', {
                currentPropertyId: propertyData?.property_id ?? propertyData?.id,
                propertySlug: slug,
                contact: selectedClient?.other_user?.phone || selectedClient?.other_user?.contact,
                email: loginData?.data?.user?.email,
                chat_thread_id: res?.data?.data?.message?.chat_thread_id ?? selectedClient?.last_message?.chat_thread_id
            })
            const newMsg = res?.data?.data?.message
            if (newMsg) setMessageList((prev) => [...prev, newMsg])
            setMessage('')
            setAttachments([])
            setAttachmentPreviews([])
            setSelectedPreviewIndex(0)
            if (!selectedClient && newMsg) {
                const otherUser = newMsg.receiver || { id: newMsg.receiver_id, name: '', avatar: null }
                const newClient = {
                    id: newMsg.chat_thread_id,
                    other_user: otherUser,
                    last_message: newMsg,
                    last_message_at: newMsg.created_at,
                    property_slug: newMsg.property_slug ?? slug,
                }
                setClinetList((prev) => [newClient, ...prev])
                setSelectedClient(newClient)
            }
        }
    }

    const handleSendOffer = async () => {
        const receiverId = selectedClient?.other_user?.id ?? agentId ?? userOfProperty?.user?.id
        const slug = selectedClient?.last_message?.property_slug ?? selectedClient?.property_slug ?? propertySlug
        if (!offerAmount.trim()) return
        if (!receiverId || !slug) return
        const formattedPrice = formatPriceWithCommas ? formatPriceWithCommas(offerAmount) : Number(offerAmount).toLocaleString()
        const body = `My offer is ${formattedPrice}`
        const formData = new FormData()
        formData.append('receiver_id', receiverId)
        formData.append('body', body)
        appendPropertyData(formData, slug)
        const res = await sendChatMessage(formData)
        if (res?.success) {
            const newMsg = res?.data?.data?.message
            if (newMsg) setMessageList((prev) => [...prev, newMsg])
            setOfferAmount('')
            if (!selectedClient && newMsg) {
                const otherUser = newMsg.receiver || { id: newMsg.receiver_id, name: '', avatar: null }
                const newClient = {
                    id: newMsg.chat_thread_id,
                    other_user: otherUser,
                    last_message: newMsg,
                    last_message_at: newMsg.created_at,
                    property_slug: newMsg.property_slug ?? slug,
                }
                setClinetList((prev) => [newClient, ...prev])
                setSelectedClient(newClient)
            }
        }
    }

    const handleOfferTagClick = (value) => {
        setOfferAmount(String(value).replace(/\D/g, '') || '')
    }

    const handleOfferInputChange = (e) => {
        setOfferAmount(e.target.value.replace(/\D/g, '') || '')
    }

    const sliderOpen = open && !isClosing

    return (
        <div
            className={`chat-slider ${sliderOpen ? 'open' : ''} ${isClosing ? 'chat-slider-closing' : ''}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="close-button" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="27" viewBox="0 0 24 27" fill="none">
                    <path d="M17.4987 6.66675L5.83203 20.0001" stroke="white" strokeWidth="2.16049" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.83203 6.66675L17.4987 20.0001" stroke="white" strokeWidth="2.16049" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="row m-0 h-100">
                <div className="col-4 p-0 h-100">
                    <div className="chat-log-container">
                        <div className="header">
                            <div className="title">Chats</div>
                            <div className="count">{String((clinetList || []).length).padStart(2, '0')}</div>
                        </div>
                        <div className="log-section">
                            <input type="text" placeholder='Search chats' />
                            <div className="prev-chats-section" style={{ marginTop: '12px' }}>
                                {(clinetList || []).map((chat, index) => {
                                    const isSelected = selectedClient?.last_message?.chat_thread_id === chat?.last_message?.chat_thread_id || (selectedClient?.other_user?.id === chat?.other_user?.id && (selectedClient?.last_message?.property_slug === chat?.last_message?.property_slug || selectedClient?.property_slug === chat?.property_slug))
                                    const displayName = chat?.other_user?.name || 'User'
                                    const lastMsg = chat?.last_message?.body || 'No messages yet'
                                    const lastTime = chat?.last_message_at || chat?.last_message?.created_at
                                    return (
                                        <div className={`box ${isSelected ? 'selected-client' : ''}`} key={chat?.id || chat?.last_message?.chat_thread_id || index} onClick={() => setSelectedClient(chat)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedClient(chat); } }}>
                                            <div className="img">
                                                <img src={chat?.other_user?.avatar || defaultImg} alt="" />
                                            </div>
                                            <div className="text-box">
                                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                                    <div className="name">{displayName}</div>
                                                    <div className="icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M9.99935 10.8333C10.4596 10.8333 10.8327 10.4602 10.8327 9.99999C10.8327 9.53975 10.4596 9.16666 9.99935 9.16666C9.53911 9.16666 9.16602 9.53975 9.16602 9.99999C9.16602 10.4602 9.53911 10.8333 9.99935 10.8333Z" stroke="#737678" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M9.99935 5.00001C10.4596 5.00001 10.8327 4.62691 10.8327 4.16668C10.8327 3.70644 10.4596 3.33334 9.99935 3.33334C9.53911 3.33334 9.16602 3.70644 9.16602 4.16668C9.16602 4.62691 9.53911 5.00001 9.99935 5.00001Z" stroke="#737678" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M9.99935 16.6667C10.4596 16.6667 10.8327 16.2936 10.8327 15.8333C10.8327 15.3731 10.4596 15 9.99935 15C9.53911 15 9.16602 15.3731 9.16602 15.8333C9.16602 16.2936 9.53911 16.6667 9.99935 16.6667Z" stroke="#737678" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="property">{chat?.property_title || chat?.last_message?.property_slug || 'Property'}</div>
                                                <div className="d-flex align-items-center justify-content-between" style={{ gap: '16px' }}>
                                                    <div className="d-flex align-items-center chat-message-row" style={{ gap: '4px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <g clipPath={`url(#clip0_chat_${index})`}>
                                                                <path d="M4.4 9.19424L4.73275 8.97232C4.65856 8.86104 4.5337 8.79424 4.4 8.79424V9.19424ZM6 11.5927L5.66725 11.8146C5.74144 11.9259 5.8663 11.9927 6 11.9927C6.1337 11.9927 6.25856 11.9259 6.33275 11.8146L6 11.5927ZM7.6 9.19424V8.79424C7.4663 8.79424 7.34144 8.86104 7.26725 8.97232L7.6 9.19424ZM10.8 9.59424C11.463 9.59424 12 9.05808 12 8.3948H11.2C11.2 8.61576 11.0218 8.79424 10.8 8.79424V9.59424ZM12 8.3948V1.19948H11.2V8.3948H12ZM12 1.19948C12 0.536207 11.463 0 10.8 0V0.8C11.0218 0.8 11.2 0.978528 11.2 1.19948H12ZM10.8 0H1.2V0.8H10.8V0ZM1.2 0C0.536932 0 0 0.536207 0 1.19948H0.8C0.8 0.978528 0.978264 0.8 1.2 0.8V0ZM0 1.19948V8.3948H0.8V1.19948H0ZM0 8.3948C0 9.05808 0.536932 9.59424 1.2 9.59424V8.79424C0.978272 8.79424 0.8 8.61576 0.8 8.3948H0ZM1.2 9.59424H4.4V8.79424H1.2V9.59424ZM5.6 5.6H6.4V4.8H5.6V5.6ZM3.2 5.6H4V4.8H3.2V5.6ZM8 5.6H8.8V4.8H8V5.6Z" fill="#2D2D2D" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id={`clip0_chat_${index}`}>
                                                                    <rect width="12" height="12" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                        <div className="message">{lastMsg}</div>
                                                    </div>
                                                    <div className="time">{lastTime ? timeFormatAgo(lastTime) : ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-8 p-0 h-100">
                    <div className="chat-section">
                        <div className="header">
                            <div className="img">
                                <img src={selectedClient?.other_user?.avatar || userOfProperty?.user?.image || userOfProperty?.agency?.ceo_image || defaultImg} alt="" />
                            </div>
                            <div className="name">{selectedClient?.other_user?.name || userOfProperty?.user?.name || userOfProperty?.agency?.ceo_full_name || 'Agent'}</div>
                        </div>
                        <div className="message-section">
                            {(() => {
                                const displaySlug = selectedClient?.last_message?.property_slug ?? selectedClient?.property_slug ?? propertySlug
                                const isCurrentProperty = displaySlug === propertySlug
                                const displayTitle = (isCurrentProperty && propertyData?.title) ? propertyData.title : (selectedClient?.property_title ?? propertyData?.title ?? 'Property')
                                const displayPrice = isCurrentProperty && propertyData?.price != null ? propertyData.price : (selectedClient?.property_price ?? selectedClient?.last_message?.property_price)
                                const displayImage = (isCurrentProperty && (propertyData?.property_images?.[0] != null)) ? (propertyData.property_images[0]?.image ?? propertyData.property_images[0]?.url) : (selectedClient?.property_image ?? selectedClient?.property_image_url ?? (propertyData?.property_images?.[0]?.image ?? propertyData?.property_images?.[0]?.url))
                                const showCard = displaySlug || propertyData
                                if (!showCard) return null
                                return (
                                    <div className="property-detail">
                                        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                                            <div className="img">
                                                <img src={displayImage || defaultImg} alt="" />
                                            </div>
                                            <div className="text-box">
                                                <div className="property-name">{displayTitle}</div>
                                                <div className="property-price">{displayPrice != null && displayPrice !== '' ? `Rs ${formatPriceWithCommas ? formatPriceWithCommas(String(displayPrice)) : Number(displayPrice).toLocaleString()}` : ''}</div>
                                            </div>
                                        </div>
                                        <div className="view-button" onClick={() => { if (displaySlug) { navigate(`/property-detail/${displaySlug}`); setOpen(false); } }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (displaySlug) { navigate(`/property-detail/${displaySlug}`); setOpen(false); } } }}>
                                            View Property
                                        </div>
                                    </div>
                                )
                            })()}
                            <div className="chat-thread-scroll" ref={chatThreadScrollRef}>
                                <div className="chat-thread">
                                    {(messageList || []).map((msg, index) => {
                                        const isOutgoing = msg?.sender_id === loginData?.data?.user?.id || msg?.sender?.id === loginData?.data?.user?.id
                                        const type = isOutgoing ? 'outgoing' : 'incoming'
                                        const prev = messageList[index - 1]
                                        const prevOutgoing = prev && (prev?.sender_id === loginData?.data?.user?.id || prev?.sender?.id === loginData?.data?.user?.id)
                                        const showAvatar = !prev || prevOutgoing !== isOutgoing
                                        return (
                                            <div className={`chat-message ${type}`} key={msg?.id || index}>
                                                {type === 'incoming' && (
                                                    showAvatar ? (
                                                        <div className="chat-avatar">
                                                            <img src={selectedClient?.other_user?.avatar || userOfProperty?.user?.image || defaultImg} alt="" />
                                                        </div>
                                                    ) : (
                                                        <div className="chat-avatar-spacer" aria-hidden="true" />
                                                    )
                                                )}
                                                <div className="chat-bubble-wrap">
                                                    <div className={`chat-bubble ${type}`}>
                                                        {msg?.body || msg?.message || ''}
                                                    </div>
                                                    <div className={`chat-bubble-meta ${type}`}>
                                                        {msg?.created_at && timeFormatAgo(msg.created_at)}
                                                        {isOutgoing && <BiCheckDouble style={{ color: msg?.read_at ? '#4285F4' : '#A9B0B8', fontSize: '14px', marginLeft: '4px' }} />}
                                                    </div>
                                                </div>
                                                {type === 'outgoing' && (
                                                    showAvatar ? (
                                                        <div className="chat-avatar">
                                                            <img src={loginData?.data?.user?.avatar || defaultImg} alt="" />
                                                        </div>
                                                    ) : (
                                                        <div className="chat-avatar-spacer" aria-hidden="true" />
                                                    )
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            {attachmentPreviews.length > 0 && (
                                <div className="enduser-attachment-preview-overlay">
                                    <div className="enduser-attachment-preview-container">
                                        {attachmentPreviews[selectedPreviewIndex] && (
                                            <div className="enduser-attachment-main-preview">
                                                <button type="button" className="enduser-attachment-main-preview-remove" onClick={clearAllAttachments} aria-label="Remove all">
                                                    <AiFillCloseCircle />
                                                </button>
                                                {attachmentPreviews[selectedPreviewIndex].type === 'image' && attachmentPreviews[selectedPreviewIndex].url && (
                                                    <div className="enduser-attachment-main-preview-image">
                                                        <img src={attachmentPreviews[selectedPreviewIndex].url} alt={attachmentPreviews[selectedPreviewIndex].file.name} />
                                                    </div>
                                                )}
                                                {attachmentPreviews[selectedPreviewIndex].type === 'video' && attachmentPreviews[selectedPreviewIndex].url && (
                                                    <div className="enduser-attachment-main-preview-video">
                                                        <video src={attachmentPreviews[selectedPreviewIndex].url} controls />
                                                    </div>
                                                )}
                                                {attachmentPreviews[selectedPreviewIndex].type === 'pdf' && (
                                                    <div className="enduser-attachment-main-preview-file">
                                                        <BsFileEarmarkPdf className="enduser-attachment-main-file-icon" />
                                                        <span className="enduser-attachment-main-file-name">{attachmentPreviews[selectedPreviewIndex].file.name}</span>
                                                    </div>
                                                )}
                                                {attachmentPreviews[selectedPreviewIndex].type === 'other' && (
                                                    <div className="enduser-attachment-main-preview-file">
                                                        <MdInsertDriveFile className="enduser-attachment-main-file-icon" />
                                                        <span className="enduser-attachment-main-file-name">{attachmentPreviews[selectedPreviewIndex].file.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="enduser-attachment-preview-thumbnails">
                                            {attachmentPreviews.map((preview, index) => (
                                                <div
                                                    key={index}
                                                    className={`enduser-attachment-preview-item ${selectedPreviewIndex === index ? 'active' : ''}`}
                                                    onClick={() => setSelectedPreviewIndex(index)}
                                                >
                                                    {preview.type === 'image' && preview.url && (
                                                        <div className="enduser-attachment-preview-image">
                                                            <img src={preview.url} alt={preview.file.name} />
                                                        </div>
                                                    )}
                                                    {preview.type === 'video' && preview.url && (
                                                        <div className="enduser-attachment-preview-video">
                                                            <video src={preview.url} controls={false} />
                                                        </div>
                                                    )}
                                                    {preview.type === 'pdf' && (
                                                        <div className="enduser-attachment-preview-file">
                                                            <BsFileEarmarkPdf className="enduser-attachment-file-icon" />
                                                        </div>
                                                    )}
                                                    {preview.type === 'other' && (
                                                        <div className="enduser-attachment-preview-file">
                                                            <MdInsertDriveFile className="enduser-attachment-file-icon" />
                                                        </div>
                                                    )}
                                                    <button type="button" className="enduser-attachment-preview-remove" onClick={(ev) => { ev.stopPropagation(); removeAttachment(index); }} aria-label="Remove">
                                                        <AiFillCloseCircle />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`chat-bottom-bar ${activeTab === 'offer' ? 'tab-offer' : 'tab-chat'}`}>
                            <div className="chat-tabs">
                                <button type="button" className={`chat-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M14 10C14 10.3536 13.8595 10.6928 13.6095 10.9428C13.3594 11.1929 13.0203 11.3333 12.6667 11.3333H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10Z" stroke={activeTab === 'chat' ? '#447158' : '#737678'} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> Chat</button>
                                <button type="button" className={`chat-tab ${activeTab === 'offer' ? 'active' : ''}`} onClick={() => setActiveTab('offer')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M5.33268 5.33305H5.33935M7.72322 3.05691L13.0565 8.39025C13.5772 8.91092 13.5772 9.75518 13.0565 10.2758L10.2755 13.0569C9.75482 13.5776 8.91055 13.5776 8.38988 13.0569L3.05654 7.72358C2.80649 7.47352 2.66602 7.13438 2.66602 6.78078V3.99972C2.66602 3.26334 3.26297 2.66638 3.99935 2.66638H6.78042C7.13402 2.66638 7.47315 2.80686 7.72322 3.05691Z" stroke={activeTab === 'offer' ? '#447158' : '#737678'} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> Offer</button>
                            </div>
                            <div className="chat-tab-content-inner">
                               {
                                activeTab === 'chat' ? (
                                    <div className="chat-tab-panel chat-input-wrap">
                                    <div className="chat-input-row d-flex align-items-center w-100" style={{gap: "8px"}}>
                                    <label className="chat-input-attach enduser-attach-label" aria-label="Attach files">
                                        <input
                                            type="file"
                                            multiple
                                            accept="*/*"
                                            onChange={handleFileChange}
                                            className="enduser-file-input"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M11.0293 16.8767L17.501 10.25" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M13.3338 4.99998L6.32209 12.155C6.00964 12.4675 5.83411 12.8914 5.83411 13.3333C5.83411 13.7753 6.00964 14.1991 6.32209 14.5116C6.63464 14.8241 7.05848 14.9996 7.50042 14.9996C7.94236 14.9996 8.36621 14.8241 8.67876 14.5116L15.6904 7.35665C16.3153 6.73155 16.6664 5.88386 16.6664 4.99998C16.6664 4.1161 16.3153 3.26841 15.6904 2.64331C15.0653 2.01841 14.2176 1.66736 13.3338 1.66736C12.4499 1.66736 11.6022 2.01841 10.9771 2.64331L3.96459 9.79748C3.02683 10.7352 2.5 12.0071 2.5 13.3333C2.5 14.6595 3.02683 15.9314 3.96459 16.8691C4.90235 17.8069 6.17423 18.3337 7.50042 18.3337C8.82662 18.3337 10.0985 17.8069 11.0363 16.8691" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </label>
                                    <input
                                        type="text"
                                        className="chat-input"
                                        placeholder="Type a message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                    />
                                    <button type="button" className="chat-input-send" aria-label="Send" onClick={handleSendMessage} disabled={(!message.trim() && attachments.length === 0) || (!(selectedClient?.other_user?.id ?? agentId) || !(selectedClient?.last_message?.property_slug ?? selectedClient?.property_slug ?? propertySlug))}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M14.5358 21.6865C14.5738 21.7812 14.6398 21.862 14.7251 21.9181C14.8103 21.9741 14.9107 22.0028 15.0126 22.0002C15.1146 21.9976 15.2134 21.9638 15.2956 21.9035C15.3779 21.8431 15.4397 21.759 15.4728 21.6625L21.9728 2.66254C22.0048 2.57394 22.0109 2.47805 21.9904 2.3861C21.9699 2.29415 21.9236 2.20994 21.857 2.14332C21.7904 2.07671 21.7062 2.03044 21.6143 2.00994C21.5223 1.98943 21.4264 1.99554 21.3378 2.02754L2.33781 8.52754C2.2413 8.56064 2.15723 8.62246 2.09688 8.70472C2.03652 8.78697 2.00278 8.88572 2.00016 8.9877C1.99755 9.08969 2.0262 9.19004 2.08226 9.27527C2.13833 9.36051 2.21912 9.42655 2.31381 9.46454L10.2438 12.6445C10.4945 12.7449 10.7223 12.895 10.9134 13.0858C11.1045 13.2765 11.255 13.504 11.3558 13.7545L14.5358 21.6865Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M21.8541 2.14685L10.9141 13.0859" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    </div>
                                </div>
                                ) : (
                                    <div className="offer-tab-panel offer-panel">
                                    <div className="offer-tags-row">
                                        <span className="offer-label">Offers:</span>
                                        <div className="offer-tags">
                                            {OFFER_TAGS.map((tag, index) => (
                                                <button type="button" key={index} className="offer-tag" onClick={() => handleOfferTagClick(tag)}>
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="offer-input-row">
                                        <span className="offer-currency">Rs</span>
                                        <input
                                            type="text"
                                            className="offer-input"
                                            value={formatPriceWithCommas(offerAmount)}
                                            onChange={handleOfferInputChange}
                                            placeholder={"Offer your price"}
                                            inputMode="numeric"
                                        />
                                       <PrimaryButton
                                       text="Send Offer"
                                       onFunction={handleSendOffer}
                                       />
                                    </div>
                                </div>
                                )
                               }
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EndUserChat