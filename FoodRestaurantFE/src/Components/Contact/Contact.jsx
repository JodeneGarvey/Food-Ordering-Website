import React, {useState} from 'react'
import "./Contact.css";

const Contact = () => {
    const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form:", form);

    alert("Message sent successfully!");
    
    setForm({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <div className="contact-section">
      <div className="contact-container">
        
        {/* LEFT SIDE */}
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>
            Have questions or want to place a special order?  
            We'd love to hear from you!
          </p>

          <div className="contact-details">
            <p><strong>📍 Address:</strong> Kingston, Jamaica</p>
            <p><strong>📞 Phone:</strong> (876) 123-4567</p>
            <p><strong>📧 Email:</strong> support@letuseat.com</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <form className="contact-form" onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>

      </div>
    </div>
  )
}

export default Contact