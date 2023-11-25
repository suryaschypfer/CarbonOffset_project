import React from 'react';
import './ContactUs.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';
import logoImg from "../logo2.png";


export const ContactUs = () => {
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState('');
    const [FErrorMessage, setFErrorMessage] = useState('');
    const [LErrorMessage, setLErrorMessage] = useState('');
    const [EErrorMessage, setEErrorMessage] = useState('');
    const [AErrorMessage, setAErrorMessage] = useState('');
    const [SuccessMessage, setSuccessMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');

    const handlelandingpage = () => {
        navigate('/');
    };

    const handleaboutus = () => {
        navigate('/aboutus');
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

    // const handleAgeChange = (e) => {
    //     const inputAge = e.target.value;
    //     if (!/^\d+$/.test(inputAge)) {
    //       setAErrorMessage('Age must be a number');
    //     } else {
    //       setAErrorMessage('');
    //     }
    //     setAge(inputAge);
    //   };

    const handleSend = () => {
        const firstNameInput = document.querySelector('.FName input')
        const lastNameInput = document.querySelector('.LName input')
        const emailInput = document.querySelector('.Email input')
        const queryInput = document.querySelector('.Query textarea')

        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;
        const query = queryInput.value;


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

        // if (!age) {
        //     setAErrorMessage('Age is a required');
        //     setTimeout(() => {
        //         setAErrorMessage('');
        //       }, 1000);
        //     return;
        // }

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

        const data = {
            firstName,
            lastName,
            email,
            query
        };


        axiosInstance.post("/api/ContactUs", data)
            .then(response => {
                if (response.status === 200) {
                    firstNameInput.value = '';
                    lastNameInput.value = '';
                    emailInput.value = '';
                    queryInput.value = '';
                    setSuccessMessage('Enquiry and Customer added successfully');
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
            <nav className="nav-bar" style={{ borderBottom: '1px solid #000', display: 'flex', width: '100%' }}>
                <div className="leftnav">
                    <img className="mainlogo" src="/logo2.png" alt="OFFSET CRBN" onClick={handlelandingpage} />
                </div>
                <div className="rightnav">
                    <a href="#" onClick={handlelandingpage}>Home</a>
                    <a href="#" onClick={handleaboutus} >About Us</a>
                    <a href="#" className="selected">Contact Us</a>
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
                        <div className="FName">
                            First Name*
                            <br />
                            <input type="text" placeholder="Enter your first name" onChange={handleFNameChange} />
                            {FErrorMessage && <div className="error-message">{FErrorMessage}</div>}
                        </div>
                        <div className="LName">
                            Last Name*
                            <br />
                            <input type="text" placeholder="Enter your last name" onChange={handleLNameChange} />
                            {LErrorMessage && <div className="error-message">{LErrorMessage}</div>}
                        </div>
                        {/* <div className='Age'>
                            Age*
                             <br />
                             <input type="text" placeholder="Enter your age" onChange={handleAgeChange} />
                             {AErrorMessage && <div className="error-message">{AErrorMessage}</div>}
                        </div> */}
                        <div className='Email'>
                            Email*
                            <br />
                            <input type="text" placeholder="Your email please" />
                            {EErrorMessage && <div className="error-message">{EErrorMessage}</div>}
                        </div>
                        {/* <div className='Query'>
                            Query
                            <br />
                            <input type="text" placeholder="What is your query" />
                        </div> */}
                        <div className='Query'>
                            Query
                            <br />
                            <textarea
                                type="text"
                                placeholder="What is your query"
                                style={{ width: '95%', height: '75', borderRadius: '20px', padding: '10px', paddingRight: '10px', fontStyle: 'helvetica' }}
                                rows={5} // Adjust the number of rows based on your preference
                                required
                            />
                        </div>
                        <div className="send">
                            <button onClick={handleSend} className="send-button">Send</button>
                        </div>
                    </div>

                </div>
                <div className="image-container">
                    <video
                        style={{
                            width: '90%',
                            height: '80%',
                            objectFit: 'cover',
                            borderRadius: '20px', // Adjust the scale as needed to maintain the aspect ratio
                            outline: 'none',
                            border: 'none',
                            userSelect: 'none',
                            pointerEvents: 'none',
                            marginRight: '2.5vw'
                        }}
                        autoPlay
                        muted
                        loop
                    >
                        <source
                            src="https://video.wixstatic.com/video/11062b_d578b9d4ffba48c68d086ec29fe9e6f0/1080p/mp4/file.mp4"
                            type="video/mp4"
                        />
                    </video>
                </div>
                {/* <footer className="bottom_div"></footer> */}
            </div>
            {/* {ErrorMessage && <div className="error-message">{ErrorMessage}</div>} */}
            {SuccessMessage && <div className="success-message">{SuccessMessage}</div>}
        </div>
    );
};

export default ContactUs;