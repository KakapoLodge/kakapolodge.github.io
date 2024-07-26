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

const ACCOMMODATION_TYPE_ID_MAP = {
  "5 Bed Dorm": "dorm",
  "Private Double": "private-double",
  "Private Twin": "private-twin",
  "Family Room": "family-room",
  "Double Ensuite": "double-ensuite",
  "Deluxe Double Ensuite": "deluxe-double-ensuite",
  Motel: "motel-unit",
};

// const REAL_TIME_RATES_URL = "./mock_little_hotelier_response.json";
const REAL_TIME_RATES_URL = "https://kakapo-lodge-rates.onrender.com/rates";

const main = () => {
  enableAccommodationCheckboxes();
  showRealTimeRates();
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

const showRealTimeRates = () => {
  fetch(REAL_TIME_RATES_URL)
    .then((response) => response.json())
    .then(updateLodgeRates);
};

const updateLodgeRates = (lodgeRates) => {
  for (const accommodationInfo of lodgeRates) {
    updateLodgeRate(accommodationInfo);
  }
};

const updateLodgeRate = (lodgeRate) => {
  const accommodationId = ACCOMMODATION_TYPE_ID_MAP[lodgeRate.name];

  const accommodationPrice = document.getElementById(
    `${accommodationId}-price`
  );
  accommodationPrice.innerText = `Tonight: $${lodgeRate.rate}`;

  const numAvailable = lodgeRate["num_available"];
  const accommodationUnavailable = numAvailable === 0;

  const bedOrRoom = accommodationId === "dorm" ? "bed" : "room";

  let availabilityText = "";
  if (accommodationUnavailable) {
    availabilityText = "Sold out for tonight";
  } else if (numAvailable === 1) {
    availabilityText = `Only 1 ${bedOrRoom} left tonight!`;
  } else {
    availabilityText = `${numAvailable} ${bedOrRoom}s available tonight`;
  }

  console.log(accommodationId);
  const accommodationAvailability = document.getElementById(
    `${accommodationId}-availability`
  );
  accommodationAvailability.innerText = availabilityText;
  accommodationAvailability.style.color = accommodationUnavailable
    ? "#6E5546"
    : "#4b5320";

  const bookAccommodationText = document.getElementById(
    `book-${accommodationId}-text`
  );

  if (accommodationUnavailable) {
    bookAccommodationText.innerText = "Book for another night";
  } else {
    // book direct: 5% off
    const discountedPrice = (lodgeRate.rate * 0.95).toFixed(2);
    bookAccommodationText.innerText = `Book with us @ $${discountedPrice}`;
  }
};

main(); // code is ran here
