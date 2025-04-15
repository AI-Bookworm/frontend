import React, { useState } from "react";
import { View, Button, Text, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ip from "./ip";
import {Appearance} from 'react-native';

const App = () => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  
  const colorScheme = Appearance.getColorScheme();
  let textColor = 'white'
  let backgroundColor = 'black'
  if (colorScheme === 'light') {
    textColor = 'black'
    backgroundColor = 'white'
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await axios.post(`http://${ip}:5001/api/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      alert("Failed to upload image. Check the console for details.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: backgroundColor}}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginVertical: 20 }}
        />
      )}
      <Button title="Upload Image" onPress={uploadImage} />
      {response && (
        <ScrollView style={{ marginTop: 20, maxHeight: 300, width: '100%' }} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <Text style={{ color: textColor, fontWeight: 'bold' }}>Response from Backend:</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Title: {response.title}</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Subtitle: {response.subtitle}</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Authors: {Array.isArray(response.authors) ? response.authors.join(", ") : response.authors}</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Rating: {response.average_rating}</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Page Count: {response.page_count}</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Categories: {response.categories}</Text>
          <Text style={{ color: textColor, flexWrap: 'wrap' }}>Description: {response.description}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default App;
