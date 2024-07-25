const PRIVATE_ROOMS = new Set([
  "private-double",
  "private-twin",
  "family-room",
  "double-ensuite",
  "deluxe-double-ensuite",
  "motel-unit",
]);

const PRIVATE_BATHROOMS = new Set([
  "double-ensuite",
  "deluxe-double-ensuite",
  "motel-unit",
]);

const SEPARATE_BEDS = new Set([
  "dorm",
  "private-twin",
  "family-room",
  "motel-unit",
]);

const main = () => {
  enableAccommodationCheckboxes();
};

const enableAccommodationCheckboxes = () => {
  const accommodationCheckboxes = document.getElementsByClassName(
    "accommodation-checkbox"
  );

  for (const accommodationCheckbox of accommodationCheckboxes) {
    accommodationCheckbox.onchange = () => filterAccommodations();
  }

  filterAccommodations();
};

const filterAccommodations = () => {
  const displayStyles = {
    dorm: "flex",
    "private-double": "flex",
    "private-twin": "flex",
    "family-room": "flex",
    "double-ensuite": "flex",
    "deluxe-double-ensuite": "flex",
    "motel-unit": "flex",
  };

  const accommodationCards =
    document.getElementsByClassName("accommodation-card");

  const privateRoomCheckbox = document.getElementById("private-room-checkbox");
  if (privateRoomCheckbox.checked) {
    for (const accommodationCard of accommodationCards) {
      if (!PRIVATE_ROOMS.has(accommodationCard.id)) {
        displayStyles[accommodationCard.id] = "none";
      }
    }
  }

  const privateBathroomCheckbox = document.getElementById(
    "private-bathroom-checkbox"
  );
  if (privateBathroomCheckbox.checked) {
    for (const accommodationCard of accommodationCards) {
      if (!PRIVATE_BATHROOMS.has(accommodationCard.id)) {
        displayStyles[accommodationCard.id] = "none";
      }
    }
  }

  const separateBedsCheckbox = document.getElementById(
    "separate-beds-checkbox"
  );
  if (separateBedsCheckbox.checked) {
    for (const accommodationCard of accommodationCards) {
      if (!SEPARATE_BEDS.has(accommodationCard.id)) {
        displayStyles[accommodationCard.id] = "none";
      }
    }
  }

  for (const accommodationCard of accommodationCards) {
    accommodationCard.style.display = displayStyles[accommodationCard.id];
  }
};

main(); // code is ran here
