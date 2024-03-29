import React from "react";
import Loading from "./Loading";
import Weather from "./Weather";
import { StatusBar } from "expo-status-bar";
import { View, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "fa2c40b708d1633021e520ce4876ae73";

export default class extends React.Component {
  state = {
    isLoading: true
  };

  getWeather = async (lat, lng) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    );
    this.setState({ isLoading: false, temp, condition: weather[0].main });
  };

  getLocation = async () => {
    try {
      Location.requestForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can`t find you", "So sad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
  }
}
