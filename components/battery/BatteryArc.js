import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

function BatteryArc({ percentage = 100 }) {
  return (
    <View style={styles.circleContainer}>
      <View style={styles.percentageCircle}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          width={200}
          height={90}
          style={styles.defaultCircle}
        >
          <Path
            fill="none"
            stroke="grey"
            opacity={0.7}
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={10}
            d="M195.675 98.851c0-52.17-42.822-94.463-95.644-94.463-52.823 0-95.644 42.293-95.644 94.463"
          />
        </Svg>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          width={100}
          height={90}
          style={styles.defaultCircle}
        >
          <Path
            fill="none"
            stroke="green"
            opacity={0.7}
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={10}
            d="M195.675 98.851c0-52.17-42.822-94.463-95.644-94.463-52.823 0-95.644 42.293-95.644 94.463"
          />
        </Svg>
        <Text style={styles.batteryPercentage}>50%</Text>
      </View>
    </View>
  );
}

export default BatteryArc;

const styles = StyleSheet.create({
  circleContainer: {
    display: "flex",
    width: 200,
    height: 100,
    overflow: "hidden",
  },
  defaultCircle: {
    position: "absolute",
  },
  batteryPercentage: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20%",
  },
});
