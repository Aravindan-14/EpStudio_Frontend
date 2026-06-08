import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { DataContext } from "../Contexts/DataContext";
import io from "socket.io-client";
import { baseURL } from "../../Utils/ServerUrl";
import { 
  Send, 
  Search, 
  MessageSquare, 
  MoreVertical, 
  Smile, 
  User, 
  Phone, 
  Video, 
  ChevronLeft,
  Paperclip,
  Mic,
  Square,
  Trash2,
  FileCode,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Play,
  Pause,
  Check,
  CheckCheck
} from "lucide-react";

const SOCKET_SERVER_URL = `${baseURL}`;

function Message() {
  const { users } = useContext(DataContext);
  const [chatList, setChatList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState(null);
  const chatEndRef = useRef(null);

  // Attachments States
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);

  // Voice recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordingIntervalRef = useRef(null);

  // Online / Last seen status states
  const [currentUserStatus, setCurrentUserStatus] = useState({ is_online: false, last_seen: null });

  // Fetch all chat directories
  useEffect(() => {
    const fetchSenderChatId = async () => {
      try {
        const res = await axios.post(`${baseURL}/chat/getAllChatId`, {
          id: users.id,
        });
        setChatList(res.data.data || []);
      } catch (error) {
        console.error("Error fetching sender chat ID:", error);
      }
    };
    if (users?.id) {
      fetchSenderChatId();
    }
  }, [users?.id]);

  // Fetch message history for selected user
  useEffect(() => {
    const fetchMyMessage = async () => {
      if (!currentUser?.chat_ID) return;
      try {
        const res = await axios.post(`${baseURL}/chat/getMyMessage`, { 
          chat_ID: currentUser.chat_ID 
        });
        setMessages(res.data.data || []);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMyMessage();
  }, [currentUser]);

  // Fetch status (online/last seen) of the counterparty
  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!currentUser?.sender_ID) return;
      try {
        const res = await axios.post(`${baseURL}/chat/getUserStatus`, {
          userId: currentUser.sender_ID
        });
        if (res.data.status === 200) {
          setCurrentUserStatus(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user status:", err);
      }
    };
    fetchUserStatus();
  }, [currentUser]);

  // Handle Socket communication
  useEffect(() => {
    if (!currentUser?.chat_ID) return;

    const socketIo = io.connect(SOCKET_SERVER_URL, {
      query: { userId: users.id },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    setSocket(socketIo);

    // Join room
    socketIo.emit("join room", currentUser.chat_ID);

    // Listen for incoming messages
    socketIo.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
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

    // Listen for real-time user status updates
    socketIo.on("status update", (data) => {
      if (String(data.userId) === String(currentUser.sender_ID)) {
        setCurrentUserStatus({
          is_online: data.isOnline,
          last_seen: data.lastSeen
        });
      }
    });

    socketIo.on("reconnect", (attemptNumber) => {
      console.log(`Socket reconnected: attempt ${attemptNumber}`);
      socketIo.emit("join room", currentUser.chat_ID);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [currentUser?.chat_ID, currentUser?.sender_ID, users?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
              receiver_ID: currentUser.sender_ID,
              message: "",
              chat_ID: currentUser.chat_ID,
              media: JSON.stringify(res.data.files),
            };
            socket.emit("chat message", currentUser.chat_ID, messageData);
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

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((message.trim() || selectedAttachments.length > 0) && socket && currentUser?.chat_ID) {
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

      const messageData = {
        sender_ID: users.id,
        receiver_ID: currentUser.sender_ID,
        message: message,
        chat_ID: currentUser.chat_ID,
        media: uploadedMedia.length > 0 ? JSON.stringify(uploadedMedia) : null,
      };

      socket.emit("chat message", currentUser.chat_ID, messageData);
      setMessage("");
      setSelectedAttachments([]);
      setAttachmentPreviews([]);
      scrollToBottom();
    }
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "offline";
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
      return `today at ${timeString}`;
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return `yesterday at ${timeString}`;
    } else {
      const dateString = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return `on ${dateString} at ${timeString}`;
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
        return <CheckCheck className="h-3.5 w-3.5 text-violet-200" />;
      case "sent":
      default:
        return <Check className="h-3 w-3 text-violet-200" />;
    }
  };

  // Filter conversations
  const filteredChatList = chatList.filter((chat) =>
    chat.senderName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parse media payloads helper
  const parseMedia = (mediaStr) => {
    try {
      return JSON.parse(mediaStr) || [];
    } catch (e) {
      return [];
    }
  };

  // Format recording seconds
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <div className="h-[calc(100vh-7rem)] w-full flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* 1. Conversations Sidebar */}
      <div className={`w-80 h-full flex flex-col border-r border-slate-100 bg-slate-50/50 ${currentUser.chat_ID ? "hidden md:flex" : "flex"}`}>
        <div className="p-5 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <MessageSquare size={18} className="text-violet-600" />
            Inbox
          </h3>
          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full bg-slate-50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredChatList.length > 0 ? (
            filteredChatList.map((list) => {
              const isActive = currentUser.chat_ID === list.chat_ID;
              return (
                <div
                  key={list.chat_ID}
                  onClick={() => setCurrentUser(list)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-white border-slate-100 hover:border-slate-200 text-slate-700 shadow-sm"
                  }`}
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner uppercase ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-gradient-to-tr from-violet-100 to-indigo-100 text-indigo-600"
                  }`}>
                    {list.senderName ? list.senderName.charAt(0) : "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate max-w-28">
                        {list.senderName}
                      </span>
                      <span className={`text-[10px] ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                        Active
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? "text-violet-100" : "text-slate-400"}`}>
                      Tap to open messages
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p className="text-xs font-semibold">No discussions found</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Message History Pane */}
      <div className={`flex-1 min-w-0 h-full flex flex-col bg-slate-50/30 ${!currentUser.chat_ID ? "hidden md:flex justify-center items-center" : "flex"}`}>
        {currentUser.chat_ID ? (
          <>
            {/* Active Chat Header */}
            <div className="h-16 border-b border-slate-200 bg-white flex justify-between items-center px-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentUser({})}
                  className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.senderName ? currentUser.senderName.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block">
                    {currentUser.senderName}
                  </span>
                  {currentUserStatus.is_online ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                      {currentUserStatus.last_seen ? `last seen ${formatLastSeen(currentUserStatus.last_seen)}` : "offline"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-50 rounded-xl hover:text-slate-600 transition-colors">
                  <Phone size={16} />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-xl hover:text-slate-600 transition-colors">
                  <Video size={16} />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-xl hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender_ID === users.id;
                const attachments = parseMedia(msg.media);
                const visualAttachments = attachments.filter(item => item.type === "image" || item.type === "video");
                const otherAttachments = attachments.filter(item => item.type !== "image" && item.type !== "video");
                return (
                  <div
                    key={idx}
                    className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3.5 px-4 rounded-2xl shadow-sm text-sm flex flex-col gap-2 ${
                        isAdmin
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none"
                          : "bg-white text-slate-800 rounded-tl-none border border-slate-150"
                      }`}
                    >
                      {/* Text content if present */}
                      {msg.message && <p className="leading-relaxed break-words">{msg.message}</p>}

                      {/* Media Attachments */}
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
                                  darkTheme={isAdmin}
                                />
                              );
                            } else {
                              return (
                                <a
                                  key={mIdx}
                                  href={mediaURL}
                                  download
                                  className="flex items-center gap-2 underline text-xs font-bold break-all"
                                >
                                  <FileCode size={14} /> Download {item.name}
                                </a>
                              );
                            }
                          })}
                        </div>
                      )}

                      {/* Timestamp and status ticks */}
                      <div className={`self-end flex items-center gap-0.5 text-[9px] mt-1 select-none font-medium ${isAdmin ? "text-violet-200" : "text-slate-400"}`}>
                        <span>{formatMessageTime(msg.date_Time)}</span>
                        {isAdmin && (
                          <span className="inline-flex">
                            {renderTicks(msg.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 md:p-4 bg-white border-t border-slate-200">
              {/* Attachment Previews Bar */}
              {attachmentPreviews.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-3 mb-3 border-b border-slate-100 scrollbar-none">
                  {attachmentPreviews.map((preview, index) => (
                    <div key={index} className="h-20 w-20 rounded-xl border border-slate-200 bg-slate-50 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {preview.type === "image" ? (
                        <img src={preview.url} alt="" className="h-full w-full object-cover" />
                      ) : preview.type === "video" ? (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <VideoIcon size={18} />
                          <span className="text-[9px] truncate max-w-16 mt-0.5">{preview.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <FileCode size={18} />
                          <span className="text-[9px] truncate max-w-16 mt-0.5">{preview.name}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 shadow-md border border-white hover:bg-rose-600 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isRecording ? (
                /* Recording Mode UI */
                <div className="flex items-center justify-between p-2.5 px-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-wider uppercase">Recording Audio: {formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-500 hover:text-rose-700 transition-colors"
                      title="Cancel Recording"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-bold"
                      title="Send Voice Message"
                    >
                      <Square size={12} fill="white" /> Stop & Send
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Send Mode UI */
                <form onSubmit={sendMessage} className="flex items-center gap-2 md:gap-3">
                  <input
                    type="file"
                    multiple
                    id="chatMediaInput"
                    onChange={handleAttachmentChange}
                    className="hidden"
                    accept="image/*,video/*,audio/*"
                  />
                  <button 
                    type="button" 
                    onClick={() => document.getElementById("chatMediaInput").click()}
                    className="p-2 md:p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    title="Select Attachments"
                  >
                    <Paperclip size={20} />
                  </button>

                  <button 
                    type="button" 
                    onClick={startRecording}
                    className="p-2 md:p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    title="Record Voice Message"
                  >
                    <Mic size={20} />
                  </button>

                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={selectedAttachments.length > 0 ? "Add a description..." : "Write a message..."}
                    className="flex-1 min-w-0 py-2.5 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-slate-50 transition-all"
                    type="text"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() && selectedAttachments.length === 0}
                    className="h-10 w-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-violet-600 shadow-md shadow-violet-600/10"
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-8 text-slate-400 max-w-sm">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-5 shadow-inner">
              <MessageSquare size={28} className="stroke-1" />
            </div>
            <h3 className="text-slate-700 font-bold text-base">Select a conversation</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Choose a buyer thread from the sidebar to inspect requests, manage custom quotes, and chat live.
            </p>
          </div>
        )}
      </div>
    </div>
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
            ? "bg-white text-violet-600 hover:bg-slate-100" 
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
        darkTheme ? "text-violet-200" : "text-slate-500"
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

export default Message;
