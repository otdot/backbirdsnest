const { DOMParser } = require("@xmldom/xmldom");
const Cache = require("node-cache");
const axios = require("axios");
const { centerX, radius, centerY } = require("./XyAreaConstants");

parser = new DOMParser();
const droneCache = new Cache();

const getDroneOwnerDetails = async (id) => {
  const res = await axios.get(
    `http://assignments.reaktor.com/birdnest/pilots/${id}`
  );
  if (res.status === 200) {
    return res.data;
  }
};

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

  return droneInCircle < radius;
};

const droneInsideCircle = async () => {
  const dronePositions = await getDronePositions();
  return dronePositions.filter(calculateDistance);
};

const addDroneToCache = async (drone) => {
  const droneOwnerInfo = await getDroneOwnerDetails(drone.serialnum);

  if (!droneOwnerInfo) {
    return;
  }

  const newDrone = { ...droneOwnerInfo, ttl: 60 * 10 };

  if (droneCache.has("drone-list")) {
    if (
      droneCache
        .get("drone-list")
        .every((cacheDrone) => cacheDrone.pilotId !== newDrone.pilotId)
    ) {
      droneCache.set("drone-list", [...droneCache.get("drone-list"), newDrone]);
    }
  } else {
    droneCache.set("drone-list", [newDrone]);
  }
};

const updateDroneCache = async () => {
  const drones = await droneInsideCircle();

  drones.forEach(addDroneToCache);

  if (!process.env.NODE_ENV) {
    console.log(
      `droneCache updated. droneCache: ${droneCache.get("drone-list")}`
    );
  }

  return droneCache;
};

module.exports = { getDronePositions, droneInsideCircle, updateDroneCache };
