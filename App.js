import React, { useState } from "react";
import { View, Button, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ip from "./ip";

const App = () => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  // Pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload the image to the backend
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginVertical: 20 }}
        />
      )}
      <Button title="Upload Image" onPress={uploadImage} />
      {response && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'white' }}>Response from Backend:</Text>
          <Text style={{ color: 'white' }}>{JSON.stringify(response, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

export default App;