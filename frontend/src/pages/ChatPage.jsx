import React, { useState, useEffect, useRef } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';
import { io } from 'socket.io-client';
import LogoChato from '../assets/landingpage/logo_chato.svg';
import { CgProfile } from 'react-icons/cg';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { CiMenuKebab } from 'react-icons/ci';
import { gooeyToast } from 'goey-toast';
import { NeoConfirmAlert } from '../components/Alert.jsx';
import DOMPurify from 'dompurify';
import api from '../api/api.js';

export default function ChatPage() {
  const navigate = useNavigate();
  const { user, handleLogout, token } = useContext(AuthContext);
  const myId = user?.id || user?._id;
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [pendingMsgs, setPendingMsgs] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    gender: '',
    country: '',
  });

  const executeLogout = () => {
    handleLogout();
    navigate('/');
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await api.get(
          '/api/auth/users',
        );
        const data = response.data;
        setAllUsers(data.getUser);
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!myId) return;

      try {
        const response = await api.get(
          `/api/auth/getUser/${myId}`,
        );
        const userData = response.data.user || response.data;

        setFormData({
          username: userData.username || '',
          age: userData.age || '',
          gender: userData.gender || 'Male',
          country: userData.country || '',
        });
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };

    fetchProfile();
  }, [myId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!myId || !selectedUser) return;

      try {
        const response = await api.get(
          `/api/msgs/${myId}/${selectedUser.id}`,
        );

        setMsgs(response.data);
      } catch (error) {
        console.error('Failed Fetch Data');
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    const newSocket = io(api, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('getMessage', (data) => {
      const senderId = data.isAi ? selectedUser?.id : data.senderId;

      if (blockedUsers.includes(senderId)) {
        return;
      }

      if (selectedUser && selectedUser.id === senderId) {
        setMsgs((prev) => [...prev, data]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));

        setPendingMsgs((prev) => ({
          ...prev,
          [senderId]: [...(prev[senderId] || []), data],
        }));
      }
    });

    return () => {
      socket.off('getMessage');
    };
  }, [socket, selectedUser, blockedUsers]);

  useEffect(() => {
    if (socket === null || !user?.id) return;

    socket.emit('addNewUser', user.id);

    socket.on('getOnlineUsers', (usersArray) => {
      setOnlineUsers(usersArray);
    });

    return () => {
      socket.off('getOnlineUsers');
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;

    socket.on('typing', (senderId) => {
      if (selectedUser && selectedUser.id === senderId) {
        setIsTyping(true);
      }
    });

    socket.on('stopTyping', (senderId) => {
      if (selectedUser && selectedUser.id === senderId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('getMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket, selectedUser, blockedUsers]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      if (!myId) return;
      try {
        const response = await api.get(
          `/api/auth/getUser/${myId}`,
        );
        const userData = response.data.user || response.data;

        const rawIds = userData.blockedUser;

        const cleanBlockedList = Array.isArray(rawIds)
          ? rawIds
          : rawIds
            ? [rawIds]
            : [];

        const cleanIds = cleanBlockedList.map((id) => id.toString());
        setBlockedUsers(cleanIds);
      } catch (error) {
        console.error('Failed to fetch blocked users', error);
      }
    };

    fetchBlockedUsers();
  }, [myId]);

  const getInitials = (name) => {
    if (!name) return '??';
    const names = name.trim().split(' ');
    if (names.length > 1) return names[0][0] + names[1][0].toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleSend = () => {
    if (!newMessage.trim() || !socket || !selectedUser) return;
    const myId = user?.id || user?._id;

    const messageData = {
      senderId: myId,
      receiverId: selectedUser.id,
      text: newMessage,
    };

    socket.emit('sendMessage', messageData);

    setMsgs((prev) => [...prev, messageData]);

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !selectedUser) return;

    socket.emit('typing', { senderId: myId, receiverId: selectedUser.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', {
        senderId: myId,
        receiverId: selectedUser.id,
      });
    }, 1500);
  };

  const handleDeleteMsgs = async () => {
    try {
      const response = await api.delete(
        `/api/msgs/${myId}/${selectedUser.id}`,
      );
      setMsgs([]);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed delete message', error);
    }
  };

  const handleBlockUser = async (targetUserId) => {
    const targetIdStr = targetUserId.toString();
    const isAlreadyBlocked = blockedUsers
      .map((id) => id.toString())
      .includes(targetIdStr);

    try {
      await api.post(
        '/api/auth/block',
        { targetedId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (isAlreadyBlocked) {
        setBlockedUsers((prev) =>
          prev.filter((id) => id.toString() !== targetIdStr),
        );
        gooeyToast.success('User unblocked successfully');
      } else {
        setBlockedUsers((prev) => [...prev, targetIdStr]);
        gooeyToast.success('User blocked successfully');
      }
    } catch (err) {
      console.error('ERROR:', err.message);
      gooeyToast.error('Failed to update block status');
    }
  };

  const colors = [C.bluePale, '#D6F5E8', C.yellow, '#FFD1DC', '#E0C3FC'];
  const getBgColor = (index) => colors[index % colors.length];

  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const friendList = (Array.isArray(allUsers) ? allUsers : [])
    .filter((u) => {
      const dbUserId = u._id || u.id;
      const myId = user?.id || user?._id;
      return dbUserId !== myId;
    })
    .map((u, index) => {
      const dbUserId = u._id || u.id;
      return {
        id: dbUserId,
        name: u.username,
        age: u.age,
        gender: u.gender,
        country: u.country,
        ini: getInitials(u.username),
        bg: getBgColor(index),
        on: onlineUsers.includes(dbUserId),
        flag: getFlagEmoji(u.country),
      };
    });

  return (
    <div className="h-screen flex flex-col bg-[#FFC0CB] overflow-hidden">
      <header className="border-b-3 border-[#0D0C0C] px-6 shrink-0 bg-[#FDF2E9]">
        <div className="flex items-center justify-between h-14 max-w-[1200px] mx-auto">
          <button
            onClick={() => navigate('/chat')}
            className="font-sg text-[18px] font-extrabold tracking-tight bg-transparent border-none cursor-pointer text-[#0D0C0C] hover:opacity-80 transition-opacity">
            Chato
          </button>

          <div className="flex items-center gap-4">
            <div className="font-dm text-[12px] text-gray-600">
              <span className="font-bold text-[#0D0C0C]">
                {formData.username}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-5 p-5 overflow-hidden max-w-[1200px] mx-auto w-full">
        <aside className="w-[220px] shrink-0 flex flex-col gap-4">
          <div className="p-4 bg-[#F8D6B3] border-2 border-[#0D0C0C] shadow-[3px_3px_0_0_] flex-1 overflow-y-auto rounded-sm">
            <div className="font-dm text-[10px] tracking-widest text-gray-400 mb-2.5 font-bold uppercase">
              Friends
            </div>

            {friendList.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setSelectedUser(u);
                  setUnreadCounts((prev) => ({ ...prev, [u.id]: 0 }));
                  if (pendingMsgs[u.id] && pendingMsgs[u.id].length > 0) {
                    setMsgs((prev) => [...prev, ...pendingMsgs[u.id]]);
                    setPendingMsgs((prev) => ({ ...prev, [u.id]: [] }));
                  }
                }}
                className={`w-full flex justify-between items-center p-2 mb-2 border-2 border-[#0D0C0C] rounded-sm bg-[#FDFD96] shadow-[2px_2px_0_0_#0D0C0C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-left ${
                  selectedUser?.id === u.id ? '' : ''
                }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      style={{ background: u.bg }}
                      className="w-[30px] h-[30px] border-2 border-[#0D0C0C] flex items-center justify-center font-sg font-bold text-[11px] text-[#0D0C0C]">
                      {u.ini}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                        u.on ? 'bg-[#00C27C]' : 'bg-[#B8B2AA]'
                      }`}
                    />
                  </div>

                  <span className="text-[13px] font-bold text-[#0D0C0C] font-dm truncate flex items-center gap-1">
                    {u.name}
                    <span className="text-[16px]">{u.flag}</span>
                  </span>
                </div>

                {unreadCounts[u.id] > 0 && (
                  <span className="bg-[#FF4500] text-white border-2 border-[#0D0C0C] rounded-full px-1.5 py-0.5 font-black text-[11px] shadow-[2px_2px_0_0_#0D0C0C]">
                    {unreadCounts[u.id]}
                  </span>
                )}
              </button>
            ))}

            <div className="border-t-2 border-[#0D0C0C] mt-3 pt-2.5 flex flex-col gap-1">
              {[
                [<CgProfile />, 'Profile', () => navigate('/profile')],
                // ['?', 'Feedback', () => alert('Menu Feedback on progress!')],
                [
                  <RiLogoutCircleLine />,
                  'Logout',
                  () => {
                    handleLogout();
                    navigate('/login');
                  },
                ],
              ].map(([ic, lb, actionFn]) => (
                <button
                  key={lb}
                  onClick={actionFn}
                  className="w-full flex items-center gap-2 py-1.5 px-2 text-[13px] font-bold font-dm text-[#0D0C0C] hover:bg-gray-100 transition-colors rounded text-left">
                  <span className="font-dm text-[12px] text-gray-400 w-4">
                    {ic}
                  </span>
                  {lb}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {!selectedUser ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#E3DFF2]">
            <div className="font-sg text-gray-400 text-[24px] text-center flex flex-col items-center">
              <div className="text-6xl mb-4 animate-bounce">
                <img
                  src={LogoChato}
                  width="200px"
                  height="200px"
                />
              </div>
              <p className="hero-desc font-dm text-[18px] md:text-[24px] text-black mb-10 leading-relaxed max-w-[650px] font-medium">
                Choose Your Friend to Start Conversation!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white border-2 border-[#0D0C0C] shadow-[4px_4px_0_0_#0D0C0C] overflow-hidden rounded-sm">
            <div className="p-3.5 px-4.5 border-b-2 border-[#0D0C0C] flex items-center gap-3 shrink-0 bg-white">
              <div
                style={{ background: selectedUser.bg }}
                className="w-9 h-9 border-2 border-[#0D0C0C] flex items-center justify-center font-sg font-bold text-[12px] text-[#0D0C0C]">
                {selectedUser.ini}
              </div>
              <div>
                <div className="font-sg text-[15px] font-bold tracking-tight text-[#0D0C0C]">
                  {selectedUser.name} {selectedUser.flag}
                </div>
                <div className="font-sg text-[12px] tracking-tight text-[#0D0C0C]">
                  {selectedUser.age} yrs, {selectedUser.gender}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-[7px] h-[7px] rounded-full inline-block ${
                      selectedUser.on ? 'bg-[#00C27C]' : 'bg-[#B8B2AA]'
                    }`}
                  />
                  <span className="font-dm text-[10px] font-bold text-gray-400">
                    {selectedUser.on ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              <div className="ml-auto relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`border-2 border-[#0D0C0C] px-3 py-0.5 font-black text-[18px] cursor-pointer shadow-[3px_3px_0_0_#0D0C0C] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none outline-none ${
                    isMenuOpen
                      ? 'bg-[#0D0C0C] text-white'
                      : 'bg-white text-[#0D0C0C]'
                  }`}>
                  <CiMenuKebab />
                </button>

                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2.5 bg-white border-2 border-[#0D0C0C] shadow-[4px_4px_0_0_#0D0C0C] flex flex-col w-[160px] z-10">
                    {(() => {
                      const isThisUserBlocked = (blockedUsers || [])
                        .map((id) => id.toString())
                        .includes(selectedUser?.id?.toString());

                      return (
                        <button
                          onClick={() => {
                            handleBlockUser(selectedUser.id);
                            setIsMenuOpen(false);
                          }}
                          className={`p-3 border-none text-left font-bold text-[13px] cursor-pointer font-dm border-b-2 border-[#0D0C0C] hover:bg-gray-100 transition-colors ${
                            isThisUserBlocked
                              ? 'text-[#00C27C]'
                              : 'text-red-500'
                          }`}>
                          {isThisUserBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                      );
                    })()}

                    <button
                      onClick={() => {
                        setIsAlertOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="p-3 bg-transparent border-none text-left font-bold text-[13px] cursor-pointer font-dm text-red-500 hover:bg-gray-100 transition-colors">
                      Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-[14px] bg-[#F8F8F5]">
              {msgs.length === 0 ? (
                <div className="text-center text-gray-400 font-dm m-auto">
                  Say Hello to, {selectedUser.name}!
                </div>
              ) : (
                msgs.map((m, idx) => {
                  const isMe = m.senderId === (user?.id || user?._id);
                  const fromType = isMe
                    ? 'user'
                    : m.isAi === true || m.isAi === 'true'
                      ? 'ai'
                      : 'them';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col gap-1.5 ${
                        fromType === 'user' ? 'items-end' : 'items-start'
                      }`}>
                      {fromType === 'them' && (
                        <span className="font-dm text-[10px] text-gray-400 pl-0.5 font-medium">
                          {selectedUser.name}
                        </span>
                      )}
                      {fromType === 'ai' && (
                        <span className="font-dm text-[10px] text-[#FF4911] pl-0.5 font-bold tracking-wider uppercase">
                          AI CORRECTION
                        </span>
                      )}

                      <div
                        className={`p-2.5 px-3.5 border-2 border-[#0D0C0C] shadow-[3px_3px_0_0_#0D0C0C] max-w-[70%] font-dm text-[14px] leading-relaxed ${
                          fromType === 'user'
                            ? 'bg-[#87CEEB] shadow-[3px_3px_0_0_#0D0C0C]'
                            : fromType === 'ai'
                              ? 'bg-white text-[#0D0C0C]'
                              : 'bg-[#D6DCFF] text-[#0D0C0C]'
                        }`}>
                        {fromType === 'ai' && m.aiText ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(m.aiText),
                            }}
                          />
                        ) : (
                          m.text
                        )}
                      </div>

                      {fromType === 'ai' && m.rule && (
                        <div className="border-2 border-dashed border-[#0D0C0C] bg-[#FFF9D4] p-2 px-3 max-w-[70%] flex flex-col gap-0.5 shadow-[2px_2px_0_0_#0D0C0C]">
                          <div className="font-dm text-[9px] tracking-widest text-[#FF4911] font-bold uppercase">
                            GRAMMAR RULE
                          </div>
                          <div className="text-[12px] text-gray-800 font-dm leading-relaxed">
                            {m.rule}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div className="font-dm text-[12px] text-gray-400 italic pl-1 -mt-1.5">
                  {selectedUser.name} is typing...
                </div>
              )}
            </div>

            <div className="p-3.5 px-4 border-t-2 border-[#0D0C0C] flex gap-2.5 items-end shrink-0 bg-white">
              <textarea
                value={newMessage}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none min-h-[44px] max-h-[110px] font-dm text-[14px] p-2.5 border-2 border-[#0D0C0C] shadow-[3px_3px_0_0_#0D0C0C] bg-white text-[#0D0C0C] outline-none"
              />

              <Btn
                sz="sm"
                onClick={handleSend}
                className="h-[44px] shrink-0">
                Send
              </Btn>
            </div>

            <NeoConfirmAlert
              isOpen={isAlertOpen}
              onClose={() => setIsAlertOpen(false)}
              onConfirm={() => {
                handleDeleteMsgs();
                setIsAlertOpen(false);
              }}
              title="Clear Conversation?"
              message={`This will be permanent clear your chat`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
