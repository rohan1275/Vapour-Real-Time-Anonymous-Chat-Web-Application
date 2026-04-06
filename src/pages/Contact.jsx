import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-wrapper">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand-container" onClick={() => navigate("/")}>
          <img src="/logo.png?v=2" alt="Vapour Logo" className="brand-logo" />
          <span className="brand-text text-gradient">Vapour</span>
        </div>

        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>

      {/* CONTACT CONTENT */}
      <section className="contact-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="contact-card"
        >
          <h1 className="contact-title">
            Let’s Connect.
          </h1>

          <p className="contact-description">
            Whether you're reaching out for support, collaboration, 
            project opportunities, or innovative partnerships —
            I’m always open to meaningful conversations.
          </p>

          {/* Email first in text form */}
          <div className="contact-email">
            <span>Email:</span>
            <a href="mailto:misharohan1275@gmail.com">
              misharohan1275@gmail.com
            </a>
          </div>

          {/* Social Icons */}
          <div className="contact-icons">

            <a
              href="https://github.com/rohan1275"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon"
            >
              <i className="fab fa-github"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/rohanmishra12"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon"
            >
              <i className="fab fa-linkedin"></i>
            </a>

            <a
              href="https://instagram.com/rohan_1275"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon"
            >
              <i className="fab fa-instagram"></i>
            </a>

          </div>
        </motion.div>
      </section>

    </div>
  );
}