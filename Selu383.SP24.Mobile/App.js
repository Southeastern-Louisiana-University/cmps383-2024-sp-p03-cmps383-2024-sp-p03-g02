import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

export default function App() {

  /*return (
    <View style={styles.container}>
      <Text>Hi</Text>
      <StatusBar style="auto" />
    </View>
  );/* */
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numGuests, setNumGuests] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleSubmit = () => {
    
    setBookingSubmitted(true);
  };

  if (bookingSubmitted) {
    return (
      <View style={styles.container}>
        <Text>Booking Submitted!</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Hotel Booking Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Check-in Date"
        value={checkInDate}
        onChangeText={setCheckInDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Check-out Date"
        value={checkOutDate}
        onChangeText={setCheckOutDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Guests"
        keyboardType="numeric"
        value={numGuests}
        onChangeText={setNumGuests}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
    
        <Text>Submit</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
