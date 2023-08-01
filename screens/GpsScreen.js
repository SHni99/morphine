//import "./mockLocation";
import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Map from "../components/Map";
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
  Accuracy,
} from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context as LocationContext } from "../components/LocationContext";
import DefaultMarkers from "../components/DefaultMarkers";

const GpsScreen = () => {
  const { addLocation } = useContext(LocationContext);
  const [err, setError] = useState(null);

  const startWatching = async () => {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        throw new Error("Location permission not granted");
      }
      await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          addLocation(location);
        }
      );
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    startWatching();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Map /> */}
      <DefaultMarkers />
      {err ? <Text>Please enable your location</Text> : null}
    </SafeAreaView>
  );
};

export default GpsScreen;
