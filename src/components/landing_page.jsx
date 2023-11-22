import React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';
import { useLocation } from 'react-router-dom';
// import Cookies from 'js-cookie';
import DynamicQuestionPage2 from './DynamicQuestionPage2';
import axios from 'axios';

export function Landing_Page(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const codeForZip = new URLSearchParams(location.search).get('zip');
  // const [zipCode, setZipCode] = useState(Cookies.get('zipCode') || '');
  const [zipCode, setZipCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [familyMembers, setFamilyMembers] = useState(Cookies.get('familyMembers') || '');
  const [familyMembers, setFamilyMembers] = useState('');
  const [familyErrorMessage, setFamilyErrorMessage] = useState('');

  const handleadmin = () => {
    navigate('/admin');
  };


  // Construct the data to send in the request body
  const data = {
    familyMembers: familyMembers
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

    // Cookies.set('zipCode', zipCode, { expires: 5 / (24 * 60) }); // 5 minutes expiry
    // Cookies.set('familyMembers', familyMembers, { expires: 5 / (24 * 60) }); // 5 minutes expiry

    // If all validations pass, navigate to the next page
    navigate(`/question/0?zip=${zipCode}&familySize=${familyMembers}`, { state: { zip: zipCode, familySize: familyMembers } });

    console.log('Family Members', familyMembers);
    console.log('Navigating to the next page...');
  };




  return (
    <div style={{ background: 'white' }}>
      <Header />
      {/* <img style={{width: '842px', height: '497px', left: '598px', top: '301px', position: 'absolute', outline: 'none' , border: 'none' , userSelect: 'none' , pointerEvents: 'none'}} src="LandingPageImage.png" alt="Landing Page" /> */}
      <div
        style={{
          width: '700px',
          height: '550px',
          left: '700px',
          top: '200px',
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
            src="https://video.wixstatic.com/video/c253c4_51f0cf76ff124d7783cc34c394893ed3/720p/mp4/file.mp4"
            type="video/mp4"
          />
        </video>
      </div>


      <div style={{ width: '500px', height: '552px', left: '128px', top: '219px', position: 'absolute' }}>
        <div style={{ width: '500px', height: '88px', left: '0px', top: '-100px', position: 'absolute', color: 'black', fontSize: '32px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 700, wordWrap: 'break-word' }}>Empowering You to Plant a Greener Future</div>
        <div>
          <div style={{ width: '482px', height: '434px', left: '3px', top: '-10px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word', textAlign: 'justify' }}>At Offset CRBN, we're on a mission to make a positive impact on our planet's health. We understand that in today's world, it's essential to take responsibility for our carbon footprint. That's why we've created a simple yet powerful platform that empowers individuals like you to take action and make a difference.</div>
        </div>
      </div>
      <div style={{ width: '485px', height: '397px', left: '128px', top: '430px', position: 'absolute', background: '#EDF7FC', borderRadius: '20px' }}></div>
      <div style={{ width: '482px', height: '28px', left: '131px', top: '450px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 500, wordWrap: 'break-word' }}>Answer below questions to start calculating your carbon footprint</div>
      <div>
        <div style={{ width: '398px', height: '100px', left: '169px', top: '520px', position: 'absolute' }}>
          <div style={{ width: '0.82px', height: '12px', left: '257.67px', top: '74px', position: 'absolute' }}></div>
          <div style={{ width: '398px', height: '100px', left: '0px', top: '0px', position: 'absolute', background: 'rgb(255, 87, 1)', borderRadius: '15px' }}></div>
          <div style={{ left: '110px', top: '15px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>Enter your Zipcode</div>
          <input
            type="text"
            name="zipcode"
            id="zipcode"
            placeholder="Enter ZIP Code"
            style={{ width: '233.88px', height: '33px', position: 'absolute', left: '82.06px', top: '53px', background: 'white', borderRadius: '300px', border: 'none', padding: '0px 10px' }}
            required
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
              setErrorMessage('');  // clear error message
            }}
          />
          {/* Conditionally render the error message */}
          <div style={{ color: '#FFD699', position: 'absolute', left: '92.06px', top: '35px' }}>{errorMessage}</div>



        </div>
        <div style={{ width: '398px', height: '100px', left: '169px', top: '650px', position: 'absolute' }}>
          <div style={{ width: '1px', height: '12px', left: '261px', top: '74px', position: 'absolute' }}></div>
          <div style={{ width: '398px', height: '100px', left: '0px', top: '0px', position: 'absolute', background: 'rgb(255, 87, 1)', borderRadius: '15px' }}></div>
          <div style={{ left: '35px', top: '12px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>How many members in your family?</div>
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
            style={{ width: '234px', height: '33px', position: 'absolute', left: '80px', top: '53px', background: 'white', borderRadius: '300px', border: 'none', padding: '0px 10px', outline: 'none' }}
          />

          <div style={{ color: '#FFD699', position: 'absolute', left: '82.06px', top: '35px' }}>{familyErrorMessage}</div>


        </div>

        <div style={{ width: '285px', height: '56px', left: '226px', top: '845px', position: 'absolute' }}>
          <div
            style={{
              display: 'block',
              width: '285px',
              height: '56px',
              left: '0px',
              top: '-10px',
              position: 'absolute',
              background: 'black',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '300px',
              border: '1px black solid',
              textAlign: 'center',
              lineHeight: '56px',
              textDecoration: 'none',
              color: 'black',
              cursor: 'pointer',
            }}
            onClick={handleFirstQuestion}
          >
            <div
              style={{
                left: '90px',
                top: '0px',
                position: 'absolute',
                color: 'white',
                fontSize: '20px',
                fontFamily: '"Helvetica Neue", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              Get Started
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '30px', left: '0px', top: '974px', position: 'absolute', background: 'rgb(255, 87, 1)', backdropFilter: 'blur(4px)' }}></div>

    </div>

  );
}

export const exportedZipCode = Landing_Page.zipCode;

export default Landing_Page;


