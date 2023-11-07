//import './style.css'; 
import React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';


export function Landing_Page(props) {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [familyErrorMessage, setFamilyErrorMessage] = useState('');

  // const handleadmin = () => {
  //   navigate('/admin');
  // };

  // Logic to enter into firstquestion only if valid inputs(zipcode and family members) are given
  const handleFirstQuestion = () => {
    // Check if the zipCode is empty
    if (!zipCode && !familyMembers) {
      setErrorMessage('Please enter the Zip Code');
      setFamilyErrorMessage('Please enter this mandatory field');
      return; // Don't navigate
    }
    if (!zipCode) {
      setErrorMessage('Please enter the Zip Code');
      return; // Don't navigate
    }
    if (!familyMembers) {
      setFamilyErrorMessage('Please enter this mandatory field');
      return; // Don't navigate
    }
    else {
      navigate('/question', { state: { zip: zipCode, familySize: familyMembers } });
      console.log('Navigating to the next page...');
      // // Make an Axios call to the utility API endpoint with the entered zipCode
      // axiosInstance.get(`/api/utility/${zipCode}`)
      //     .then(response => {
      //         // If response contains data, navigate to the first question page
      //         navigate('/question', { state: { zip: zipCode, familySize: familyMembers } });
      //         console.log('Navigating to the next page...');
      //     })
      //     .catch(error => {
      //         // If an error occurs, most likely the zipcode is not found in the utility table
      //         if (error.response && error.response.status === 404) {
      //             setErrorMessage('Not a valid Zipcode');
      //         } else {
      //             // Handle other errors such as server errors or network issues
      //             console.error("Error fetching the utility table:", error);
      //             setErrorMessage('An error occurred. Please try again.');
      //         }
      //     });
    }
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
          borderRadius: '20px 20px',
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <video
          style={{
            width: '97%',
            height: '97%',
            objectFit: 'cover',
            transform: 'scale(1.0, 1.5)', // Adjust the scale as needed to maintain the aspect ratio
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
      <div style={{ width: '485px', height: '397px', left: '128px', top: '400px', position: 'absolute', background: '#EDF7FC', borderRadius: '20px' }}></div>
      <div style={{ width: '482px', height: '28px', left: '131px', top: '450px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 500, wordWrap: 'break-word' }}>Answer below questions to start calculating your carbon footprint</div>
      <div>
        <div style={{ width: '398px', height: '100px', left: '169px', top: '520px', position: 'absolute' }}>
          <div style={{ width: '0.82px', height: '12px', left: '257.67px', top: '74px', position: 'absolute' }}></div>
          <div style={{ width: '398px', height: '100px', left: '0px', top: '0px', position: 'absolute', background: '#007ea7', borderRadius: '15px' }}></div>
          <div style={{ left: '80px', top: '15px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>Please enter your Zip Code</div>
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
          <div style={{ color: 'red', position: 'absolute', left: '82.06px', top: '35px' }}>{errorMessage}</div>



        </div>
        <div style={{ width: '398px', height: '100px', left: '169px', top: '650px', position: 'absolute' }}>
          <div style={{ width: '1px', height: '12px', left: '261px', top: '74px', position: 'absolute' }}></div>
          <div style={{ width: '398px', height: '100px', left: '0px', top: '0px', position: 'absolute', background: '#007ea7', borderRadius: '15px' }}></div>
          <div style={{ left: '35px', top: '12px', position: 'absolute', color: 'black', fontSize: '20px', fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 400, wordWrap: 'break-word' }}>How many members in your family?</div>
          <input
            type="text"
            name="numericValue"
            placeholder="Enter Number"
            maxLength="1"
            required
            value={familyMembers}
            onChange={(e) => {
              setFamilyMembers(e.target.value);
              if (e.target.value.trim() !== '') {
                setFamilyErrorMessage('');  // clear the error message
              }
            }}
            style={{ width: '234px', height: '33px', position: 'absolute', left: '80px', top: '53px', background: 'white', borderRadius: '300px', border: 'none', padding: '0px 10px', outline: 'none' }}
          />

          <div style={{ color: 'red', position: 'absolute', left: '82.06px', top: '35px' }}>{familyErrorMessage}</div>


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
      <div style={{ width: '100%', height: '30px', left: '0px', top: '974px', position: 'absolute', background: '#ff9d76', backdropFilter: 'blur(4px)' }}></div>

    </div>

  );
}

export default Landing_Page;


