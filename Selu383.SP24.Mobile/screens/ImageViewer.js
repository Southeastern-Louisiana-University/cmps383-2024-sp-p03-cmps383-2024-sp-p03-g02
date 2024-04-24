import { StyleSheet, Image } from 'react-native';


export default function ImageViewer({ placeholderImageSource }) {
  
  return (
    <Image source={placeholderImageSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  container: {
    flex: 1,
     justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
