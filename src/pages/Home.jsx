import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../firebase";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    await setDoc(doc(db, "rooms", roomId), {
      createdAt: serverTimestamp(),
    });
    navigate(`/room/${roomId}`);
  };

  const joinRoom = (e) => {
    e?.preventDefault();
    if (!roomCode.trim()) return;
    navigate(`/room/${roomCode.toUpperCase()}`);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="home-wrapper">
      
      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand-container" onClick={() => navigate("/")}>
          <img src="/logo.png?v=2" alt="Vapour Logo" className="brand-logo" />
          <span className="brand-text text-gradient">Vapour</span>
        </div>

        <nav>
          <a href="/about">About</a>
          <a href="/contact">Support</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="bg-orbs">
          <div className="orb-1"></div>
          <div className="orb-2"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.2 }
            }
          }}
          className="hero-content"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
            End-to-End Encrypted
          </motion.div>

          <motion.h1 variants={itemVariants}>
            Anonymous Chat. <br />
            <span className="text-gradient">Leaves No Trace.</span>
          </motion.h1>

          <motion.p variants={itemVariants}>
            Step into the void. Private, untraceable rooms that dissolve into vapour the exact moment the conversation ends. No logs, no history.
          </motion.p>

          <motion.div variants={itemVariants} className="action-cards">
            {/* Create Room Card */}
            <div className="main-action-card glass-panel">
              <h3>Start a Conversation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>
                Generate a secure, temporary room instantly.
              </p>
              <button onClick={createRoom} className="btn-primary">
                <i className="fas fa-plus-circle"></i> Create Room
              </button>
            </div>

            {/* Join Room Card */}
            <div className="main-action-card glass-panel">
              <h3>Join via Code</h3>
              <form onSubmit={joinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}>
                <div className="input-group">
                  <i className="fas fa-key" style={{ color: 'var(--text-muted)', padding: '12px' }}></i>
                  <input
                    placeholder="Enter 6-digit code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </div>
                <button type="submit" className="btn-secondary" style={{ width: '100%' }}>
                  Enter Room <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="vapour-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <h3 className="brand-text text-gradient" style={{ fontSize: '20px', marginLeft: 0 }}>Vapour</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '10px' }}>
              © {new Date().getFullYear()} Vapour Inc. All privacy preserved.
            </p>
          </div>
          <div className="footer-right" style={{ display: 'flex', gap: '20px' }}>
            <a href="https://github.com/rohan1275" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', fontSize: '20px', transition: '0.3s' }}>
              <i className="fab fa-github hover:text-white"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}