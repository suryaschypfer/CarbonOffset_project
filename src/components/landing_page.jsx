import React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import DynamicQuestionPage2 from './DynamicQuestionPage2';
import './landing_page.css';

export function Landing_Page(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const codeForZip = new URLSearchParams(location.search).get('zip');
  const [userAge, setUserAge] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [familyErrorMessage, setFamilyErrorMessage] = useState('');

  const handleadmin = () => {
    navigate('/admin');
  };

  useEffect(() => {
    const savedZipCode = Cookies.get('zipCode');
    const savedFamilyMembers = Cookies.get('familyMembers');
    const savedUserAge = Cookies.get('userAge'); // Retrieve the userAge value from cookies
  
    if (savedZipCode) setZipCode(savedZipCode);
    if (savedFamilyMembers) setFamilyMembers(savedFamilyMembers);
    if (savedUserAge) setUserAge(savedUserAge); // Set the userAge state with the retrieved value
  }, []);
  

  // Construct the data to send in the request body
  const data = {
    familyMembers: familyMembers,
    ageGroup: userAge
  };

  // Use axiosInstance to send a POST request
  axiosInstance.post("/api/setFamilyMembers", data)
    .then(response => {
      console.log('Family members data sent successfully.');
    })
    .catch(error => {
      // Error handling here
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Failed to send family members data to the server.', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received when attempting to send family members data to the server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    });



  // Logic to enter into firstquestion only if valid inputs(zipcode and family members) are given
  const handleFirstQuestion = () => {

    // Check if the zipCode is empty
    if (!zipCode && !familyMembers) {
      setErrorMessage('Please enter this field to continue');
      setFamilyErrorMessage('Please enter this field to continue');
      return; // Don't navigate
    }

    if (!zipCode) {
      setErrorMessage('Please enter this field to continue');
      return; // Don't navigate
    }

    // Check if familyMembers is one or two digits
    if (!familyMembers || !/^\d{1,2}$/.test(familyMembers)) {
      setFamilyErrorMessage('Please enter this field to continue');
      return; // Don't navigate
    }

    Cookies.set('zipCode', zipCode, { expires: 500 / (24 * 60) }); // 5 minutes expiry
    Cookies.set('familyMembers', familyMembers, { expires: 500 / (24 * 60) }); // 5 minutes expiry
    Cookies.set('userAge', userAge, { expires: 500 / (24 * 60) }); // Store the userAge in cookies

    // If all validations pass, navigate to the next page
    navigate(`/question/0?zip=${zipCode}&familySize=${familyMembers}&ageGroup=${userAge}`, { state: { zip: zipCode, familySize: familyMembers, userAge: userAge} });

    console.log('Family Members', familyMembers);
    console.log('Navigating to the next page...');
  };

  const handleContactUs = () => {
    navigate('/contactus');
  };

  const handleAboutUs = () => {
    navigate('/aboutus');
  };

  return (
    <div style={{ background: 'white' }}>
      <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
        <div className="leftnav">
          <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" />
        </div>
        <div className="rightnav">
          <a href="#" className="selected">Home</a>
          <a href="#" onClick={handleAboutUs}>About Us</a>
          <a href="#" onClick={handleContactUs}>Contact Us</a>
        </div>

      </nav>

      <div className='landingpage_start'>
        <div className='container_main'>
          <div className='vedio_start_gif'>
            <video autoPlay muted loop>
              <source src="https://video.wixstatic.com/video/c253c4_51f0cf76ff124d7783cc34c394893ed3/720p/mp4/file.mp4" type="video/mp4" />
            </video>
            <div className='text_overlay'>
              <div className='vedio_heading'>Empowering You to Plant a Greener Future</div>
              <div className='vedio_paragragh'>At Offset CRBN, we're on a mission to make a positive impact on our planet's health. We understand that in today's world, it's essential to take responsibility for our carbon footprint. That's why we've created a simple yet powerful platform that empowers individuals like you to take action and make a difference.</div>
            </div>
          </div>
        </div>


        <div className='form_to_questions'>
          <div className='form_start'>Answer below questions to start calculating your carbon footprint</div>
          <div className='zipcode_information'>
            <div className='zipcode_heading'>Enter your Zipcode</div>
            <input
              type="text"
              name="zipcode"
              id="zipcode"
              placeholder="Enter ZIP Code"
              required
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setErrorMessage('');  // clear error message
              }}
            />
            <div className='Zipcode_error'>{errorMessage}</div>
          </div>

          <div className='Family_information'>
            <div className='Family_heading'>How many members in your family?</div>
            <input
              type="text"
              name="numericValue"
              placeholder="Enter Number"
              maxLength="2"
              required
              value={familyMembers}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d*$/.test(input)) {
                  setFamilyMembers(input);
                  setFamilyErrorMessage('');  // clear the error message
                } else {
                  setFamilyErrorMessage('Please enter a valid number');
                }
              }}
            />
            <div className='Family_error' >{familyErrorMessage}</div>
          </div>

          <div className='Age_information'>
            <div className='Age_heading'>Select Your Age Group</div>
            <select
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
            >
              <option value="" disabled hidden>Select Age Group</option>
              <option value="Teenager (Under 18)">Teenager (Under 18)</option>
              <option value="Young Adult (19 to 39)">Young Adult (19 to 39)</option>
              <option value="Middle-Aged Adult (40 to 65)">Middle-Aged Adult (40 to 65)</option>
              <option value="Senior Citizen (Above 65)">Senior Citizen (Above 65)</option>
            </select>
            <div className='Family_error'>{familyErrorMessage}</div>
          </div>


          <div className='landing_button'>
            <button type="button" onClick={handleFirstQuestion}> Get Started</button>
          </div>


        </div>
      </div>
    </div >
  );
}

export const exportedZipCode = Landing_Page.zipCode;

export default Landing_Page;


