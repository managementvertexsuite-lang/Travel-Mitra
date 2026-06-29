import { destinations } from "../data/destinations";

const CITY_TO_DESTINATION_ID = {
  BALI: "BALI",
  GOA: "GOA",
  DUBAI: "DUBAI",
  MANALI: "MANALI",
  "JAMMU & KASHMIR": "JK",
  KERALA: "KERALA",
  SHILLONG: "SHILLONG",
  OOTY: "OOTY",
  SHIMLA: "SHIMLA",
  DARJEELING: "DARJEELING",
};

export function resolveDestinationId(destination) {
  if (destination?.destinationId) {
    return destination.destinationId.toUpperCase();
  }

  const city = destination?.city?.toUpperCase()?.trim();
  if (city && CITY_TO_DESTINATION_ID[city]) {
    return CITY_TO_DESTINATION_ID[city];
  }

  return city || "BALI";
}

export function findDestination(destination) {
  const destId = resolveDestinationId(destination);
  const city = destination?.city?.trim();

  return (
    destinations.find((d) => d.destinationId === destId) ||
    destinations.find((d) => d.name.toUpperCase() === city?.toUpperCase()) ||
    null
  );
}
