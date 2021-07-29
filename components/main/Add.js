import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'
import { NavigationContainer } from '@react-navigation/native';
export default function Add({navigation}) {
  const [hasGalleryPermission, sethasGalleryPermission] = useState(null);
  const [hasCameraPermission, sethasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);


  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      sethasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      sethasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
      if(camera)
      {
          const data = await camera.takePictureAsync(null);
          console.log('data',data.uri)
          setImage(data.uri);
      }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };  
  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
      <View style={{flex: 1}}>
    <View style={styles.cameraContainer}>
      <Camera
        ref={ref=> setCamera(ref)}
        style={styles.fixedRatio}
        ratio={'1:1'}
        type={type}/>
    </View>
    <Button
            title="Flip Image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
    </Button>
    <Button 
        title="Take a Picture"
        onPress={()=>takePicture()}
    />
        <Button 
        title="Pick Image from Gallery"
        onPress={()=>pickImage()}
    />
    <Button 
      title="Save"
      onPress={() => navigation.navigate('Save', {image})}
    />
    {image && <Image source={{uri: image}} style={{flex: 1}}/>}
          </View>
  );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
})