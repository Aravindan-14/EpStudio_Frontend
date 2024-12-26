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
const SOCKET_SERVER_URL = "https://epstudio-api.onrender.com";

export default function Example() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);
  const [senderChatId, setSenderChatId] = useState({});
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchSenderChatId = async () => {
      try {
        const res = await axios.post(
          "https://epstudio-api.onrender.com/chat/getSenderChatId",
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
  }, [users.id]);

  useEffect(() => {
    const fetchMyMessage = async () => {
      try {
        const res = await axios.post(
          "https://epstudio-api.onrender.com/chat/getMyMessage",
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
    socketIo.emit("join room", senderChatId.chat_ID);

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
    e.preventDefault();
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
      "https://epstudio-api.onrender.com/chat/CreateChatID",
      Data
    );
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-3 shadow-xl">
                {senderChatId ? (
                  <div>
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
                    <div className="relative mt-2 flex-1 px-4 sm:px-6">
                      <div className="w-full h-full bg-gradient-to-r from-violet-300 to-fuchsia-300">
                        <div
                          // scrollbar-custom
                          id="chat-area"
                          className={`h-[420px] w-full mb-1 flex flex-col overflow-auto scrollbar-none p-2 ${
                            true ? "items-end" : "items-start"
                          } `}
                        >
                          {messages.map((msg) => {
                            return (
                              <div
                                className={`w-full  flex ${
                                  msg.sender_ID == users.id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                {msg.sender_ID == users.id ? (
                                  <div className="relative rounded-l-xl rounded-br-xl text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 w-fit h-fit mr-2 text-white p-2 mt-1 text-start font-semibold">
                                    <p>{msg.message}</p>
                                    <p></p>
                                    <div
                                      class="absolute top-0 -right-1 w-0 h-0 
      border-t-[0px] border-t-transparent
      border-l-[10px] border-l-fuchsia-500
      border-b-[10px] border-b-transparent"
                                    ></div>
                                  </div>
                                ) : (
                                  <div className="my-1 relative rounded-r-xl rounded-bl-xl text-sm bg-violet-600 text-white w-fit h-fit ml-2 p-2 font-semibold">
                                    <p>{msg.message}</p>
                                    <p></p>
                                    <div
                                      className="absolute top-0 -left-1 w-0 h-0 
border-l-[10px] border-l-transparent
border-t-[12px] border-t-violet-600
border-r-[0px] border-r-transparent"
                                    ></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center w-full p-3 relative">
                          <div
                            onClick={scrollDown}
                            className="absolute -top-3 left-0 flex justify-center w-full text-white/50 "
                          >
                            <i class="fa-solid fa-angles-down cursor-pointer"></i>
                          </div>
                          <input
                            placeholder=" Type your Message..."
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-10 mr-3 pl-2  outline-none border-b border-black/50 "
                          />
                          <button
                            onClick={sendMessage}
                            className="bg-blue-500 h-10 w-12 rounded-lg text-white"
                          >
                            <i class="fa-regular fa-paper-plane"></i>
                          </button>
                        </div>
                      </div>
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
                        Yes Do
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
