const { DOMParser } = require("@xmldom/xmldom");
const axios = require("axios");
const { centerX, radius, centerY } = require("./XyAreaConstants");

parser = new DOMParser();

const getDronePositions = async () => {
  let droneData = [];

  const dronePositions = await axios.get(
    "http://assignments.reaktor.com/birdnest/drones"
  );
  const drones = parser
    .parseFromString(dronePositions.data, "text/xml")
    .getElementsByTagName("drone");

  for (let i = 0; i < drones.length; i++) {
    const serialnum =
      drones[i].getElementsByTagName("serialNumber")[0].childNodes[0].nodeValue;
    const posX =
      drones[i].getElementsByTagName("positionX")[0].childNodes[0].nodeValue;
    const posY =
      drones[i].getElementsByTagName("positionY")[0].childNodes[0].nodeValue;
    droneData = droneData.concat({ serialnum, posX, posY });
  }

  return droneData;
};

const calculateDistance = (positionXY) => {
  const { posX, posY } = positionXY;
  const droneInCircle = Math.sqrt(
    Math.pow(Math.round(posX) - centerX, 2) +
      Math.pow(Math.round(posY) - centerY, 2)
  );

  console.log(droneInCircle);
  return droneInCircle < radius;
};

const droneInsideCircle = async () => {
  const dronePositions = await getDronePositions();
  console.log(dronePositions);

  return dronePositions.filter(calculateDistance);
};

module.exports = { getDronePositions, droneInsideCircle };
