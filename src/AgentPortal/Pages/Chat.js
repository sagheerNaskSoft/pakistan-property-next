import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from '@mui/material'
import { GoArrowDownLeft, GoArrowUpRight } from 'react-icons/go'
import { RiAttachment2 } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import { MdInsertDriveFile } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsFileEarmarkPdf } from "react-icons/bs";
import { BiCheckDouble } from 'react-icons/bi'
import PrimaryBorderButton from '../../Component/Metiral/Button/PrimaryBorderButton'
import CustomTooltip from '../../Component/Metiral/CustomTooltip'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../Context/ContextProvider'
import echo from '../../echo'
import { PiWechatLogoLight } from "react-icons/pi";

import Image from 'next/image';
function Chat() {
    const { getChatContacts, getChatMessages, sendChatMessage, loginData, getUser, markMessagesAsRead, formatPriceWithCommas, base_url, sendUserLog } = useAuth()
    const [clinetList, setClinetList] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const [storedChatData, setStoredChatData] = useState(null)
    const [message, setMessage] = useState('')
    const [attachments, setAttachments] = useState([])
    const [attachmentPreviews, setAttachmentPreviews] = useState([])
    const [messageList, setMessageList] = useState([])
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)
    const { id, slug } = useParams()
    const hasLoadedRef = useRef(false);
    useEffect(() => {
        if (hasLoadedRef.current) return;

        hasLoadedRef.current = true;

        getChatContacts().then(res => {
            if (res?.success) {
                setClinetList(res?.data?.data?.threads);
            }
        });
    }, []);

    // Handle ID/Slug change or Client List update
    useEffect(() => {
        if (clinetList?.length > 0 && id && slug) {
            let client = clinetList?.find((item) => {
                return item?.property_slug === slug && item?.other_user?.id === parseInt(id)
            })
            console.log(client)
            if (client) {
                setSelectedClient(client)
                if (client?.id) {
                    getChatMessages(client?.id).then(res => {
                        if (res?.success) {
                            let oldMessage = res?.data?.data?.messages?.reverse()
                            setMessageList(oldMessage)
                            markMessagesAsRead(client?.id)
                        }
                    })
                }
            }
        }
    }, [id, slug, clinetList])

    // Load stored chat data (from "Chat with Agent" on property detail) for header
    const loadStoredChatData = () => {
        if (!id || !slug) return
        try {
            const storageKey = `chat_${id}_${slug}`
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const parsed = JSON.parse(stored)
                setStoredChatData(parsed)
            } else {
                setStoredChatData(null)
            }
        } catch (error) {
            console.error('Error loading stored chat data:', error)
            setStoredChatData(null)
        }
    }

    useEffect(() => {
        loadStoredChatData()
    }, [id, slug])

    // Online/offline status: offline on unmount (navigate away), page close; online via Pusher when connected
    useEffect(() => {
        const apiBase = base_url || 'https://admin.pakistanproperty.com/api/';
        if (!loginData?.data?.token) return;

        const token = loginData.data.token;
        const onlineUrl = `${apiBase}chat/online`;
        const offlineUrl = `${apiBase}chat/offline`;
        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        const setOnline = () => {
            fetch(onlineUrl, { method: 'POST', headers: authHeaders }).catch(() => {});
        };
        const setOffline = () => {
            if (process.env.NODE_ENV === 'development') console.log('[Chat] Calling offline API');
            fetch(offlineUrl, { method: 'POST', headers: authHeaders }).catch(() => {});
        };
        // keepalive: request completes even when page/tab is closing
        const setOfflineOnClose = () => {
            fetch(offlineUrl, { method: 'POST', headers: authHeaders, keepalive: true }).catch(() => {});
        };

        // 1. Offline when user closes tab/window OR switches tab - register FIRST so it always runs
        const onPageHide = () => setOfflineOnClose();
        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') setOfflineOnClose();
            else if (document.visibilityState === 'visible') setOnline(); // user returned to tab
        };
        window.addEventListener('pagehide', onPageHide);
        window.addEventListener('beforeunload', onPageHide);
        document.addEventListener('visibilitychange', onVisibilityChange);

        // 2. Pusher listeners - optional, don't crash if Echo not ready
        let intervalId = null;
        let onConnected, onDisconnected;
        const pusherConn = echo?.connector?.pusher?.connection;
        if (pusherConn) {
            onConnected = () => setOnline();
            onDisconnected = () => setOffline();
            pusherConn.bind('connected', onConnected);
            pusherConn.bind('disconnected', onDisconnected);
            if (pusherConn.state === 'connected') setOnline();
            intervalId = setInterval(() => {
                if (pusherConn.state === 'connected') setOnline();
            }, 60000);
        }

        return () => {
            // Offline when user navigates away (component unmount)
            setOffline();
            window.removeEventListener('pagehide', onPageHide);
            window.removeEventListener('beforeunload', onPageHide);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            if (pusherConn) {
                if (intervalId) clearInterval(intervalId);
                if (onConnected) pusherConn.unbind('connected', onConnected);
                if (onDisconnected) pusherConn.unbind('disconnected', onDisconnected);
            }
        };
    }, [base_url, loginData?.data?.token]);

    // Listen for incoming messages
    useEffect(() => {
        if (loginData?.data?.user?.id) {
            const channel = echo.private(`chat.${loginData.data.user.id}`)

            echo.connector.pusher.connection.bind('connected', () => {
                console.log('Echo connected to pusher');
            });

            // Debug: Catch all raw events on this channel for visibility
            channel.on('pusher:subscription_succeeded', () => {
                console.log('Successfully subscribed to private channel:', channel.name);
            });

            // Safer global logging if supported
            if (echo.connector.pusher.bind_all) {
                echo.connector.pusher.bind_all((eventName, data) => {
                    console.log('RAW PUSHER EVENT:', eventName, data);
                });
            }

            channel.listen('.chat.message', (e) => {
                const incomingMessage = e.message;
                console.log('Incoming Message Event Received:', e);

                const imAm = loginData?.data?.user?.id
                const receiverId = incomingMessage?.receiver_id
                const senderId = incomingMessage?.sender_id

                // Update Message List
                if (senderId === imAm) {
                    setMessageList(prev => {
                        // Avoid duplicates if listener catches our own message
                        if (prev.find(m => m.id === incomingMessage.id)) return prev;
                        return [...prev, incomingMessage];
                    });
                }
                else if (receiverId === imAm) {
                    if (senderId === parseInt(id)) {
                        setMessageList(prev => {
                            if (prev.find(m => m.id === incomingMessage.id)) return prev;
                            return [...prev, incomingMessage];
                        });
                    }

                    // Update Client List (Thread sidebar)
                    setClinetList(prevList => {
                        const clientIndex = prevList.findIndex(item => item?.other_user?.id === senderId);

                        if (clientIndex !== -1) {
                            // Update existing client entry
                            const updatedList = [...prevList];
                            const updatedClient = {
                                ...updatedList[clientIndex],
                                last_message: incomingMessage,
                                last_message_at: incomingMessage?.created_at,
                                unread_count: senderId === parseInt(id) ? updatedList[clientIndex].unread_count : updatedList[clientIndex].unread_count + 1
                            };
                            // Move to top
                            updatedList.splice(clientIndex, 1);
                            return [updatedClient, ...updatedList];
                        } else {
                            // Add new client to list
                            return [{
                                other_user: e.sender,
                                last_message: incomingMessage,
                                unread_count: 1,
                                last_message_at: incomingMessage?.created_at
                            }, ...prevList];
                        }
                    });
                }

                if (selectedClient?.other_user?.id === senderId && selectedClient?.last_message?.chat_thread_id) {
                    markMessagesAsRead(selectedClient.last_message.chat_thread_id);
                }
            })
            channel.listen('.chat.read', (e) => {
                setMessageList(prevList => {
                    return prevList.map(msg => {
                        if (e.chat_thread_id && msg.chat_thread_id === e.chat_thread_id && msg.sender_id === loginData?.data?.user?.id) {
                            return { ...msg, read_at: e.read_at || new Date().toISOString() };
                        }
                        if (!e.chat_thread_id && selectedClient && msg.sender_id === loginData?.data?.user?.id) {
                            return { ...msg, read_at: new Date().toISOString() };
                        }
                        return msg;
                    });
                });
            });
            return () => {
                channel.stopListening('.chat.message')
                channel.stopListening('.chat.read')
            }
        }
    }, [loginData, id, selectedClient])


    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type === 'application/pdf') return 'pdf';
        return 'other';
    }
    const createPreview = (file) => {
        return new Promise((resolve) => {
            const fileType = getFileType(file);

            if (fileType === 'image' || fileType === 'video') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        url: e.target.result,
                        type: fileType,
                        file: file
                    });
                };
                reader.onerror = () => {
                    resolve({
                        url: null,
                        type: fileType,
                        file: file
                    });
                };
                reader.readAsDataURL(file);
            } else {
                resolve({
                    url: null,
                    type: fileType,
                    file: file
                });
            }
        });
    }

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newAttachments = [...attachments, ...files];
            setAttachments(newAttachments);

            // Create previews for new files
            const previewPromises = files.map(file => createPreview(file));
            const newPreviews = await Promise.all(previewPromises);
            const updatedPreviews = [...attachmentPreviews, ...newPreviews];
            setAttachmentPreviews(updatedPreviews);

            // Set first file as selected preview if no preview was selected before
            if (attachmentPreviews.length === 0) {
                setSelectedPreviewIndex(0);
            }

            e.target.value = null; // Reset file input
        }
    }

    const removeAttachment = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        const newPreviews = attachmentPreviews.filter((_, i) => i !== index);
        setAttachments(newAttachments);
        setAttachmentPreviews(newPreviews);

        // Update selected preview index
        if (newPreviews.length === 0) {
            setSelectedPreviewIndex(0);
        } else if (selectedPreviewIndex >= newPreviews.length) {
            setSelectedPreviewIndex(newPreviews.length - 1);
        } else if (selectedPreviewIndex > index) {
            setSelectedPreviewIndex(selectedPreviewIndex - 1);
        }
    }

    const handleSendMessage = async () => {
        if (message?.trim() || attachments?.length > 0) {

            const formData = new FormData();
            formData.append('receiver_id', id);
            formData.append('body', message);
            formData.append('property_slug', slug);
            attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
            const res = await sendChatMessage(formData);
            if (res?.success) {
                await sendUserLog('chat', {
                    currentPropertyId: selectedClient?.property_id ?? res?.data?.data?.message?.property_id,
                    propertySlug: slug,
                    contact: selectedClient?.other_user?.phone || selectedClient?.other_user?.contact,
                    email: loginData?.data?.user?.email,
                    chat_thread_id: res?.data?.data?.message?.chat_thread_id ?? selectedClient?.last_message?.chat_thread_id
                });
                setMessage('');
                setAttachments([]);
                setAttachmentPreviews([]);
                setSelectedPreviewIndex(0);
                if (!selectedClient) {
                    let oldClientList = clinetList
                    let newUserMessage = res.data?.data?.message
                    let newClientList = [{
                        id: newUserMessage?.chat_thread_id,
                        other_user: newUserMessage?.receiver,
                        last_message: {
                            id: newUserMessage?.id,
                            chat_thread_id: newUserMessage?.chat_thread_id,
                            sender_id: newUserMessage?.sender_id,
                            receiver_id: newUserMessage?.receiver_id,
                            property_id: newUserMessage?.property_id,
                            property_slug: newUserMessage?.property_slug,
                            body: newUserMessage?.body,
                            read_at: null,
                            created_at: newUserMessage?.created_at,
                            updated_at: newUserMessage?.updated_at
                        },
                        last_message_at: newUserMessage?.created_at,

                    }, ...oldClientList]
                    setClinetList(newClientList)

                }

            } else {
                console.error("Failed to send message", res.error)
                // Maybe show error on the message
            }
        }
    }
    const selectedPreview = attachmentPreviews[selectedPreviewIndex]
    useEffect(() => {
        const chatMessage = document.querySelector('.chat-message');
        if (chatMessage) chatMessage.scrollTop = chatMessage.scrollHeight;
    }, [id, slug, messageList]); // Trigger on messages change

    const chatSection = useRef(null);
    // scroll pagination of the chat-message
    const [moreLoad, setMoreLoad] = useState(false);
    const handleScroll = () => {
        if (chatSection.current.scrollTop === 0) {
            setMoreLoad(true);
            setTimeout(() => setMoreLoad(false), 1000); // Dummy simulation
        }
    }
    const timeFormatAgo = (time) => {
        // time ago
        const date = new Date(time);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days} days ago`;
        } else if (hours > 0) {
            return `${hours} hours ago`;
        } else if (minutes > 0) {
            return `${minutes} min ago`;
        } else if (seconds > 0) {
            return `${seconds} sec ago`;
        } else {
            return 'Just now';
        }
    }
    const navigate = useNavigate();

    return (
        <div className='propshop-main h-100 portal-page-container'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h3 className='page-portal-heading m-0'>Chat</h3>
                    <p className='portal-breadCrums m-0'>Dashboard - <span>Chat</span></p>
                </div>
            </div>
            <div className='chat-body'>
                <div className='customer-list'>
                    <h4 className='mt-0 list-heading'>Inbox</h4>
                    {/* <div>
                <SingleInput label='Search' data={search} getVariable='search' setData={setSearch} varName='search' />
                <PrimaryButton text='Search' onClick={() => {}} />
            </div> */}
                    {clinetList?.map((item) => (
                        <div onClick={() => {
                            setSelectedClient(item)
                            navigate(`/${loginData?.data?.role}-portal/chat/${item?.other_user?.id}/${item?.property_slug}`)
                        }} className={`customer-list-item mb-2 ${item?.un > 0 ? 'un-seen-message' : ''} ${parseInt(id) === item?.other_user?.id ? 'selected-client' : ''}`} key={item?.id}>
                            <div>
                                <Avatar src={item?.other_user?.avatar} />
                            </div>
                            <div className='w-100'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='d-flex align-items-center justify-content-center gap-1'>
                                        <h6 className='m-0 customer-list-item-name'>{item?.other_user?.name}</h6>
                                        {item?.unread_count > 0 && <div className='un-seen-message-count'>
                                            {item?.unread_count > 0 && <span className='un-seen-message-count-number'>{item?.unread_count}</span>}
                                        </div>}
                                    </div>
                                    {item?.sender === 'You' ? <GoArrowUpRight className='customer-list-item-arrow' /> : <GoArrowDownLeft className='customer-list-item-arrow' />}

                                </div>
                                <div className='customer-list-item-status'>
                                    <p className='m-0'>{item.last_message?.sender_id === loginData?.data?.user?.id ? 'You' : item?.other_user?.name}: {item.last_message?.body}</p>
                                    <span className='m-0'>{timeFormatAgo(item?.last_message_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {id && slug ? <div className='chat-container'>

                    <div className='chat-header'>
                        <div className='name-status-container d-flex align-items-center gap-2'>
                            <div>
                                <Avatar
                                    src={
                                        storedChatData?.userImage
                                            ? storedChatData.userImage
                                            : selectedClient?.other_user?.avatar
                                    }
                                />
                            </div>
                            <div className='d-flex flex-column chat-header-status p-0 m-0 gap-0'>
                                <div className='d-flex align-items-center gap-2'>
                                    <CustomTooltip title={storedChatData?.userName || selectedClient?.other_user?.name} placement='top'>
                                        <h4 className='mt-0 chat-header-title'>
                                            {storedChatData?.userName || selectedClient?.other_user?.name || 'User'}
                                        </h4>
                                    </CustomTooltip>
                                    {selectedClient?.sender === 'You' ? <GoArrowUpRight className='chat-header-arrow' /> : <GoArrowDownLeft className='chat-header-arrow' />}
                                </div>
                                <span className='m-0'>
                                    {selectedClient?.other_user?.online ? 'Online' : selectedClient?.last_message_at ? 'Last seen ' + timeFormatAgo(selectedClient.last_message_at) : ''}
                                </span>
                            </div>
                        </div>
                        {(storedChatData || selectedClient?.propertyImage || selectedClient?.propertyTitle) && (
                            <div className='chat-about-property'>
                                <div className='d-flex align-items-center gap-2'>
                                    <div>
                                        {(() => {
                                            const img = storedChatData?.propertyImage || selectedClient?.propertyImage
                                            const src = typeof img === 'string' ? img : (img?.url || img?.image || null)
                                            return src ? <Image src={src} alt='property' /> : null
                                        })()}
                                    </div>
                                    <div className='chat-header-status d-flex flex-column gap-0'>
                                        <h4 className='mt-0 chat-header-title'>
                                            {storedChatData?.propertyTitle || selectedClient?.propertyTitle || 'Property Discussion'}
                                        </h4>
                                        <span className='m-0'>
                                            {storedChatData?.propertyPrice
                                                ? `PKR: ${formatPriceWithCommas ? formatPriceWithCommas(storedChatData.propertyPrice) : (typeof storedChatData.propertyPrice === 'number' ? storedChatData.propertyPrice.toLocaleString() : storedChatData.propertyPrice)}`
                                                : ''}
                                            {(storedChatData?.propertyLocation || storedChatData?.propertyCity)
                                                ? ` || ${storedChatData?.propertyLocation || ''}${storedChatData?.propertyCity ? (storedChatData?.propertyLocation ? ', ' : '') + storedChatData.propertyCity : ''}`
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <PrimaryBorderButton
                                        text='View Property'
                                        onFunction={() => {
                                            const targetSlug = storedChatData?.propertySlug || slug
                                            if (targetSlug) navigate(`/property/${targetSlug}`)
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div onScroll={handleScroll} className='chat-message' ref={chatSection}>
                        {moreLoad && <div className='more-load-container'>
                            <div className='more-load-item'>
                                <div className='more-load-item-content'>
                                    <p className='m-0 text-center'>Loading...</p>
                                </div>
                            </div>
                        </div>}
                        {messageList?.map((message, index) => (
                            <div key={message.id || index} className={`chat-message-item ${message?.sender_id === loginData?.data?.user?.id || message?.sender?.id === loginData?.data?.user?.id ? 'sender' : 'receiver'}`}>
                                <div className='chat-message-item-content'>
                                    <p className='m-0'>{message?.body || message?.message}</p>
                                    <span className='m-0'>{timeFormatAgo(message?.created_at)}</span>
                                    {message?.sender_id === loginData?.data?.user?.id || message?.sender?.id === loginData?.data?.user?.id ?
                                        <BiCheckDouble style={{ color: message?.read_at ? "#4285F4" : "#A9B0B8", fontSize: "18px" }} />
                                        : null
                                    }
                                </div>
                            </div>
                        ))}

                        {attachmentPreviews.length ? (
                            <div className='attemchment-preview-container'>
                                {attachmentPreviews.length > 0 && selectedPreview && (
                                    <div className='attachment-main-preview'>
                                        <button
                                            type="button"
                                            className='attachment-main-preview-remove'
                                            onClick={() => {
                                                setAttachments([]);
                                                setAttachmentPreviews([]);
                                                setSelectedPreviewIndex(0);
                                            }}
                                        >
                                            <AiFillCloseCircle />
                                        </button>
                                        {selectedPreview.type === 'image' && selectedPreview.url && (
                                            <div className='attachment-main-preview-image'>
                                                <Image src={selectedPreview.url} alt={selectedPreview.file.name} />
                                            </div>
                                        )}
                                        {selectedPreview.type === 'video' && selectedPreview.url && (
                                            <div className='attachment-main-preview-video'>
                                                <video src={selectedPreview.url} controls />
                                            </div>
                                        )}
                                        {selectedPreview.type === 'pdf' && (
                                            <div className='attachment-main-preview-file'>
                                                <BsFileEarmarkPdf className='attachment-main-file-icon' />
                                                <span className='attachment-main-file-name'>{selectedPreview.file.name}</span>
                                            </div>
                                        )}
                                        {selectedPreview.type === 'other' && (
                                            <div className='attachment-main-preview-file'>
                                                <MdInsertDriveFile className='attachment-main-file-icon' />
                                                <span className='attachment-main-file-name'>{selectedPreview.file.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {attachmentPreviews?.map((preview, index) => (
                                    <div
                                        key={index}
                                        className={`attachment-preview-item ${selectedPreviewIndex === index ? 'active' : ''}`}
                                        onClick={() => setSelectedPreviewIndex(index)}
                                    >
                                        {preview.type === 'image' && preview.url && (
                                            <div className='attachment-preview-image'>
                                                <Image src={preview.url} alt={preview.file.name} />

                                            </div>
                                        )}
                                        {preview.type === 'video' && preview.url && (
                                            <div className='attachment-preview-video'>
                                                <video src={preview.url} controls={false} />

                                            </div>
                                        )}
                                        {preview.type === 'pdf' && (
                                            <div className='attachment-preview-file'>
                                                <BsFileEarmarkPdf className='attachment-file-icon' />

                                            </div>
                                        )}
                                        {preview.type === 'other' && (
                                            <div className='attachment-preview-file'>
                                                <MdInsertDriveFile className='attachment-file-icon' />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    <div className='chat-input-attechmaint-section'>
                        <div className='chat-input-wrapper'>
                            <input
                                type="file"
                                id="chat-attachment"
                                multiple
                                accept="image/*,video/*,.pdf,.doc,.docx"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className='chat-attachment-btn'
                                onClick={() => document.getElementById('chat-attachment').click()}
                            >
                                <RiAttachment2 />
                            </button>
                            <input
                                type="text"
                                className='chat-message-input'
                                placeholder='Type your message...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className='chat-send-btn'
                                onClick={handleSendMessage}
                                disabled={!message.trim() && attachments.length === 0}
                            >
                                <IoSend />
                            </button>
                        </div>

                    </div>
                </div> :
                    <div className='chat-container'>
                        <div className='chat-not-selected'>

                            <div className='chat-not-selected-icon'>
                            <PiWechatLogoLight className='chat-not-selected-icon-icon' />
                                <h2 className='m-0'>Select a chat to start</h2>
                                <p className='m-0'>Start a conversation with a customer by selecting a chat from the list.</p>
                            </div>

                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

export default Chat