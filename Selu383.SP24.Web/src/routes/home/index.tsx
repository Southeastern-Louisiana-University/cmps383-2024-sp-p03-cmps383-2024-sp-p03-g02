import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <>
    <center><h1>Welcome to EnStay!</h1></center>
      
      
      <center>
        <Link to="/hotels">
        <Button variant="primary">Go to Hotels</Button>
      </Link></center>
    </>
  );
}
