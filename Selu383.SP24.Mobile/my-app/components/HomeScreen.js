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
      <Button style={styles.butt}
        title="Login as Enstay User"
        onPress={() => navigation.navigate("Login")}
      />
      
<Text>  Want to create an account?</Text>
      <Text onPress={() => navigation.navigate("Signup")}>
           SignUp 
      </Text>
  
      </View>
      <StatusBar style="auto" />
    </View>
    
  );}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5ee',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
      },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  hyperlinkStyle:{
    padding:20,
    color:'coral',    
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "coral"
  },
butt:{
backgroundColor:'coral',


},
}
  );
