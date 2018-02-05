import axios from "axios";

const baseUrl = "/stations";

const getAll = () => {
  return axios.get(baseUrl);
};

const updateData = (id, newObject) => {
  console.log(newObject);
  const req = axios.put(baseUrl + "/" + id, newObject);
  return req.then(res => res.data);
  /*
  const station = stations.find(station => station.id === Number(id));

  station.data[0].push({
    x: moment().format("D-MMM-YY HH:MM"),
    y: Number(degrees)
  });
  */
};

export default { getAll, updateData };
