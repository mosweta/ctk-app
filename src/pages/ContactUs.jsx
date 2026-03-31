import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import "./contact.css";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if environment variables are configured
    if (!import.meta.env.VITE_WORKER_URL) {
      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Worker URL not configured. Please check environment variables.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Client-side validation
    if (!form.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name Required",
        text: "Please enter your name.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!validateEmail(form.email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!form.message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Message Required",
        text: "Please enter your message.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!captchaValue) {
      Swal.fire({
        icon: "warning",
        title: "Verification Required",
        text: "Please verify that you're not a robot.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsLoading(true);

    try {
      const WORKER_URL = import.meta.env.VITE_WORKER_URL;
      
      console.log("Sending to worker:", WORKER_URL); // Debug log
      
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: form.name,
          email: form.email,
          message: form.message,
          token: captchaValue,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Thank you for contacting Christ The King Parish. We'll get back to you shortly.",
          confirmButtonColor: "#3085d6",
        });
        
        // Reset form
        setForm({ name: "", email: "", message: "" });
        setCaptchaValue(null);
        recaptchaRef.current.reset();
      } else {
        const errorMessage = data.error || "Failed to send message";
        
        if (errorMessage === "Captcha failed") {
          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text: "reCAPTCHA verification failed. Please try again.",
            confirmButtonColor: "#d33",
          });
          recaptchaRef.current.reset();
          setCaptchaValue(null);
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.message === "Failed to fetch" 
          ? "Unable to connect to the server. Please check your internet connection or worker URL."
          : err.message || "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contactcontainer">
      <div className="content">
        {/* Left side info */}
        <div className="left-side">
          <div className="address details" id='addressdet'>
            <i className="fas fa-map-marker-alt"></i>
            <div className="topic">Address</div>
            <div className="text-one">MWR6+GPW, Embakasi Village Market Opposite Posta, Embakasi Road, Nairobi</div>
            <div className="text-two">Nairobi County 00521, Kenya</div>
          </div>

          <div className="phone details" id='phonedet'>
            <i className="fas fa-phone-alt"></i>
            <div className="topic">Phone</div>
            <a href="tel:0202495785" className="text-one">
              0202495785
            </a>
          </div>

          <div className="email details" id='emaildet'>
            <i className="fas fa-envelope"></i>
            <div className="topic">Email</div>
            <div className="text-one">ctkcatholicparishemba@gmail.com</div>
          </div>
        </div>

        {/* Right side form */}
        <div className="right-side">
          <div className="topic-text">Contact Us</div>
          <p>If you have any questions, feel free to reach out to us by filling the form below.</p>

          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="input-box">
              <input 
                type="text" 
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name" 
                required 
                disabled={isLoading}
              />
            </div>
            
            <div className="input-box">
              <input 
                type="email" 
                name="email"
                value={form.email}
                placeholder="Enter your email"
                onChange={handleChange}
                required 
                disabled={isLoading}
              />
            </div>
            
            <div className="input-box message-box">
              <textarea 
                name="message" 
                placeholder="Enter your message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                required
                disabled={isLoading}
              ></textarea>
            </div>
            
            <div className="recaptcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(val) => setCaptchaValue(val)}
                theme="light"
              />
            </div>
            
            <div className="button">
              <input 
                type="submit" 
                value={isLoading ? "Sending..." : "Send Now"} 
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;