import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false); // State for password mismatch
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for registration success

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform validation
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    
    if (username.length < 2) {
      alert('Username must be at least 2 characters long.');
      return;
    }

    // Password must contain a special character
    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharacters.test(password)) {
      alert('Password must contain a special character.');
      return;
    }

    try {
      const response = await fetch('/api/authentication/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      
      if (response.ok) {
        // Set registration success state to true
        setRegistrationSuccess(true);
      } else {
        // Handle registration failure
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  // If registration is successful, render a message and a link to the home page
  if (registrationSuccess) {
    return (
      <div className="registration-success">
        <h2>Registration successful!</h2>
        <p>You can now <Link to="/">login</Link>.</p>
      </div>
    );
  }

  // If registration is not successful, render the registration form
  return (
    <div className="register-container">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={passwordMismatch ? 'password-mismatch' : ''} // Apply CSS class if password mismatch
          />
          {passwordMismatch && <p className="text-danger">Passwords do not match</p>} {/* Display error message */}
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}

export default Register;
