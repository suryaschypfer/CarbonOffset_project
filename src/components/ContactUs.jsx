import React from 'react';
import './ContactUs.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig';
import person from "../assets/person.webp";
import logoImg from "../logo2.png";
import './ContactUsNew.css'



export const ContactUs = () => {
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState('');
    const [FErrorMessage, setFErrorMessage] = useState('');
    const [LErrorMessage, setLErrorMessage] = useState('');
    const [EErrorMessage, setEErrorMessage] = useState('');
    const [QErrorMessage, setQErrorMessage] = useState('');
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
        const firstNameInput = document.querySelector('.first_name input')
        const lastNameInput = document.querySelector('.last_name input')
        const emailInput = document.querySelector('.Email_address input')
        const queryInput = document.querySelector('.query_message textarea')

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

        if (!query) {
            setQErrorMessage('Please type in your query');
            setTimeout(() => {
                setQErrorMessage('');
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
                    }, 3000);
                } else {
                    setErrorMessage('Error adding the Enquiry and Customer');
                }
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            })
            .catch(error => {
                console.error(error);
                setErrorMessage('Error adding into the Enquiry and Customer');
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
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
            <div className="page" >
                <div className='container1_main' >
                    <div className='contactusvedio_start_gif'>
                        <img className="image_in_contact_us" src={person} alt="fact logo" ></img>
                        <div className='contactustext_overlay'>
                            <div className='contactusvedio_heading'>Contact Us</div>
                            <div className='contactusvedio_paragragh'> Let’s work together on your journey and align our goals to create a sustainable world with environmental, economic, and social benefits. <br />
                                Fill the form with your query and someone from our team will reach out to you soon.</div>
                        </div>
                    </div>
                </div>
                <div className='customerdetails'>
                    <div className='first_name'>
                        <div className='fname_heading'>First Name*</div>
                        <input className='input_text_contactus' type="text" placeholder="Enter your first name" onChange={handleFNameChange} />
                        {FErrorMessage && <div className="error-message">{FErrorMessage}</div>}
                    </div>
                    <div className='last_name'>
                        <div className='lname_heading'>Last Name*</div>
                        <input className='input_text_contactus' type="text" placeholder="Enter your last name" onChange={handleLNameChange} />
                        {LErrorMessage && <div className="error-message">{LErrorMessage}</div>}
                    </div>
                    <div className='Email_address'>
                        <div className='Email_heading'>Email*</div>
                        <input className='input_text_contactus' type="text" placeholder="Your email please" />
                        {EErrorMessage && <div className="error-message">{EErrorMessage}</div>}
                    </div>
                    <div className='query_message'>
                        <div className='query_heading'>Query</div>
                        <textarea
                            type="text"
                            placeholder="What is your query"
                            className='textarea_contact_us'
                            rows={5}
                            required
                        />
                         {QErrorMessage && <div className="error-message">{QErrorMessage}</div>}
                    </div>
                    <div className="send">
                        <button onClick={handleSend} className="send-button">Send</button>
                        {SuccessMessage && <div className="success-message">{SuccessMessage}</div>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;