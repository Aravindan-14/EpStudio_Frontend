import { useState, useContext, useEffect, useRef } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { DataContext } from "../Contexts/DataContext";
import axios from "axios";
import io from "socket.io-client";
import profile from "../../Assets/commenAssets/EPLogo.png";
import { baseURL } from "../../Utils/ServerUrl";
import {
  Send,
  Paperclip,
  Mic,
  Square,
  Trash2,
  FileCode,
  Video as VideoIcon,
  X,
  Play,
  Pause,
  Check,
  CheckCheck
} from "lucide-react";
const SOCKET_SERVER_URL = `${baseURL}`;

export default function Example() {
  const { users, open, setOpen } = useContext(DataContext);
  const [senderChatId, setSenderChatId] = useState({});
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  // Attachments States
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);

  // Voice recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordingIntervalRef = useRef(null);

  // Admin status states
  const [adminStatus, setAdminStatus] = useState({ is_online: false, last_seen: null });


  //start



  const [savedMessages, setSavedMessages] = useState([]);
  const [draggedMessage, setDraggedMessage] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log(savedMessages)
  }, [savedMessages])

  const handleDragStart = (e, message) => {
    setSavedMessages([])
    setDraggedMessage(message);
    const rect = e.target.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDrag = (e) => {
    if (!draggedMessage) return;

    // Prevent default behavior to avoid any vertical movement
    e.preventDefault();
  };

  const handleDragEnd = (e, message) => {
    const dragDistance =
      e.clientX - (e.target.getBoundingClientRect().left + dragOffset.x);

    // If dragged more than 100px to the right, save the message
    if (dragDistance > 100) {
      setSavedMessages((prev) => {
        // Check if message is already saved
        if (!prev.find((msg) => msg.id === message.id)) {
          return [...prev, message];
        }
        return prev;
      });
    }

    setDraggedMessage(null);
    setDragOffset({ x: 0, y: 0 });
  };


  //end


  useEffect(() => {
    const fetchSenderChatId = async () => {
      try {
        const res = await axios.post(
          `${baseURL}/chat/getSenderChatId`,
          {
            id: users.id,
          }
        );
        setSenderChatId(res.data.data[0][0]);
      } catch (error) {
        console.error("Error fetching sender chat ID:", error);
      }
    };

    fetchSenderChatId();
  }, [users.id, chatOpen]);

  useEffect(() => {
    const fetchMyMessage = async () => {
      try {
        const res = await axios.post(
          `${baseURL}/chat/getMyMessage`,
          { chat_ID: senderChatId.chat_ID }
        );
        setMessages(res.data.data);
        console.log(res.data.data, "all messages");
      } catch (error) {
        console.error("internal Server Error :", error);
      }
    };

    fetchMyMessage();
  }, [senderChatId]);

  // Fetch admin status
  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (!senderChatId?.receiver_ID) return;
      try {
        const res = await axios.post(`${baseURL}/chat/getUserStatus`, {
          userId: senderChatId.receiver_ID
        });
        if (res.data.status === 200) {
          setAdminStatus(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin status:", err);
      }
    };
    fetchAdminStatus();
  }, [senderChatId]);

  console.log(senderChatId, "sender id ");
  console.log(messages, "sender id ");

  useEffect(() => {
    const socketIo = io.connect(SOCKET_SERVER_URL, {
      query: { userId: users.id },
      reconnection: true, // Enable reconnection (default is true)
      reconnectionAttempts: Infinity, // Set the maximum number of reconnection attempts
      reconnectionDelay: 1000, // Initial delay before reconnecting (in ms)
      reconnectionDelayMax: 5000, // Maximum delay before reconnecting (in ms)
      timeout: 20000, // Connection timeout (in ms)
    });

    // Save the socket instance
    setSocket(socketIo);

    // Listen for messages
    socketIo.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      setTimeout(() => {
        var objDiv = document.getElementById("chat-area");
        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
      }, 100);
    });

    // Listen for real-time status transitions of messages
    socketIo.on("messages delivered", (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.status === "sent" ? { ...msg, status: "delivered" } : msg
        )
      );
    });

    socketIo.on("messages seen", (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.status === "sent" || msg.status === "delivered"
            ? { ...msg, status: "seen" }
            : msg
        )
      );
    });

    // Listen for user status updates
    socketIo.on("status update", (data) => {
      if (senderChatId?.receiver_ID && String(data.userId) === String(senderChatId.receiver_ID)) {
        setAdminStatus({
          is_online: data.isOnline,
          last_seen: data.lastSeen
        });
      }
    });

    // Handle reconnection
    socketIo.on("reconnect", (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempt(s)`);
    });

    socketIo.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    socketIo.on("reconnect_failed", () => {
      console.error("Reconnection failed");
    });

    return () => {
      socketIo.disconnect();
    };
  }, [senderChatId, users?.id]);

  useEffect(() => {
    if (!socket || !senderChatId?.chat_ID) return;

    if (open) {
      socket.emit("join room", senderChatId.chat_ID);
    } else {
      socket.emit("leave room", senderChatId.chat_ID);
    }
  }, [open, senderChatId?.chat_ID, socket]);

  // Helper to parse media JSON
  const parseMedia = (mediaStr) => {
    try {
      return JSON.parse(mediaStr) || [];
    } catch (e) {
      return [];
    }
  };

  // Helper to format recording timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Offline";
    const date = new Date(timestamp);
    const now = new Date();
    
    // Clear time to compare dates strictly
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const timeString = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    
    if (compareDate.getTime() === today.getTime()) {
      return `Last seen today at ${timeString}`;
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return `Last seen yesterday at ${timeString}`;
    } else {
      const dateString = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return `Last seen on ${dateString} at ${timeString}`;
    }
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).toUpperCase().replace(/\s+/g, "");
  };

  const renderTicks = (status) => {
    switch (status) {
      case "seen":
        return <CheckCheck className="h-3.5 w-3.5 text-green-500" />;
      case "delivered":
        return <CheckCheck className="h-3.5 w-3.5 text-blue-200" />;
      case "sent":
      default:
        return <Check className="h-3 w-3 text-blue-200" />;
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedAttachments((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file",
      url: URL.createObjectURL(file)
    }));

    setAttachmentPreviews((prev) => [...prev, ...previews]);
  };

  const removeAttachment = (indexToRemove) => {
    setSelectedAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setAttachmentPreviews((prev) => {
      const item = prev[indexToRemove];
      if (item && item.url) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: "audio/webm" });

        try {
          const formData = new FormData();
          formData.append("Chat_media", audioFile);
          const res = await axios.post(`${baseURL}/chat/upload`, formData);

          if (res.status === 200 && res.data.files) {
            const messageData = {
              sender_ID: users.id,
              receiver_ID: senderChatId.receiver_ID,
              message: "",
              chat_ID: senderChatId.chat_ID,
              media: JSON.stringify(res.data.files),
            };
            socket.emit("chat message", senderChatId.chat_ID, messageData);
          }
        } catch (err) {
          console.error("Failed to upload voice message:", err);
        }

        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access failed:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  // Send message to the server (with media upload if applicable)
  const sendMessage = async (e) => {
    e?.preventDefault();

    if ((message.trim() || selectedAttachments.length > 0) && socket && senderChatId?.chat_ID) {
      let uploadedMedia = [];

      if (selectedAttachments.length > 0) {
        try {
          const formData = new FormData();
          selectedAttachments.forEach((file) => {
            formData.append("Chat_media", file);
          });
          const res = await axios.post(`${baseURL}/chat/upload`, formData);
          if (res.status === 200 && res.data.files) {
            uploadedMedia = res.data.files;
          }
        } catch (err) {
          console.error("Attachment upload failed:", err);
          return;
        }
      }

      const messgedata = {
        sender_ID: users.id,
        receiver_ID: senderChatId.receiver_ID,
        message: message,
        chat_ID: senderChatId.chat_ID,
        media: uploadedMedia.length > 0 ? JSON.stringify(uploadedMedia) : null,
      };

      socket.emit("chat message", senderChatId.chat_ID, messgedata);
      setMessage(""); // Clear the input field
      setSelectedAttachments([]);
      setAttachmentPreviews([]);
    }

    setTimeout(() => {
      var objDiv = document.getElementById("chat-area");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }, 100);
  };

  const scrollDown = () => {
    var objDiv = document.getElementById("chat-area");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  const CreateChatID = async () => {
    const Data = {
      chat_ID: "CHAT" + users.id + 16,
      sender_ID: users.id,
      receiver_ID: 16,
    };

    const res = await axios.post(
      `${baseURL}/chat/CreateChatID`,
      Data
    );

    if (res.status === 200) {
      setChatOpen(true)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage()
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0 w-screen"
      />

      <div className="fixed inset-0 overflow-hidden h-screen">
        <div className="absolute inset-0 overflow-hidden h-screen">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full  h-full">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-screen md:max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700 bg-slate-50 shadow-2xl"
            >
              <div className="flex h-full flex-col bg-slate-50 overflow-hidden shadow-xl">
                {senderChatId || chatOpen ? (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="w-full h-20 flex justify-between items-center p-4 border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-100 shadow-inner relative flex-shrink-0">
                          <img
                            className="object-cover h-full w-full"
                            src={profile}
                            alt="EP Studio Logo"
                          />
                          {adminStatus.is_online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">EP Studio</span>
                          {adminStatus.is_online ? (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Online
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {formatLastSeen(adminStatus.last_seen)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Close Chat"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Chat Area Container */}
                    <div className="flex-1 overflow-hidden relative bg-slate-50 flex flex-col p-4">
                      <div
                        id="chat-area"
                        className="flex-1 overflow-y-auto space-y-4 scrollbar-none flex flex-col"
                      >
                        {messages.map((msg, index) => {
                          const attachments = parseMedia(msg.media);
                          const visualAttachments = attachments.filter(item => item.type === "image" || item.type === "video");
                          const otherAttachments = attachments.filter(item => item.type !== "image" && item.type !== "video");
                          return (
                            <div
                              key={msg.id || index}
                              className={`w-full flex ${String(msg.sender_ID) === String(users.id)
                                ? "justify-end"
                                : "justify-start"
                                }`}
                            >
                              {String(msg.sender_ID) === String(users.id) ? (
                                <div 
                                  draggable
                                  onDrag={handleDrag}
                                  onDragStart={(e) => handleDragStart(e, msg.message || "Media Attachment")}
                                  onDragEnd={(e) => handleDragEnd(e, msg.message || "Media Attachment")} 
                                  className="relative rounded-2xl rounded-tr-none text-xs bg-gradient-to-br from-blue-600 to-indigo-600 w-fit h-fit max-w-[75%] mr-1 text-white p-3 mt-1 text-start font-medium flex flex-col gap-1.5 shadow-sm border border-blue-500/10"
                                >
                                  {msg.message && <p className="leading-relaxed break-words">{msg.message}</p>}
                                  {attachments.length > 0 && (
                                    <div className="space-y-2 mt-1">
                                      <MediaGrid items={visualAttachments} />
                                      {otherAttachments.map((item, mIdx) => {
                                        const mediaURL = `${baseURL}/public/Chat/${item.url}`;
                                        if (item.type === "audio") {
                                          return (
                                            <VoicePlayer
                                              key={mIdx}
                                              src={mediaURL}
                                              darkTheme={true}
                                            />
                                          );
                                        } else {
                                          return (
                                            <a
                                              key={mIdx}
                                              href={mediaURL}
                                              download
                                              className="flex items-center gap-1.5 underline text-[10px] font-bold break-all text-blue-200 hover:text-white"
                                            >
                                              <FileCode size={12} /> Download {item.name}
                                            </a>
                                          );
                                        }
                                      })}
                                    </div>
                                  )}

                                  {/* Timestamp and status ticks */}
                                  <div className="self-end flex items-center gap-0.5 text-[9px] mt-1 select-none font-medium text-blue-200/90">
                                    <span>{formatMessageTime(msg.date_Time)}</span>
                                    <span className="inline-flex font-normal">
                                      {renderTicks(msg.status)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  draggable
                                  onDrag={handleDrag}
                                  onDragStart={(e) => handleDragStart(e, msg.message || "Media Attachment")}
                                  onDragEnd={(e) => handleDragEnd(e, msg.message || "Media Attachment")}
                                  className="my-1 relative rounded-2xl rounded-tl-none text-xs bg-white text-slate-800 w-fit h-fit max-w-[75%] ml-1 p-3 font-medium flex flex-col gap-1.5 shadow-sm border border-slate-100"
                                >
                                  {msg.message && <p className="leading-relaxed break-words">{msg.message}</p>}
                                  {attachments.length > 0 && (
                                    <div className="space-y-2 mt-1">
                                      <MediaGrid items={visualAttachments} />
                                      {otherAttachments.map((item, mIdx) => {
                                        const mediaURL = `${baseURL}/public/Chat/${item.url}`;
                                        if (item.type === "audio") {
                                          return (
                                            <VoicePlayer
                                              key={mIdx}
                                              src={mediaURL}
                                              darkTheme={false}
                                            />
                                          );
                                        } else {
                                          return (
                                            <a
                                              key={mIdx}
                                              href={mediaURL}
                                              download
                                              className="flex items-center gap-1.5 underline text-[10px] font-bold break-all text-blue-600 hover:text-blue-700"
                                            >
                                              <FileCode size={12} /> Download {item.name}
                                            </a>
                                          );
                                        }
                                      })}
                                    </div>
                                  )}

                                  {/* Timestamp */}
                                  <div className="self-end text-[9px] mt-1 select-none font-medium text-slate-400">
                                    {formatMessageTime(msg.date_Time)}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col w-full relative bg-white border-t border-slate-100">
                      <div
                        onClick={scrollDown}
                        className="absolute -top-5 left-0 flex justify-center w-full text-white/50 z-10"
                      >
                        <i className="fa-solid fa-angles-down cursor-pointer bg-slate-800/40 p-1 rounded-full text-xs"></i>
                      </div>

                      {/* Saved message preview */}
                      {savedMessages.length > 0 && (
                        <div className="absolute bg-white -top-12 w-[95%] p-3 z-10">
                          <div className="bg-gray-200 text-xs p-2 rounded">{savedMessages}</div>
                        </div>
                      )}

                      {/* Attachment Previews Bar */}
                      {attachmentPreviews.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 pt-2 px-3 border-b border-slate-100 bg-slate-50">
                          {attachmentPreviews.map((preview, index) => (
                            <div key={index} className="h-16 w-16 rounded-lg border border-slate-200 bg-white relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {preview.type === "image" ? (
                                <img src={preview.url} alt="" className="h-full w-full object-cover" />
                              ) : preview.type === "video" ? (
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                  <VideoIcon size={16} />
                                  <span className="text-[8px] truncate max-w-12 mt-0.5">{preview.name}</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                  <FileCode size={16} />
                                  <span className="text-[8px] truncate max-w-12 mt-0.5">{preview.name}</span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="absolute top-0.5 right-0.5 bg-rose-500 text-white rounded-full p-0.5 shadow-md border border-white hover:bg-rose-600 transition-colors"
                              >
                                <X size={8} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {isRecording ? (
                        /* Recording Mode UI */
                        <div className="flex items-center justify-between p-2.5 px-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 m-2">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                            <span className="text-[11px] font-bold uppercase tracking-wider">Recording: {formatTime(recordingTime)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={cancelRecording}
                              className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-500 hover:text-rose-700 transition-colors"
                              title="Cancel Recording"
                            >
                              <Trash2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="p-1.5 px-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1 text-[10px] font-bold"
                              title="Send Voice Message"
                            >
                              <Square size={10} fill="white" /> Stop & Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Regular Input Form */
                        <div className="flex items-center w-full p-3 gap-2">
                          <input
                            type="file"
                            multiple
                            id="clientChatMediaInput"
                            onChange={handleAttachmentChange}
                            className="hidden"
                            accept="image/*,video/*,audio/*"
                          />
                          <button 
                            type="button" 
                            onClick={() => document.getElementById("clientChatMediaInput").click()}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                            title="Select Attachments"
                          >
                            <Paperclip size={18} />
                          </button>

                          <button 
                            type="button" 
                            onClick={startRecording}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                            title="Record Voice Message"
                          >
                            <Mic size={18} />
                          </button>

                          <input
                            placeholder={selectedAttachments.length > 0 ? "Add details..." : "Type your message..."}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 h-10 px-4 outline-none bg-slate-100 rounded-lg text-xs"
                          />
                          <button
                            disabled={!message.trim() && selectedAttachments.length === 0}
                            onClick={sendMessage}
                            className="bg-blue-500 hover:bg-blue-600 h-10 w-12 rounded-lg text-white flex items-center justify-center disabled:opacity-40 transition-colors"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <p>Do You Need Chat Support</p>
                    <div className="flex gap-5 mt-10">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 p-2 rounded w-20 text-white font-bold"
                        onClick={CreateChatID}
                      >
                        Yes
                      </button>
                      <button
                        className="bg-blue-200 hover:bg-blue-300 p-2 w-20 rounded text-white font-bold"
                        onClick={() => setOpen(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

const VoicePlayer = ({ src, darkTheme = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Waveform heights to match mockup
  const barHeights = [
    6, 10, 14, 18, 12, 8, 12, 16, 24, 20, 
    14, 10, 16, 22, 28, 22, 16, 12, 18, 24, 
    16, 10, 8, 12, 16, 12, 8, 6
  ];

  const handleWaveformClick = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickFraction = Math.max(0, Math.min(1, clickX / width));
    audioRef.current.currentTime = clickFraction * duration;
    setCurrentTime(clickFraction * duration);
  };

  const formatAudioTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const progress = duration ? currentTime / duration : 0;

  return (
    <div className="flex items-center gap-3 bg-transparent select-none py-1">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={togglePlay}
        className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-all active:scale-90 flex-shrink-0 ${
          darkTheme 
            ? "bg-white text-blue-600 hover:bg-slate-100" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isPlaying ? (
          <Pause size={14} fill="currentColor" />
        ) : (
          <Play size={14} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      <div 
        onClick={handleWaveformClick}
        className="flex items-center gap-[3px] w-[140px] sm:w-[180px] h-8 cursor-pointer relative"
      >
        {barHeights.map((height, idx) => {
          const barFraction = idx / barHeights.length;
          const isPlayed = barFraction <= progress;
          return (
            <div
              key={idx}
              style={{ height: `${height}px` }}
              className={`w-[3px] rounded-full transition-colors duration-150 ${
                isPlayed 
                  ? (darkTheme ? "bg-white" : "bg-slate-800") 
                  : (darkTheme ? "bg-white/40" : "bg-slate-300")
              }`}
            />
          );
        })}
      </div>

      <span className={`text-[10px] font-semibold min-w-[28px] text-right ${
        darkTheme ? "text-blue-100" : "text-slate-500"
      }`}>
        {formatAudioTime(isPlaying ? currentTime : (duration || 0))}
      </span>
    </div>
  );
};

const MediaGrid = ({ items }) => {
  if (!items || items.length === 0) return null;

  const renderMediaItem = (item, customClass = "") => {
    const mediaURL = `${baseURL}/public/Chat/${item.url}`;
    if (item.type === "image") {
      return (
        <a href={mediaURL} target="_blank" rel="noreferrer" className="block w-full h-full">
          <img
            src={mediaURL}
            alt={item.name}
            className={`w-full h-full object-cover ${customClass}`}
          />
        </a>
      );
    } else if (item.type === "video") {
      return (
        <a href={mediaURL} target="_blank" rel="noreferrer" className="block w-full h-full relative bg-slate-950 flex items-center justify-center">
          <video
            src={mediaURL}
            className={`w-full h-full object-cover opacity-80 ${customClass}`}
          />
          <div className="absolute bg-black/45 rounded-full p-2 text-white pointer-events-none shadow-md">
            <Play size={14} fill="currentColor" className="ml-0.5" />
          </div>
        </a>
      );
    }
    return null;
  };

  const total = items.length;

  if (total === 1) {
    const item = items[0];
    const mediaURL = `${baseURL}/public/Chat/${item.url}`;
    if (item.type === "video") {
      return (
        <video
          src={mediaURL}
          controls
          className="w-full max-w-[240px] rounded-xl shadow-sm border border-slate-200"
        />
      );
    }
    return (
      <a href={mediaURL} target="_blank" rel="noreferrer" className="block w-full max-w-[240px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <img
          src={mediaURL}
          alt={item.name}
          className="max-h-64 w-full object-contain"
        />
      </a>
    );
  }

  if (total === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full max-w-[240px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="w-full aspect-square">{renderMediaItem(items[0], "w-full h-full object-cover")}</div>
        <div className="w-full aspect-square">{renderMediaItem(items[1], "w-full h-full object-cover")}</div>
      </div>
    );
  }

  if (total === 3) {
    return (
      <div className="grid grid-cols-3 gap-1 w-full max-w-[240px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="w-full aspect-square">{renderMediaItem(items[0], "w-full h-full object-cover")}</div>
        <div className="w-full aspect-square">{renderMediaItem(items[1], "w-full h-full object-cover")}</div>
        <div className="w-full aspect-square">{renderMediaItem(items[2], "w-full h-full object-cover")}</div>
      </div>
    );
  }

  // 4 or more items
  const remainingCount = total - 3;
  return (
    <div className="grid grid-cols-2 gap-1 w-full max-w-[240px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="w-full aspect-square">{renderMediaItem(items[0], "w-full h-full object-cover")}</div>
      <div className="w-full aspect-square">{renderMediaItem(items[1], "w-full h-full object-cover")}</div>
      <div className="w-full aspect-square">{renderMediaItem(items[2], "w-full h-full object-cover")}</div>
      <div className="relative w-full aspect-square">
        {renderMediaItem(items[3], "w-full h-full object-cover")}
        {total > 4 && (
          <a 
            href={`${baseURL}/public/Chat/${items[3].url}`} 
            target="_blank" 
            rel="noreferrer"
            className="absolute inset-0 bg-black/65 flex items-center justify-center text-white text-base font-bold hover:bg-black/55 transition-colors"
          >
            +{remainingCount}
          </a>
        )}
      </div>
    </div>
  );
};
