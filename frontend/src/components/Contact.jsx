import { useState } from "react";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaComments,
  FaCheckCircle,
  MdEmail,
  MdMessage,
} from "../utils/icons";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    { icon: FaMapMarkerAlt, title: "Our Location", sub: "123 Health Ave, Medical City, MH 440001" },
    { icon: FaPhone, title: "Phone", sub: "+91 98765 43210" },
    { icon: FaEnvelope, title: "Email", sub: "care@healthcareplus.in" },
    { icon: FaClock, title: "Hours", sub: "24 / 7 — Always Available" },
  ];

  return (
    <div className="page-enter">
      <div className="contact-header">
        <div className="container">
          <span className="badge-pill contact-header__badge">
            <FaPhone size={14} aria-hidden="true" /> Get in Touch
          </span>
          <h1 className="section-title mt-3" style={{ color: "white" }}>Contact Us</h1>
          <p className="mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
            We're here to help. Reach out any time.
          </p>
        </div>
      </div>

      <div className="container contact-body">
        <div className="contact-grid">
          <div className="contact-info">
            <h4 className="contact-info__title">Get in Touch</h4>
            <p className="contact-info__desc">
              Have a question, feedback, or need help booking? Our team is available 24/7 to assist you.
            </p>
            <div className="contact-info__cards">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="contact-info-item">
                    <div className="contact-info-item__icon"><Icon size={20} aria-hidden="true" /></div>
                    <div>
                      <div className="contact-info-item__title">{item.title}</div>
                      <div className="contact-info-item__sub">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hc-card contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon"><FaCheckCircle size={48} aria-hidden="true" /></div>
                <h4>Message Sent!</h4>
                <p>Thanks for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  className="btn-hc-primary"
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h4 className="contact-form__title">Send a Message</h4>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form__row">
                    <div className="contact-form__field">
                      <label className="form-label"><FaUser size={14} aria-hidden="true" /> Full Name</label>
                      <input type="text" name="name" className="hc-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="contact-form__field">
                      <label className="form-label"><MdEmail size={14} aria-hidden="true" /> Email</label>
                      <input type="email" name="email" className="hc-input" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="contact-form__field">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" className="hc-input" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                  </div>
                  <div className="contact-form__field">
                    <label className="form-label"><FaComments size={14} aria-hidden="true" /> Message</label>
                    <textarea name="message" className="hc-input contact-textarea" rows="5" placeholder="Write your message..." value={form.message} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn-hc-primary contact-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="hc-spinner hc-spinner--sm" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MdMessage size={16} aria-hidden="true" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
