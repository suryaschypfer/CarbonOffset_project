import React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import DynamicQuestionPage2 from './DynamicQuestionPage2';
import './landing_page.css';
import Modal from

  'react-bootstrap/Modal';

const NavigationModal = ({ show, onHide, handleNavigation }) => {
  const navigate = useNavigate();
  const handleaboutus = () => {
    navigate('/aboutus'); // Use navigate to go to the desired route
  };
  const navigateToHome = () => {
    navigate('/');
  }
  const handleContactUs = () => {
    navigate('/ContactUs'); // Use navigate to go to the desired route
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Navigation Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul >
          <li onClick={navigateToHome} >Home</li>
          <li onClick={handleaboutus }>About Us</li>
          
          <li onClick={handleContactUs }>Contact Us</li>
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export function Landing_Page(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const codeForZip = new URLSearchParams(location.search).get('zip');
  const [userAge, setUserAge] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [familyErrorMessage, setFamilyErrorMessage] = useState('');
  const [ageErrorMessage, setAgeErrorMessage] = useState('');

  const handleadmin = () => {
    navigate('/admin');
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth <= 800; // You can adjust the threshold based on your needs
      setIsMobile(isMobileDevice);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const savedZipCode = Cookies.get('zipCode');
    const savedFamilyMembers = Cookies.get('familyMembers');
    const savedUserAge = Cookies.get('userAge');

    if (savedZipCode) setZipCode(savedZipCode);
    if (savedFamilyMembers) setFamilyMembers(savedFamilyMembers);
    if (savedUserAge) setUserAge(savedUserAge);
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
    if (!zipCode && !familyMembers && !userAge) {
      setErrorMessage('Please enter this field to continue');
      setFamilyErrorMessage('Please enter this field to continue');
      setAgeErrorMessage('Please enter this field to continue');
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

    if (!userAge) {
      setAgeErrorMessage('Please select your age group to continue');
      return; // Don't navigate
    }

    Cookies.set('zipCode', zipCode, { expires: 500 / (24 * 60) }); // 5 minutes expiry
    Cookies.set('familyMembers', familyMembers, { expires: 500 / (24 * 60) }); // 5 minutes expiry
    Cookies.set('userAge', userAge, { expires: 500 / (24 * 60) }); // Store the userAge in cookies

    // If all validations pass, navigate to the next page
    navigate(`/question/0?zip=${zipCode}&familySize=${familyMembers}&ageGroup=${userAge}`, { state: { zip: zipCode, familySize: familyMembers, userAge: userAge } });

    console.log('Family Members', familyMembers);
    console.log('Navigating to the next page...');
  };

  const handleContactUs = () => {
    navigate('/contactus');
  };

  const handleAboutUs = () => {
    navigate('/aboutus');
  };
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  const toggleSideNav = () => {
    setShowNavigationModal(!showNavigationModal);
  };

  const handleNavigation = (destination) => {
    // Add logic to handle navigation based on the selected option (e.g., using React Router)
    console.log(`Navigating to ${destination}`);
  };

  return (
    <>
    {isMobile&& <div>
      <NavigationModal
          show={showNavigationModal}
          onHide={() => setShowNavigationModal(false)}
          handleNavigation={handleNavigation}
        />

        {/* Overlay backdrop */}
        {showNavigationModal && <div className="overlay" onClick={toggleSideNav}></div>}

        {/* Navigation bar */}
        <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
          <div className="leftnav">
            <img className="mainlogo" style={{ width: "205px" }} src="/logo.svg" alt="OFFSET CRBN" onClick={handleNavigation} />
          </div>
          <div className="leftnav" style={{fontSize:"40px", fontWeight:"lighter"}} onClick={toggleSideNav}>
          ☰
            </div>
          
        </nav>
        <div className='landingpage_start'>
        <div className='container_mai'>
          <div className='vedio_start_gif'>
            <video autoPlay muted loop style={{ opacity: 1 }}>
              {/* <source src="https://video.wixstatic.com/video/c253c4_51f0cf76ff124d7783cc34c394893ed3/720p/mp4/file.mp4" type="video/mp4" /> */}
              <source src="https://video.wixstatic.com/video/11062b_d578b9d4ffba48c68d086ec29fe9e6f0/720p/mp4/file.mp4" type="video/mp4" />
            </video>
            <div className='text_overlay'>
              <div className='vedio_headin' style={{height:"50px", fontSize:"20px", fontWeight:"bold"}}>Empowering You to Plant a Greener Future</div>
              <div className='vedio_paragrag' style={{height:"100px", fontSize:"15px", paddingLeft:"10px", paddingRight:"10px"}}>At Offset CRBN, we're on a mission to make a positive impact on our planet's health. We understand that in today's world, it's essential to take responsibility for our carbon footprint. That's why we've created a simple yet powerful platform that empowers individuals like you to take action and make a difference.</div>
            </div>
          </div>
        </div>


        
      </div>
      <div className='form_to_questions' style={{marginTop:"20px"}}>
          <div className='form_start'>Answer below questions to start calculating your carbon footprint</div>
          <div className='zipcode_information'>
            <div className='zipcode_heading'>Enter your Zipcode</div>
            <input
              type="text"
              className='input_text_landingpage'
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
              className='input_text_landingpage'
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
              onChange={(e) => {
                setUserAge(e.target.value);
                setAgeErrorMessage('');  // Clear the error message
              }}
            >
              <option value="" disabled hidden>Select Age Group</option>
              <option value="Under 18">Under 18</option>
              <option value="19 to 39">19 to 39</option>
              <option value="40 to 65">40 to 65</option>
              <option value="Above 65">Above 65</option>
            </select>
            <div className='Family_error'>{ageErrorMessage}</div>
          </div>


          <div className='landing_button'>
            <button type="button" onClick={handleFirstQuestion}> Get Started</button>
          </div>


        </div>
      </div>}
    {!isMobile&&
    <div style={{ background: 'white' }}>
      <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
        <div className="leftnav">
          <img className="mainlogo" src="/logo.svg" alt="OFFSET CRBN" style={{height:"70px"}}/>
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
            <video autoPlay muted loop style={{ opacity: 1 }}>
              {/* <source src="https://video.wixstatic.com/video/c253c4_51f0cf76ff124d7783cc34c394893ed3/720p/mp4/file.mp4" type="video/mp4" /> */}
              <source src="https://video.wixstatic.com/video/11062b_d578b9d4ffba48c68d086ec29fe9e6f0/720p/mp4/file.mp4" type="video/mp4" />
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
              className='input_text_landingpage'
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
              className='input_text_landingpage'
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
              onChange={(e) => {
                setUserAge(e.target.value);
                setAgeErrorMessage('');  // Clear the error message
              }}
            >
              <option value="" disabled hidden>Select Age Group</option>
              <option value="Under 18">Under 18</option>
              <option value="19 to 39">19 to 39</option>
              <option value="40 to 65">40 to 65</option>
              <option value="Above 65">Above 65</option>
            </select>
            <div className='Family_error'>{ageErrorMessage}</div>
          </div>


          <div className='landing_button'>
            <button type="button" onClick={handleFirstQuestion}> Get Started</button>
          </div>


        </div>
      </div>
    </div >}</>
  );
}

export const exportedZipCode = Landing_Page.zipCode;

export default Landing_Page;


