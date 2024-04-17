import React from "react";
import { Button, View, Text ,StyleSheet} from "react-native";
import ImageViewer from '../screens/ImageViewer';
import { StatusBar } from "expo-status-bar";

const PlaceholderImage = require("../assets/images/orange1.jpg");

export default function HomeScreen({ navigation }) {
  return (
   
              <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} />          
            
        <Button color="coral"
        title="Login as Enstay User"
        onPress={() => navigation.navigate("Login")}
      />
      
<Text style={styles.normalText}>  Want to create an account?</Text>
      <Text style={styles.hyperlinkStyle} onPress={() => navigation.navigate("Signup")}>
           SignUp 
      </Text>
  
      </View>
      <StatusBar style="auto" />
    </View>
    
  );}


const styles = StyleSheet.create({
  container: {   
    flex: 1,
    backgroundColor: '#FFFFF0',
    alignItems: 'center',
  },
  imageContainer: {
    gap:10,
    flex: 1,
    
      },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  hyperlinkStyle:{
    textAlign: 'center',
      color:'coral',    
    textDecorationStyle: "solid",
    textDecorationColor: "coral",
   textDecorationLine: 'underline',
  },
butt:{
 
  color:'coral',
  accessibilityLabel:"Learn more about this purple button",


},
normalText: {
  textAlign: 'center',
fontSize:15,
color:'#000',
textDecorationStyle: "solid",


},
}
  );
