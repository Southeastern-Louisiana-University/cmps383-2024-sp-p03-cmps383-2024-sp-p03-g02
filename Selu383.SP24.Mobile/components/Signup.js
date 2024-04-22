import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';

export default class Signup extends Component {
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to sign up!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName
        })
        console.log('User registered successfully!')
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Login')
      })
      .catch(error => this.setState({ errorMessage: error.message }))      
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    

    return (
      <View style={styles.container}>  
        <TextInput
          style={styles.inputStyle} maxLength={14}
          
          placeholder="Name"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />      
        <TextInput
          style={styles.inputStyle} maxLength={25}
          keyboardType="email-address"
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput   
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        <Button
          color="coral"
          title="Signup"
          onPress={() => this.registerUser()}
        />
        <Text style={styles.normalText}>Already Registered? Click here to</Text>
        <Text 
          style={styles.loginText} 
          onPress={() => this.props.navigation.navigate('Login')}>
           Login
        </Text>                          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    backgroundColor: '#FFFFF0',
    alignItems: 'center',
  },
  inputStyle: {

    backgroundColor: '#FF9F70',
    padding: 10,
    borderColor: "coral",
    width: "50%",
    borderWidth: 1,
    borderRadius: 10,
  

  },
  loginText:{
    marginTop: 8,
    fontSize: 20,
    color: 'coral',
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  
  },
  normalText: {
    fontSize:15,
    color:'#000',
    textDecorationStyle: "solid",
    
    
    },


});