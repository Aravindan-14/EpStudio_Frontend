import React, { useEffect, useState, useContext } from "react";
import socket from "../../socket";
import axios from "axios";
import { DataContext } from "../Contexts/DataContext";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://epstudio-api.onrender.com";
function Message() {
  const { users, isAuth, setIsAuth, open, setOpen } = useContext(DataContext);

  const [chatList, setChatList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchSenderChatId = async () => {
      try {
        const res = await axios.post(
          "https://epstudio-api.onrender.com/chat/getAllChatId",
          {
            id: users.id,
          }
        );
        console.log(res.data.data);

        setChatList(res.data.data);
      } catch (error) {
        console.error("Error fetching sender chat ID:", error);
      }
    };

    fetchSenderChatId();
  }, []);

  useEffect(() => {
    const fetchMyMessage = async () => {
      try {
        const res = await axios.post(
          "https://epstudio-api.onrender.com/chat/getMyMessage",
          { chat_ID: currentUser.chat_ID }
        );
        setMessages(res.data.data);
        console.log(res.data.data, "all messages");
      } catch (error) {
        console.error("internal Server Error :", error);
      }
    };

    fetchMyMessage();
  }, [currentUser]);

  console.log(currentUser, "chat listssssss");

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketIo = io.connect(SOCKET_SERVER_URL, {
    reconnection: true, // Enable reconnection (default is true)
    reconnectionAttempts: Infinity, // Set the maximum number of reconnection attempts
    reconnectionDelay: 1000, // Initial delay before reconnecting (in ms)
    reconnectionDelayMax: 5000, // Maximum delay before reconnecting (in ms)
    timeout: 20000, // Connection timeout (in ms)
  });

  useEffect(() => {
    setSocket(socketIo);

    // Join the room when the component mounts
    socketIo.emit("join room", currentUser.chat_ID);

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
  }, [currentUser.chat_ID]);

  // Send message to the server
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const messgedata = {
        sender_ID: users.id,
        receiver_ID: currentUser.sender_ID,
        message: message,
        chat_ID: currentUser.chat_ID,
      };
      socket.emit("chat message", currentUser.chat_ID, messgedata); // Pass the room ID
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

  return (
    <div className="w-full h-full flex">
      <div className="w-96 h-full bg-white p-5">
        <div className="text-center">
          <div>Message</div>
          <div className="w-full flex my-5">
            <input
              placeholder="Search By Name"
              className="pl-2 w-full outline-none border"
              type="text"
            />
            <div className="h-10 w-10 flex justify-center items-center bg-blue-500 text-white">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div>
            {chatList.map((list) => {
              return (
                <div
                  onClick={() => {
                    setCurrentUser(list);
                  }}
                  className="flex  items-center gap-5 bg-slate-100 p-2 rounded-lg mb-2"
                >
                  <div className="h-12 w-12 rounded-full bg-red-300 overflow-hidden">
                    <img
                      src="https://i.pinimg.com/474x/d5/bf/8d/d5bf8d07e4e23c534dca6105dd05874c.jpg"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <span>{list.senderName}</span>
                    <span className="text-xs">Hello Abisha</span>
                  </div>
                  {/* <div>
                <div className="place-self-end mr-auto">
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
              </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-screen w-full bg-white border-l-2">
        <div className="w-full h-14 bg-blue-500 flex justify-between items-center p-5 ">
          <div className="flex justify-center items-center gap-5">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src="https://i.pinimg.com/474x/d5/bf/8d/d5bf8d07e4e23c534dca6105dd05874c.jpg"
                alt=""
              />
            </div>
            <div className="flex flex-col justify-center items-start">
              <span className="text-lg font-bold text-white">
                {currentUser.senderName}
              </span>
              <span className="text-sm text-orange-500 font-semibold">
                online
              </span>
            </div>
          </div>
          <div>
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </div>
        <div
          id="chat-area"
          className={`h-[79%] w-full mb-1 pt-1 flex flex-col overflow-auto scrollbar-custom p-2  ${
            true ? "items-end" : "items-start"
          }  bg-gradient-to-r from-violet-200 to-fuchsia-200`}
        >
          {messages.map((msg) => {
            return (
              <div
                className={`w-full  flex ${
                  msg.sender_ID == users.id ? "justify-end" : "justify-start"
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
        <div className="p-2">
          <div className="w-full bg-slate-100 flex relative">
            <div
              onClick={scrollDown}
              className="absolute -top-8 left-0 flex justify-center w-full text-black/50"
            >
              <i class="fa-solid fa-angles-down cursor-pointer"></i>
            </div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 outline-none border"
              type="text"
            />
            <div
              className="bg-blue-500 w-16 flex justify-center items-center text-white"
              onClick={sendMessage}
            >
              <i class="text-lg fa-solid fa-paper-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
