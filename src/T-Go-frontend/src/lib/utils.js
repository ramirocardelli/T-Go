const getLocationById = (locations, location) => {
  const foundLocation = locations.find((loc) => loc.id.toString() === location.toString());
  if (foundLocation) {
    return foundLocation.name;
  }
  return "Undefined location";
};

const displayImageFromBytes = (byteArray, mimeType, imgElementId) => {
  const uint8Array = new Uint8Array(byteArray);
  const blob = new Blob([uint8Array], { type: mimeType });
  const imageUrl = URL.createObjectURL(blob);
  return imageUrl;
};

const formatDate = (timestamp) => {
  const millis = Number(timestamp / 1000000n);
  return new Date(millis).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (timestamp) => {
  const millis = Number(timestamp / 1000000n);
  const date = new Date(millis);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export { displayImageFromBytes, getLocationById, formatDate, formatTime };