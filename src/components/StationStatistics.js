import React from "react";
import moment from "moment";

const StationStatistics = ({ station }) => {
  const getDegreeString = (lat, lon) => {
    return (
      determineCardinalDirection(lat, ["° N, ", "° S, "]) +
      determineCardinalDirection(lon, ["° W", "° E"])
    );
  };

  const determineCardinalDirection = (degrees, strings) => {
    if (degrees > 0) {
      return degrees + strings[0];
    } else {
      return Math.abs(degrees) + strings[1];
    }
  };

  const latestTemperature = station => {
    return station.data[0][station.data[0].length - 1].y + " °C";
  };

  const measuredRecently = data => {
    let a = moment(data.x, "DD-MMM-YY HH:mm");
    let b = moment();
    return b.diff(a) < 86400000;
  };

  const getRecentMeasurements = () => {
    let i = station.data[0].length - 1;
    const temperatures = [];
    while (true) {
      if (i < 0) {
        break;
      }
      if (measuredRecently(station.data[0][i])) {
        temperatures.push(station.data[0][i]);
      } else {
        break;
      }
      i--;
    }
    return temperatures;
  };

  const getExtremeTemperature = isMax => {
    const temperatures = getRecentMeasurements();

    if (temperatures.length === 0) {
      return "no recent data";
    } else if (isMax) {
      return Math.max.apply(Math, temperatures.map(item => item.y)) + " °C";
    }
    return Math.min.apply(Math, temperatures.map(item => item.y)) + " °C";
  };

  return (
    <div>
      <h2>{station.name}</h2>
      <p>{getDegreeString(station.lat, station.lon)}</p>
      <p>Current temperature: {latestTemperature(station)}</p>
      <p>
        Highest temperature in the last 24 hours: {getExtremeTemperature(true)}
      </p>
      <p>
        Lowest temperature in the last 24 hours: {getExtremeTemperature(false)}
      </p>
    </div>
  );
};

export default StationStatistics;
