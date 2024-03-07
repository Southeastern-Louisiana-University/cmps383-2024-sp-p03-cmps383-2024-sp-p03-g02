import React, { useState, FormEvent, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    if (username.length < 2) {
      alert('Username must be at least 2 characters long.');
      return;
    }

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
          password: password,
        }),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  useEffect(() => {
    if (registrationSuccess) {
      // Redirect to the home page upon successful registration
      history('/');
    }
  }, [history, registrationSuccess]);

  // If registration is not successful, render the registration form
  return (
    <center><Card style={{ width: '18rem' }}>
      <Card.Header style={{ backgroundColor: '#FDBA74' }}>
        Register
      </Card.Header>
      <Card.Body>
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
            <Button style={{ backgroundColor: '#FDBA74' }} variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </div>
      </Card.Body>
    </Card></center>
    
  );
}

export default Register;
