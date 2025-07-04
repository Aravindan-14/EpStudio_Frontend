import { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DataContext } from "../Contexts/DataContext";
import axios from "axios";
import io from "socket.io-client";
import profile from "../../Assets/commenAssets/EPLogo.png";
import { baseURL } from "../../Utils/ServerUrl";
const SOCKET_SERVER_URL = `${baseURL}`;

export default function Example() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);
  const [senderChatId, setSenderChatId] = useState({});
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);


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

  console.log(senderChatId, "sender id ");
  console.log(messages, "sender id ");

  useEffect(() => {
    const socketIo = io.connect(SOCKET_SERVER_URL, {
      reconnection: true, // Enable reconnection (default is true)
      reconnectionAttempts: Infinity, // Set the maximum number of reconnection attempts
      reconnectionDelay: 1000, // Initial delay before reconnecting (in ms)
      reconnectionDelayMax: 5000, // Maximum delay before reconnecting (in ms)
      timeout: 20000, // Connection timeout (in ms)
    });

    // Save the socket instance
    setSocket(socketIo);

    // Join the room when the component mounts
    senderChatId && socketIo.emit("join room", senderChatId.chat_ID);

    // Listen for messages
    socketIo.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      setTimeout(() => {
        var objDiv = document.getElementById("chat-area");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 100);
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
  }, [senderChatId]);

  // Send message to the server
  const sendMessage = (e) => {
    e?.preventDefault();

    if (message.trim() && socket) {
      const messgedata = {
        sender_ID: users.id,
        receiver_ID: senderChatId.receiver_ID,
        message: message,
        chat_ID: senderChatId.chat_ID,
      };
      socket.emit("chat message", senderChatId.chat_ID, messgedata); // Pass the room ID
      setMessage(""); // Clear the input field
    }

    setTimeout(() => {
      var objDiv = document.getElementById("chat-area");
      objDiv.scrollTop = objDiv.scrollHeight;
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
              className="pointer-events-auto relative w-screen max-w-screen md:max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700 bg-amber-200"
            >
              <div className="flex h-full screen flex-col overflow-y-scroll bg-white py-3 shadow-xl">
                {senderChatId || chatOpen ? (
                  <div className="flex flex-col h-full">
                    <div className="px-4 sm:px-6">
                      <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                        <div className="w-full  h-20 flex justify-start items-center gap-5 p-2">
                          <div className="h-12 overflow-hidden w-12 rounded-full bg-red-100">
                            <img
                              className="object-cover"
                              src={profile}
                              alt=""
                            />
                          </div>
                          <div>
                            <p>EP Studio </p>
                            <span>Online</span>
                          </div>
                        </div>
                        <hr className="w-full h-0 bg-slate-100" />
                      </DialogTitle>
                    </div>
                    <div className="relative mt-2 h-full flex-1 px-4 sm:px-6">
                      <div className="w-full h-[80vh] md:h-[77vh] bg-gradient-to-r from-blue-200 to-blue-300">
                        <div
                          // scrollbar-custom
                          id="chat-area"
                          className={`h-full w-full mb-1 flex flex-col overflow-auto scrollbar-none p-2 ${true ? "items-end" : "items-start"
                            } `}
                        >
                          {messages.map((msg) => {
                            return (
                              <div
                                className={`w-full  flex ${msg.sender_ID == users.id
                                  ? "justify-end"
                                  : "justify-start"
                                  }`}
                              >
                                {msg.sender_ID == users.id ? (
                                  <div draggable
                                    onDrag={handleDrag}
                                    onDragStart={(e) => handleDragStart(e, msg.message)}
                                    onDragEnd={(e) => handleDragEnd(e, msg.message)} className="relative rounded-l-xl rounded-br-xl text-xs bg-gradient-to-r from-blue-700 to-blue-900 w-fit h-fit mr-2 text-white p-2 mt-1 text-start font-semibold">
                                    <p>{msg.message}</p>
                                    <p></p>
                                    <div
                                      class="absolute top-0 -right-1 w-0 h-0 
      border-t-[0px] border-t-transparent
      border-l-[10px] border-l-blue-900
      border-b-[10px] border-b-transparent"
                                    ></div>
                                  </div>
                                ) : (
                                  <div
                                    draggable
                                    onDrag={handleDrag}
                                    onDragStart={(e) => handleDragStart(e, msg.message)}
                                    onDragEnd={(e) => handleDragEnd(e, msg.message)}
                                    className="my-1 relative rounded-r-xl rounded-bl-xl text-xs bg-gradient-to-r from-blue-700 to-blue-900 text-white w-fit h-fit ml-2 p-2 font-semibold">
                                    <p>{msg.message}</p>
                                    <p></p>
                                    <div
                                      className="absolute top-0 -left-1 w-0 h-0 
border-l-[10px] border-l-transparent
border-t-[12px] border-t-blue-700
border-r-[0px] border-r-transparent"
                                    ></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full p-3 relative bg-white">
                      <div
                        onClick={scrollDown}
                        className="absolute -top-5 left-0 flex justify-center w-full text-white/50 "
                      >
                        <i class="fa-solid fa-angles-down cursor-pointer"></i>
                      </div>
                      {savedMessages.length > 0 && <p className="absolute bg-white -top-12 w-[95%] p-3 "> <p className="bg-gray-200 text-xs p-2 rounded">{savedMessages}</p></p>}
                      <input
                        placeholder=" Type your Message..."
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-10 mr-3 pl-5  outline-none bg-slate-100 ml-3 border-black/50 "
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-500 h-10 w-12 rounded-lg text-white"
                      >
                        <i class="fa-regular fa-paper-plane"></i>
                      </button>
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
