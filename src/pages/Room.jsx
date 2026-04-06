import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username] = useState("Agent-" + Math.floor(Math.random() * 9000 + 1000));
  const [typingUser, setTypingUser] = useState(null);
  const [vaporizing, setVaporizing] = useState(false);

  /* ---------------- CHECK ROOM ---------------- */
  useEffect(() => {
    const checkRoom = async () => {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("This room does not exist or has already evaporated.");
        navigate("/");
        return;
      }
    };

    checkRoom();

    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribeOuter = onSnapshot(doc(db, "rooms", roomId), (docSnap) => {
      if (!docSnap.exists()) {
        navigate("/");
      }
    });

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setMessages(msgs);
    });

    return () => {
      unsubscribe();
      unsubscribeOuter();
    };
  }, [roomId, navigate]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  /* ---------------- TYPING LISTENER ---------------- */
  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);

    const unsub = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.typing && data.typing !== username) {
          setTypingUser(data.typing);
        } else {
          setTypingUser(null);
        }
      }
    });

    return () => unsub();
  }, [roomId, username]);

  /* ---------------- HANDLE TYPING ---------------- */
  const handleTyping = async () => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      typing: username,
    }).catch(() => {});

    setTimeout(async () => {
      await updateDoc(roomRef, {
        typing: null,
      }).catch(() => {});
    }, 2000);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const msgText = message;
    setMessage("");

    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text: msgText,
      username,
      createdAt: serverTimestamp(),
    });

    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      typing: null,
    }).catch(() => {});
  };

  /* ---------------- END CHAT ---------------- */
  const endChat = async () => {
    setVaporizing(true);
    
    // Play vaporize animation for a moment before actually deleting
    setTimeout(async () => {
      try {
        const messagesRef = collection(db, "rooms", roomId, "messages");
        const snapshot = await getDocs(messagesRef);

        for (const msg of snapshot.docs) {
          await deleteDoc(msg.ref);
        }

        await deleteDoc(doc(db, "rooms", roomId));
      } catch (err) {
        console.error(err);
      } finally {
        navigate("/");
      }
    }, 1400); // Matches animation duration
  };

  /* ---------------- FORMAT TIME ---------------- */
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className={`room-wrapper ${vaporizing ? "vaporize-effect" : ""}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.4 }}
    >
      <div className="room-bg"></div>

      {/* HEADER */}
      <header className="room-header glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
        <div className="room-title-area">
          <img src="/logo.png?v=2" alt="Logo" style={{ height: "32px" }} />
          <div className="room-id-badge">
            <i className="fas fa-lock" style={{ marginRight: "6px", fontSize: "12px" }}></i>
            {roomId}
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <div className="user-badge">
            <div className="user-dot"></div>
            {username}
          </div>

          <button className="btn-end" onClick={endChat}>
            <i className="fas fa-power-off"></i> 
            <span className="hide-on-mobile" style={{ marginLeft: "6px" }}>Vaporize</span>
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="chat-container">
        <div className="chat-messages">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isSelf = msg.username === username;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`message-wrapper ${isSelf ? "self" : "other"}`}
                >
                  <div className="message-meta">
                    <span className="username">{isSelf ? "You" : msg.username}</span>
                    <span className="time">{formatTime(msg.createdAt)}</span>
                  </div>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {typingUser && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="message-wrapper other" 
              style={{ marginTop: '10px' }}
            >
              <div className="message-bubble" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  {typingUser} typing
                </span>
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} style={{ height: "1px" }}></div>
        </div>

        {/* INPUT */}
        <div className="chat-input-wrapper">
          <form className="chat-input-box" onSubmit={sendMessage}>
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Message the void..."
              disabled={vaporizing}
              autoFocus
            />
            <button type="submit" className="btn-send" disabled={vaporizing || !message.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}