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

            <div
        style={{
          width: '600px',
          height: '230px',
          left: '800px',
          top: '100px',
          borderRadius: '20px',
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '20px', // Adjust the scale as needed to maintain the aspect ratio
            outline: 'none',
            border: 'none',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          autoPlay
          muted
          loop
        >
          <source
            src="https://video.wixstatic.com/video/11062b_d578b9d4ffba48c68d086ec29fe9e6f0/720p/mp4/file.mp4"
            type="video/mp4"
          />
        </video>
      </div>


      <div
        style={{
          width: '600px',
          height: '230px',
          left: '100px',
          top: '370px',
          borderRadius: '20px',
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '20px', // Adjust the scale as needed to maintain the aspect ratio
            outline: 'none',
            border: 'none',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          autoPlay
          muted
          loop
        >
          <source
      src="https://video.wixstatic.com/video/11062b_616ea7fc12e64f158a528c7e04cb4fc9/480p/mp4/file.mp4"
      type="video/mp4"
          />
        </video>
      </div>

      <div
        style={{
          width: '600px',
          height: '230px',
          left: '800px',
          top: '600px',
          borderRadius: '20px',
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '20px', // Adjust the scale as needed to maintain the aspect ratio
            outline: 'none',
            border: 'none',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          autoPlay
          muted
          loop
        >
          <source
      src="https://video.wixstatic.com/video/11062b_5ae1557b0cb244ab80dabfa817f48caa/480p/mp4/file.mp4"
      type="video/mp4"
          />
        </video>
      </div>

      <div
        style={{
          width: '600px',
          height: '230px',
          left: '100px',
          top: '920px',
          borderRadius: '20px',
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '20px', // Adjust the scale as needed to maintain the aspect ratio
            outline: 'none',
            border: 'none',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          autoPlay
          muted
          loop
        >
          <source
      src="https://video.wixstatic.com/video/11062b_b21f82750bf3464da0b803cc5304b4e9/480p/mp4/file.mp4"
      type="video/mp4"
          />
        </video>
      </div>


  {/* <img style={{ width: 842, height: 497, left: 598, top: 241, position: "absolute" }} src="Lying_in_Green_Field.webp" /> */}
  <div style={{ width: 1163, height: 10, left: 130, top: 166, position: "absolute" }}>
    <div style={{ width: 1135, height: 0, left: 2, top: 0, position: "absolute" }}>  
      <div style={{ width: 1135, height: 88, left: 0, top: -50, position: "absolute", color: "black", fontSize: 32, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "700", wordWrap: "break-word" }}>About Us</div>
      <div style={{ width: 660, height: 0, left: 1, top: -10, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "400", wordWrap: "break-word" }}>
        At Offset CRBN, we are driven by a shared vision of a cleaner, greener world. Our journey began with a simple yet profound realization: the choices we make in our daily lives have a direct impact on the health of our planet. This realization ignited our passion to create a platform that empowers individuals to take meaningful action against climate change.
      </div>
    </div>
    <div style={{ width: 567, height: 25, left: 600, top: 650, position: "absolute" }}>
      <div style={{ width: 567, height: 88, left: 0, top: 60, position: "absolute", color: "black", fontSize: 32, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "700", wordWrap: "break-word" }}>Join the Movement</div>
      <div style={{ width: 660, height: 25, left: 1, top: 100, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "400", wordWrap: "break-word" }}>
        We invite you to join us on this journey towards a more sustainable and environmentally conscious future. Whether you're an individual looking to offset your carbon footprint, a company seeking to make a corporate impact, or an advocate for positive change, there's a place for you here at Offset CRBN.
        <br />
        Together, we can turn the tide against climate change, protect our planet's natural beauty, and leave a legacy of sustainability for future generations. Join Offset CRBN, plant trees, and be part of the solution.
        <br />
        Thank you for being part of our mission to offset carbon and create a greener, more sustainable world. Together, we can make a lasting impact.
      </div>
    </div>
    <div style={{ width: 567, height: 25, left: 2, top: 416, position: "absolute" }}>
      <div style={{ width: 567, height: 88, left: 0, top: 60, position: "absolute", color: "black", fontSize: 32, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "700", wordWrap: "break-word" }}>Our Impact</div>
      <div style={{ width: 660, height: 25, left: 1, top: 100, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "400", wordWrap: "break-word" }}>
        Since our inception, Offset CRBN has made a significant impact on the fight against climate change. Our community members have collectively planted thousands of trees, offsetting tons of carbon emissions. But we're just getting started. With your support, we can make an even greater difference.
      </div>
    </div>
    <div style={{ width: 585, height: 25, left: 600, top: 156, position: "absolute" }}>
      <div style={{ width: 585, height: 88, left: 0, top: 80, position: "absolute", color: "black", fontSize: 32, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "700", wordWrap: "break-word" }}>Our Mission</div>
      <div style={{ width: 660, height: 25, left: 1, top: 120, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "400", wordWrap: "break-word" }}>
        Our mission is clear: to combat climate change, one tree at a time. We believe that every person has the power to make a positive environmental impact. By providing tools, resources, and a supportive community, we aim to make sustainable living accessible and rewarding for everyone.
      </div>
    </div>

     
  


    <div style={{ width: 500, height: 150, left: 2, top: 1050, position: "absolute" }}>
         {/* Display contact information */}
      <img style={{ width: 40, height: 40, left: 77, top: 5, position: "absolute" }} src="email.png" />
      <img style={{ width: 50, height: 50, left: 507, top: 0, position: "absolute" }} src="phone.jpeg" />
      <img style={{ width: 50, height: 50, left: 937, top: 0, position: "absolute" }} src="pin.png" />

                    {/* <div style={{ width: 500, height: 25, left: 1, top: 0, position: "absolute", color: "black", fontSize: 32, fontFamily: '"Helvetica Neue", sans-serif', fontWeight: "700", wordWrap: "break-word" }}>Contact Information</div> */}
                    <div style={{ width: 500, height: 25, left: 1, top: 50, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', wordWrap: "break-word" }}>
                        <p>{email}</p>
                    </div>
                    <div style={{ width: 500, height: 25, left: 471, top: 50, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', wordWrap: "break-word" }}>
                    <p>{phone}</p>
                    </div>
                    <div style={{ width: 400, height: 25, left: 851, top: 50, position: "absolute", color: "black", fontSize: 20, fontFamily: '"Helvetica Neue", sans-serif', wordWrap: "break-word" }}>
                    <p>{address}</p>
                    </div>
                </div>
  </div>
</div>
  );
}
