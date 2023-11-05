import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin_login.css';
import axios from 'axios'; // Import Axios library


function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlelandingpage = () => {
        navigate('/');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleForgotPasswordClick = () => {
        navigate('/forgotpassword'); // Use navigate to go to the desired route
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Email:', email);
            console.log('Password:', password);

            const response = await axios.post('/api/admin/login', {
                email,
                password,
            });

            if (response.status === 200) {
                // Redirect to admin dashboard upon successful login
                window.location.href = '/values';
            } else {
                setLoginError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setLoginError('Invalid credentials. Please try again.');
        }
    };
    return (
        <div className="container">
            <nav className="nav-bar">
                <div class="leftnav">
                    <span>Carbon Offset</span>
                </div>
                <div class="rightnav">
                    <a href="#" onClick={handlelandingpage}>Home</a>
                    <a href="#">About Us</a>
                    <a href="#">Calculator</a>
                    <a href="#" class="admin" >Admin</a>
                    <a href="#">Contact Us</a>
                </div>

            </nav>
            <div className="adminlogin">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="enteremailid">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="enterpass">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit_login" className='submit_login'>Login</button>
                        <button type="button" onClick={handleForgotPasswordClick}> Forgot Password </button>
                    </div>
                </form>
                <p className="error-message">{loginError}</p>
            </div>
            {/* <footer className="bottom_div"></footer> */}
        </div>
    );
}
export default AdminLogin;
