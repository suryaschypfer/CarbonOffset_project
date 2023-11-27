import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosconfig";
// import logoImg from "../logo2.png";
import logoImg from "../assets/logo.svg";
import './aboutus.css';

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
    <div className='main_aboutus'>
      <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%'}}>
        <div className="leftnav">
          <img className="mainlogo" src="/logo.svg" alt="OFFSET CRBN123" onClick={handlelandingpage}/>
        </div>
        <div className="rightnav">
        <a href="#" onClick={handlelandingpage}>Home</a>
          <a href="#" className="selected" >About Us</a>
          <a href="#" onClick={handleContactUs}>Contact Us</a>
        </div>

      </nav>

      <div className='aboutus_startcontainer'>
        <div className='block1'>
          <div className='information_1'>
            At Offset CRBN, we are driven by a shared vision of a cleaner, greener world. Our journey began with a simple yet profound realization: the choices we make in our daily lives have a direct impact on the health of our planet. This realization ignited our passion to create a platform that empowers individuals to take meaningful action against climate change.
          </div>
          <div className='Vedio_1'>
            <video
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
        </div>
        <div className='block2'>
          <div className='infomation_2'>
            Our mission is clear: to combat climate change, one tree at a time. We believe that every person has the power to make a positive environmental impact. By providing tools, resources, and a supportive community, we aim to make sustainable living accessible and rewarding for everyone.
          </div>
          <div className='Vedio_2'>
            <video
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
        </div>

        <div className='block3'>
          <div className='information_3'>
            Since our inception, Offset CRBN has made a significant impact on the fight against climate change. Our community members have collectively planted thousands of trees, offsetting tons of carbon emissions. But we're just getting started. With your support, we can make an even greater difference.
          </div>
          <div className='Vedio_3' >
            <video
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
        </div>

        <div className='block4'>
          <div className='information_4'>
            We invite you to join us on this journey towards a more sustainable and environmentally conscious future. Whether you're an individual looking to offset your carbon footprint, a company seeking to make a corporate impact, or an advocate for positive change, there's a place for you here at Offset CRBN.
            <br />
            Thank you for being part of our mission to offset carbon and create a greener, more sustainable world. Together, we can make a lasting impact.
          </div>
          <div className='Vedio_4'>
            <video
              autoPlay
              muted
              loop
            >
              <source
                src="https://video.wixstatic.com/video/11062b_77378fc0da68439ebd8fd24a2f51e50c/1080p/mp4/file.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        <div className='info_details'>
          <p className='heading_contactus'>Contact Details:</p>
          <div className='aboutus_details_info'>
            <div className='Emailinfo'>
              <img className='emailpicture' src="email.png" alt="Email Icon" />
              <div className='email_info_from_db'>
                <p>{email}</p>
              </div>
            </div>
            <div className='phonoInfo'>
              <img className='phonepicture' src="phone.jpeg" alt="Phone Icon" />
              <div className='phone_info_from_db'>
                <p>{phone}</p>
              </div>
            </div>
            <div className='Pininfo'>
              <img className='pinpicture' src="pin.png" alt="Location Icon" />
              <div className='pin_info_from_db'>
                <p>{address}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
