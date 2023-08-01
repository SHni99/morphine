import React, { useContext } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Circle, MapMarker } from "react-native-maps";
import { Context as LocationContext } from "./LocationContext";

const Map = () => {
  const {
    state: { currentLocation },
  } = useContext(LocationContext);
  if (!currentLocation) {
    return <ActivityIndicator size="large" style={{ marginTop: 200 }} />;
  }

  initialLocation = {
    longitude: 103.77556,
    latitude: 1.29946,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const mockLocation = {
    longitude: 103.77556,
    latitude: 1.29946,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Circle
          //set to currentLocation.cords for real-time reading
          center={currentLocation.cords}
          radius={20}
          strokeColor="black"
          fillColor="#fed42855"
        />
        <MapMarker coordinate={currentLocation.cords} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 1000,
    width: 500,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
  },
});

export default Map;
