import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import "./contact.css";


const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      Swal.fire({
        icon: "warning",
        title: "Please verify you're not a robot.",
      });
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token: captchaValue }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Thank you for contacting us. We'll get back to you soon.",
        });
        setForm({ name: "", email: "", message: "" });
        recaptchaRef.current.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Try again later.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Network error",
        text: "Unable to connect to the server.",
      });
    }
  };

  return (
    <>
    <Header />
    <div className="contactcontainer">
    <div className="content">

      {/* <!-- Left side info --> */}
      <div className="left-side">
        <div className="address details" id ='addressdet'>
          <i className="fas fa-map-marker-alt"></i>
          <div className="topic">Address</div>
          <div className="text-one">MWR6+GPW, Embakasi Village Market Opposite Posta, Embakasi Road, Nairobi</div>
          <div className="text-two">Nairobi County 00521, Kenya</div>
          
        </div>

        <div className="phone details" id ='phonedet'>
          <i classn="fas fa-phone-alt"></i>
          <div className="topic">Phone</div>
          <a href="tel:0202495785" className="text-one">
  0202495785
</a>
        </div>

        <div className="email details" id ='emaildet'>
          <i className="fas fa-envelope"></i>
          <div className="topic">Email</div>
          
          <div className="text-one">ctkcatholicparishemba@gmail.com</div>
        </div>
      </div>

      {/* <!-- Right side form --> */}
      <div className="right-side">
        <div className="topic-text">Contact Us</div>
        <p>If you have any questions, feel free to reach out to us by filling the form below.</p>

        <form id="contactForm" onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="text" name="name"
             value={form.name}
              onChange={handleChange}
            placeholder="Enter your name" 
            required />
          </div>
          <div className="input-box">
            <input type="email" name="email"
             value={form.email}
             placeholder="Enter your email"
             onChange={handleChange}
              required />
          </div>
          <div className="input-box message-box">
            <textarea name="message" 
            placeholder="Enter your message"
            value={form.message}
            onChange={handleChange}
            required></textarea>
          </div>
              <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(val) => setCaptchaValue(val)}
            />
          <div className="button">
          <input type="submit" value="Send Now" />
        </div>
        </form>
      </div>
    </div>
  </div>
    <Footer /> 
  </>
  

  );
};

export default ContactForm;
