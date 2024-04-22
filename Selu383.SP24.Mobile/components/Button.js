import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function App() {
  const loginWithFacebook = () => {
    console.log('Button pressed');
    
  };

  return (
    <View style={styles.container}>
      <FontAwesome.Button name="login" backgroundColor="#3b5998" onPress={loginWithFacebook}>
                Login with Facebook
      </FontAwesome.Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
