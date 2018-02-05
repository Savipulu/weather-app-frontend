import React from "react";
import StationStatistics from "./components/StationStatistics";
import observations from "./services/observations";
import { LineChart } from "react-easy-chart";
import moment from "moment";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      previous: null,
      stations: []
    };
  }

  componentDidMount() {
    observations.getAll().then(response => {
      this.setState({ stations: response.data });
    });
  }

  addObservation = event => {
    event.preventDefault();
    if (this.state.input >= -30 && this.state.input <= 30) {
      const stationToBeUpdated = this.state.stations.find(
        s => s.id === event.target.id
      );
      stationToBeUpdated.data[0].push({
        x: moment().format("D-MMM-YY HH:MM"),
        y: Number(this.state.input)
      });
      observations.updateData(event.target.id, stationToBeUpdated);
      this.setState({
        input: null
      });
    } else {
      alert("Input a valid temperature");
    }
  };

  showAll = event => {
    event.preventDefault();
    console.log(event.target.id);
  };

  handleInputChange = event => {
    this.setState({
      input: event.target.value,
      previous: event.target
    });
  };

  reset = event => {
    const prev = this.state.previous;
    if (prev) prev.value = null;
  };

  makeGraph = station => {
    if (station.data[0].length < 2) {
      return;
    }
    return (
      <LineChart
        datePattern={"%d-%b-%y %H:%M"}
        xType={"time"}
        axes
        grid
        margin={{ top: 25, right: 25, bottom: 50, left: 50 }}
        yDomainRange={[-30, 30]}
        axisLabels={{ x: "Time", y: "Temperature" }}
        width={600}
        height={350}
        data={station.data}
      />
    );
  };

  mapStations = stations => {
    return (
      <div>
        {this.state.stations.map(station => (
          <div key={station.id}>
            <StationStatistics station={station} />
            <form>
              Add an observation:
              <input
                placeholder=" degrees in celcius"
                onChange={this.handleInputChange}
                onBlur={this.reset}
              />
              <button id={station.id} onClick={this.addObservation}>
                Add observation...
              </button>
            </form>
            {this.makeGraph(station)}
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <h1>Weather observations</h1>
        <div>{this.mapStations(this.state.stations)}</div>
      </div>
    );
  }
}

export default App;
