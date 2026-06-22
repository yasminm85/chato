import React, { useState, useEffect, useRef } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function ChatPage() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(AuthContext);
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

  const executeLogout = () => {
    handleLogout();
    navigate('/');
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/auth/users',
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
    const fetchMessages = async () => {
      if (!myId || !selectedUser) return;

      try {
        const response = await axios.get(
          `http://localhost:4000/api/msgs/${myId}/${selectedUser.id}`,
        );

        setMsgs(response.data);
      } catch (error) {
        console.error('Failed Fetch Data');
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('getMessage', (data) => {
      const senderId = data.isAi ? selectedUser?.id : data.senderId;

      if (blockedUsers.includes(senderId)) {
        console.log(`Pesan dari ${senderId} diblokir.`);
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
    if(!window.confirm(`Are sure want to delte chat with ${selectedUser.name} ?`)) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/msgs/${myId}/${selectedUser.id}`);
      setMsgs([]);
      setIsMenuOpen(false);
    } catch (error) {
       console.error('Failed delete message', error);
    }
  }

  const colors = [C.bluePale, '#D6F5E8', C.yellow, '#FFD1DC', '#E0C3FC'];
  const getBgColor = (index) => colors[index % colors.length];

  const getFlagEmoji = (countryCode) => {
            if(!countryCode) return '🌐';
             const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
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
        ini: getInitials(u.username),
        bg: getBgColor(index),
        on: onlineUsers.includes(dbUserId),
        flag: getFlagEmoji(u.country),
      };
    });

    

    

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: C.paper,
        overflow: 'hidden',
      }}>
      {/* app header */}
      <header
        style={{
          borderBottom: `3px solid ${C.ink}`,
          padding: '0 24px',
          flexShrink: 0,
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            maxWidth: 1200,
            margin: '0 auto',
          }}>
          <button
            className="sg"
            onClick={() => navigate('/chat')}
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '-.03em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.ink,
            }}>
            Chato
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              className="dm"
              style={{ fontSize: 12, color: '#555' }}>
              <span style={{ fontWeight: 700, color: C.blue }}>
                {user.displayName || user.username}
              </span>
              {user.age &&
                ` (${user.gender ? user.gender[0] : ''}, ${user.age}y)`}
            </div>
          </div>
        </div>
      </header>

      {/* main */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 20,
          padding: '20px 24px',
          overflow: 'hidden',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}>
        {/* sidebar */}
        <aside
          style={{
            width: 220,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
          <div
            className="nb"
            style={{
              padding: 16,
              background: C.white,
              flex: 1,
              overflowY: 'auto',
            }}>
            <div
              className="dm"
              style={{
                fontSize: 10,
                letterSpacing: '.1em',
                color: '#999',
                marginBottom: 10,
              }}>
              Online Friends
            </div>
            {friendList.map((u) => (
              <button
                key={u.id}
                className="side-btn"
                onClick={() => {
                  setSelectedUser(u);
                  setUnreadCounts((prev) => ({ ...prev, [u.id]: 0 }));
                  if (pendingMsgs[u.id] && pendingMsgs[u.id].length > 0) {
                    setMsgs((prev) => [...prev, ...pendingMsgs[u.id]]);
                    setPendingMsgs((prev) => ({ ...prev, [u.id]: [] }));
                  }
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: u.bg,
                        border: `2px solid ${C.ink}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                        fontSize: 11,
                      }}>
                      {u.ini}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -1,
                        right: -1,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: u.on ? C.green : C.grayMid,
                        border: '1.5px solid white',
                      }}
                    />
                  </div>

                  <span style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {u.name}
                    <span style={{ fontSize: 16 }}>{u.flag}</span>
                  </span>
                </div>

                {unreadCounts[u.id] > 0 && (
                  <span
                    style={{
                      background: '#FF4500',
                      color: '#FFF',
                      border: '2px solid #000',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontWeight: '900',
                      fontSize: '11px',
                      boxShadow: '2px 2px 0px #000',
                    }}>
                    {unreadCounts[u.id]}
                  </span>
                )}
              </button>
            ))}
            <div
              style={{
                borderTop: `2px solid ${C.ink}`,
                marginTop: 12,
                paddingTop: 10,
              }}>
              {[
                ['⚙', 'Settings', () => alert('Menu Settings on progress!')],
                ['?', 'Help', () => alert('Menu Help on progress!')],
                [
                  '←',
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
                  className="side-btn">
                  <span
                    className="dm"
                    style={{ fontSize: 12, color: '#888' }}>
                    {ic}
                  </span>
                  {lb}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* chat area */}
        {!selectedUser ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: C.paper,
            }}>
            <div
              className="sg"
              style={{ color: '#888', fontSize: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
              Pilih user di samping untuk mulai ngobrol!
            </div>
          </div>
        ) : (
          <div
            className="nb"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: C.white,
              overflow: 'hidden',
            }}>
            {/* chat header */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: `2px solid ${C.ink}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
              }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: selectedUser.bg,
                  border: `2px solid ${C.ink}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 700,
                  fontSize: 12,
                }}>
                {selectedUser.ini}
              </div>
              <div>
                <div
                  className="sg"
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-.01em',
                  }}>
                  {selectedUser.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: selectedUser.on ? C.green : C.grayMid,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    className="dm"
                    style={{ fontSize: 10, color: '#777' }}>
                    {selectedUser.on ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              {/* KEBAB MENU (TITIK TIGA) */}
              <div style={{ marginLeft: 'auto', position: 'relative' }}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  style={{
                    background: isMenuOpen ? C.ink : C.white,
                    color: isMenuOpen ? C.white : C.ink,
                    border: `2px solid ${C.ink}`,
                    padding: '4px 12px',
                    fontWeight: '900',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px #000',
                  }}
                >
                  ⋮
                </button>

                {/* DROPDOWN MENU */}
                {isMenuOpen && (
                  <div
                    className="nb"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '10px',
                      background: C.white,
                      border: `2px solid ${C.ink}`,
                      boxShadow: '4px 4px 0px #000',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '160px',
                      zIndex: 10,
                    }}
                  >
                    {/* Tombol Block/Unblock */}
                    <button
                      onClick={() => {
                        if (blockedUsers.includes(selectedUser.id)) {
                          setBlockedUsers((prev) => prev.filter((id) => id !== selectedUser.id));
                        } else {
                          setBlockedUsers((prev) => [...prev, selectedUser.id]);
                        }
                        setIsMenuOpen(false); // Tutup menu setelah diklik
                      }}
                      style={{
                        padding: '12px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `2px solid ${C.ink}`,
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: blockedUsers.includes(selectedUser.id) ? C.green : '#FF3333',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#F0F0F0')}
                      onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                    >
                      {blockedUsers.includes(selectedUser.id) ? '🔓 Unblock User' : '🚫 Block User'}
                    </button>

                    {/* Tombol Clear Chat */}
                    <button
                      onClick={handleDeleteMsgs}
                      style={{
                        padding: '12px 14px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: '#FF3333',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#F0F0F0')}
                      onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                    >
                      🗑️ Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                background: '#F8F8F5',
              }}>
              {msgs.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#888',
                    margin: 'auto',
                  }}>
                  Belum ada pesan. Ucapkan halo ke {selectedUser.name}! 👋
                </div>
              ) : (
                msgs.map((m, idx) => {
                  const isMe = m.senderId === (user?.id || user?._id);
                  const fromType = isMe
                    ? 'user'
                    : m.isAi === true || m.isAi === 'true'
                      ? 'ai'
                      : 'them';
                      if(fromType == 'ai' && m.receiverId !== myId) return null;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems:
                          fromType === 'user' ? 'flex-end' : 'flex-start',
                        gap: 6,
                      }}>
                      {fromType === 'them' && (
                        <span
                          className="dm"
                          style={{
                            fontSize: 10,
                            color: '#888',
                            paddingLeft: 2,
                          }}>
                          {selectedUser.name}
                        </span>
                      )}
                      {fromType === 'ai' && (
                        <span
                          className="dm"
                          style={{
                            fontSize: 10,
                            color: C.blue,
                            paddingLeft: 2,
                          }}>
                          ✏ AI CORRECTION
                        </span>
                      )}
                      <div
                        style={{
                          padding: '10px 14px',
                          border: `2px solid ${C.ink}`,
                          boxShadow: `3px 3px 0 ${C.ink}`,
                          maxWidth: '70%',
                          background:
                            fromType === 'user'
                              ? C.blue
                              : fromType === 'ai'
                                ? C.white
                                : C.bluePale,
                          color: fromType === 'user' ? '#fff' : C.ink,
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}>
                        {fromType === 'ai' && m.aiText ? (
                          <span
                            dangerouslySetInnerHTML={{ __html: m.aiText }}
                          />
                        ) : (
                          m.text
                        )}
                      </div>
                      {fromType === 'ai' && m.rule && (
                        <div
                          style={{
                            border: `2px dashed ${C.ink}`,
                            background: C.yellowDim,
                            padding: '8px 12px',
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                          }}>
                          <div
                            className="dm"
                            style={{
                              fontSize: 9,
                              letterSpacing: '.1em',
                              color: C.blue,
                              fontWeight: 500,
                            }}>
                            ✏ GRAMMAR RULE
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: '#333',
                              lineHeight: 1.4,
                            }}>
                            {m.rule}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div
                  className="dm"
                  style={{
                    fontSize: 12,
                    color: '#888',
                    fontStyle: 'italic',
                    paddingLeft: 4,
                    marginTop: -5,
                  }}>
                  {selectedUser.name} is typing...
                </div>
              )}
            </div>

            {/* input */}
            <div
              style={{
                padding: '14px 16px',
                borderTop: `2px solid ${C.ink}`,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-end',
                flexShrink: 0,
              }}>
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
                className="inp"
                style={{
                  flex: 1,
                  resize: 'none',
                  minHeight: 44,
                  maxHeight: 110,
                  fontFamily: 'DM Sans',
                  fontSize: 14,
                }}
              />
              <Btn
                sz="sm"
                onClick={handleSend}
                style={{ height: 44, flexShrink: 0 }}>
                Send →
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
