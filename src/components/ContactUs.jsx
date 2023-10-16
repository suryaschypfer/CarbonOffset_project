import React from 'react';
import './ContactUs.css';
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ContactUs = () => {
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState('');
    const [FErrorMessage, setFErrorMessage] = useState('');
    const [LErrorMessage, setLErrorMessage] = useState('');
    const [EErrorMessage, setEErrorMessage] = useState('');
    const [SuccessMessage, setSuccessMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');

    const handlelandingpage = () => {
        navigate('/');
    };

    const handleFNameChange = (e) => {
        const { name, value } = e.target;
        const regex = /^[a-zA-Z ]+$/; // Regular expression to match only alphabets and spaces
        if (!regex.test(value) && value !== '') {
            setFErrorMessage('Please enter only alphabets');
            setTimeout(() => {
                setFErrorMessage('');
            }, 1000);
            e.target.value = '';
        } else {
            setFErrorMessage('');
            if (name === 'firstName') {
                setFirstName(value);
            } 
            // else if (name === 'lastName') {
            //     setLastName(value);
            // }
        }
    };

    const handleLNameChange = (e) => {
        const { name, value } = e.target;
        const regex = /^[a-zA-Z ]+$/; // Regular expression to match only alphabets and spaces
        if (!regex.test(value) && value !== '') {
            setLErrorMessage('Please enter only alphabets');
            e.target.value = '';
            setTimeout(() => {
                setLErrorMessage('');
            }, 1000);
        } else {
            setLErrorMessage('');
            if (name === 'firstName') {
                setFirstName(value);
            }
            //  else if (name === 'lastName') {
            //     setLastName(value);
            // }
        }
    };

    const handleSend = () => {
        const firstName = document.querySelector('.FName input').value;
        const lastName = document.querySelector('.LName input').value;
        const email = document.querySelector('.Email input').value;
        const query = document.querySelector('.Query input').value;

        if (!firstName) {
            setFErrorMessage('First Name is a required');
            setTimeout(() => {
                setFErrorMessage('');
              }, 1000);
            return;
        }
        
        if (!lastName) {
            setLErrorMessage('Last Name is a required');
            setTimeout(() => {
                setLErrorMessage('');
              }, 1000);
            return;
        }

        if (!email) {
            setEErrorMessage('Email is required');
            setTimeout(() => {
                setEErrorMessage('');
              }, 1000);
            return;
        }



        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        setEErrorMessage('Please enter a valid email address');
         setTimeout(() => {
            setEErrorMessage('');
        }, 1000);
        return;
        }

    
        // Assuming you have an API endpoint for sending the data
        const data = {
            firstName,
            lastName,
            email,
            query
        };
    
        // Use axios or fetch to send the data to the backend
  axios.post("http://localhost:3000/api/ContactUs", data)
  .then(response => {
    if (response.status === 200) {
        setSuccessMessage('Enquiry and Customer added successfully');
        setFirstName('');
        setLastName('');
        setEmail('');
        setQuery('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 1000);
    } else {
      setErrorMessage('Error adding the Enquiry and Customer');
    }
    setTimeout(() => {
      setErrorMessage('');
    }, 2000);
  })
  .catch(error => {
    console.error(error);
    setErrorMessage('Error adding into the Enquiry and Customer');
    setTimeout(() => {
      setErrorMessage('');
    }, 2000);
  });
    };

    return (
        <div className="contact">
            <nav className="nav-bar">
                <div className="leftnav">
                    <span>Carbon Offset</span>
                </div>
                <div className="rightnav">
                    <a href="#" onClick={handlelandingpage}>Home</a>
                    <a href="#">About Us</a>
                    <a href="#">Calculator</a>
                    <a href="#">Admin</a>
                    <a href="#" className ="ContactUs">Contact Us</a>
                </div>

            </nav>
            <div className="page">
                <div className="text-container">
                    <div className="contact">Contact Us</div>
                    <p className="conv">
                        Let’s have a conversation!! <br />
                        Fill the below form with your query and someone from our team will reach out to you soon.
                    </p>
                    <div className='custdetails'>
                        <div className ="FName">
                            First Name*
                            <br />
                            <input type="text" placeholder="Enter your first name" onChange={handleFNameChange} />
                            {FErrorMessage && <div className="error-message">{FErrorMessage}</div>}
                        </div>
                        <div className ="LName">
                            Last Name*
                            <br />
                            <input type="text" placeholder="Enter your last name" onChange={handleLNameChange} />
                            {LErrorMessage && <div className="error-message">{LErrorMessage}</div>}
                        </div>
                        <div className='Email'>
                            Email*
                            <br />
                            <input type="text" placeholder="Your email please" />
                            {EErrorMessage && <div className="error-message">{EErrorMessage}</div>}
                        </div>
                        <div className='Query'>
                            Query
                            <br />
                            <input type="text" placeholder="What is your query" />
                        </div>
                        <div className="send">
                            <button onClick={handleSend} className="send-button">Send</button>
                        </div>
                    </div>

                </div>
                <div className="image-container">
                    <img src="landingPageImage.png" alt="image" className="image" />
                </div>
                <footer className="bottom_div"></footer>
            </div>
            {/* {ErrorMessage && <div className="error-message">{ErrorMessage}</div>} */}
            {SuccessMessage && <div className="success-message">{SuccessMessage}</div>}
        </div>
    );
};

export default ContactUs;