import React, { useState } from "react";

const ContactForm = () => {
  const [status, setStatus] = useState("Submit");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const { name, email, message } = e.target.elements;
    let details = {
      name: name.value,
      email: email.value,
      message: message.value,
    };
    let response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(details),
    });
    setStatus("Submit");
    let result = await response.json();
    alert(result.status);
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
  };
  return (
    <div className="contact-wrap">
      <div className="contact-title">
        Contact
      </div>
      <hr className="contact-horizontal-line"/>
      <form onSubmit={handleSubmit}>
        <div className="contact-name-wrap">
          <div className="contact-name-title">Name</div>
          <input type="text" id="name" required className="contact-name"/>
        </div>
        <div className="contact-email-wrap">
          <div className="contact-email-title">Email</div>
          <input type="email" id="email" required className="contact-email"/>
        </div>
        <div className="contact-message-wrap">
          <div className="contact-message-title">Message</div>
          <textarea id="message" required className="contact-message"/>
        </div>
        <button type="submit">{status}</button>
      </form>
    </div>
  );
};

export default ContactForm;
