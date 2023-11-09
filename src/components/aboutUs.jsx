import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosconfig";




export default function AboutUs() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [updateError, setUpdateError] = useState('');

     // useEffect to fetch data from the database and set the initial values
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/contact'); // Assuming this is your endpoint to fetch contact details

        if (response.status === 200) {
          const { email, phone, address } = response.data[0];

          console.log('Fetched data:', response.data); // Check the structure of the response
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Address:', address);

          // Set initial values from the database
          setEmail(email || ''); // Using an empty string as fallback if email is null
          setPhone(phone || '');
          setAddress(address || '');
        } else {
          setUpdateError('Failed to fetch contact details');
        }
      } catch (error) {
        console.error('Error fetching contact details:', error);
        setUpdateError('Failed to fetch contact details');
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs once on mount

    const handlelandingpage = () => {
        navigate('/');
      };
    const handleContactUs = () => {
        navigate('/ContactUs'); // Use navigate to go to the desired route
    };

 
    //   const handle = () => {
    //     navigate('/admin');
    //   };
  return (
    <div style={{ background: "white" }}>
         <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
                <div className="leftnav">
                    <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" />
                </div>
                <div className="rightnav">
                    <a href="#" onClick={handlelandingpage}>Home</a>
                    <a href="#"className="selected">About Us</a>
                    <a href="#">Calculator</a>
                    {/* <a href="#">Admin</a> */}
                    <a href="#" onClick={handleContactUs}>Contact Us</a>
                </div>

            </nav>
  <img style={{ width: 842, height: 497, left: 598, top: 241, position: "absolute" }} src="LandingPageImage.png" />
  <div style={{ width: 1163, height: 10, left: 130, top: 166, position: "absolute" }}>
    <div style={{ width: 1135, height: 0, left: 2, top: 0, position: "absolute" }}>
      <div style={{ width: 1135, height: 88, left: 0, top: -50, position: "absolute", color: "black", fontSize: 32, fontFamily: "Outfit", fontWeight: "700", wordWrap: "break-word" }}>About Us</div>
      <div style={{ width: 1094.14, height: 0, left: 1, top: -10, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", fontWeight: "400", wordWrap: "break-word" }}>
        At Offset CRBN, we are driven by a shared vision of a cleaner, greener world. Our journey began with a simple yet profound realization: the choices we make in our daily lives have a direct impact on the health of our planet. This realization ignited our passion to create a platform that empowers individuals to take meaningful action against climate change.
      </div>
    </div>
    <div style={{ width: 1161, height: 50, left: 2, top: 500, position: "absolute" }}>
      <div style={{ width: 1160.02, height: 88, left: 0, top: 0, position: "absolute", color: "black", fontSize: 32, fontFamily: "Outfit", fontWeight: "700", wordWrap: "break-word" }}>Join the Movement</div>
      <div style={{ width: 1154.12, height: 25, left: 1, top: 40, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", fontWeight: "400", wordWrap: "break-word" }}>
        We invite you to join us on this journey towards a more sustainable and environmentally conscious future. Whether you're an individual looking to offset your carbon footprint, a company seeking to make a corporate impact, or an advocate for positive change, there's a place for you here at Offset CRBN.
        <br />
        Together, we can turn the tide against climate change, protect our planet's natural beauty, and leave a legacy of sustainability for future generations. Join Offset CRBN, plant trees, and be part of the solution.
        <br />
        Thank you for being part of our mission to offset carbon and create a greener, more sustainable world. Together, we can make a lasting impact.
      </div>
    </div>
    <div style={{ width: 567, height: 25, left: 2, top: 296, position: "absolute" }}>
      <div style={{ width: 567, height: 88, left: 0, top: 0, position: "absolute", color: "black", fontSize: 32, fontFamily: "Outfit", fontWeight: "700", wordWrap: "break-word" }}>Our Impact</div>
      <div style={{ width: 546.59, height: 25, left: 1, top: 40, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", fontWeight: "400", wordWrap: "break-word" }}>
        Since our inception, Offset CRBN has made a significant impact on the fight against climate change. Our community members have collectively planted thousands of trees, offsetting tons of carbon emissions. But we're just getting started. With your support, we can make an even greater difference.
      </div>
    </div>
    <div style={{ width: 585, height: 25, left: 0, top: 96, position: "absolute" }}>
      <div style={{ width: 585, height: 88, left: 0, top: 0, position: "absolute", color: "black", fontSize: 32, fontFamily: "Outfit", fontWeight: "700", wordWrap: "break-word" }}>Our Mission</div>
      <div style={{ width: 563.94, height: 25, left: 1, top: 40, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", fontWeight: "400", wordWrap: "break-word" }}>
        Our mission is clear: to combat climate change, one tree at a time. We believe that every person has the power to make a positive environmental impact. By providing tools, resources, and a supportive community, we aim to make sustainable living accessible and rewarding for everyone.
      </div>
    </div>

      {/* Display contact information */}
      <img style={{ width: 40, height: 40, left: 77, top: 700, position: "absolute" }} src="email.png" />
      <img style={{ width: 50, height: 50, left: 277, top: 695, position: "absolute" }} src="phone.jpeg" />
      <img style={{ width: 50, height: 50, left: 477, top: 695, position: "absolute" }} src="pin.png" />

      <div style={{ width: 500, height: 150, left: 2, top: 700, position: "absolute" }}>
                    {/* <div style={{ width: 500, height: 25, left: 1, top: 0, position: "absolute", color: "black", fontSize: 32, fontFamily: "Outfit", fontWeight: "700", wordWrap: "break-word" }}>Contact Information</div> */}
                    <div style={{ width: 500, height: 25, left: 1, top: 50, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", wordWrap: "break-word" }}>
                        <p>{email}</p>
                    </div>
                    <div style={{ width: 500, height: 25, left: 251, top: 50, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", wordWrap: "break-word" }}>
                    <p>{phone}</p>
                    </div>
                    <div style={{ width: 500, height: 25, left: 401, top: 50, position: "absolute", color: "black", fontSize: 20, fontFamily: "Outfit", wordWrap: "break-word" }}>
                    <p>{address}</p>
                    </div>
                   
                        
                </div>
  </div>
</div>

  );
}
