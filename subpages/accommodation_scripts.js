const ALL_ACCOMMODATION = new Set([
  "5-bed-dorm",
  "private-double",
  "private-twin",
  "family-room",
  "double-ensuite",
  "deluxe-double-ensuite",
  "motel-unit",
]);

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
  "5-bed-dorm",
  "private-twin",
  "family-room",
  "motel-unit",
]);

const ACCOMMODATION_TYPE_ID_MAP = {
  "5 Bed Dorm": "5-bed-dorm",
  "Private Double": "private-double",
  "Private Twin": "private-twin",
  "Family Room": "family-room",
  "Double Ensuite": "double-ensuite",
  "Deluxe Double Ensuite": "deluxe-double-ensuite",
  Motel: "motel-unit",
};

const PRIMARY_COLOR = "#4b5320";
const SECONDARY_COLOR = "#8c9b3e";
const TERTIARY_COLOR = "#6e5546";

const WINDOW_WIDTH = document.documentElement.clientWidth;
const MOBILE_WIDTH_MAX_NUM_PIXELS = 700;

// const REAL_TIME_RATES_URL = "./mock_little_hotelier_response.json";
const REAL_TIME_RATES_URL =
  "https://kakapo-lodge-rates.onrender.com/rates/tonight";

const enableAccommodationPage = () => {
  enableMobileFilterButton();
  enableAccommodationCheckboxes();
  showRealTimeRates();
};

const enableMobileFilterButton = () => {
  const filterButton = document.getElementById("mobile-filter-button");
  const filterOptions = document.getElementById("filter-options");

  if (WINDOW_WIDTH < MOBILE_WIDTH_MAX_NUM_PIXELS) {
    closeFilterOptions(filterButton, filterOptions);
    filterButton.onclick = () =>
      toggleFilterOptions(filterButton, filterOptions);
  }
};

const toggleFilterOptions = (filterButton, filterOptions) => {
  filterButton.disabled = true;
  setTimeout(() => (filterButton.disabled = false), 1000);

  if (filterOptions.style.display === "none") {
    openFilterOptions(filterButton, filterOptions);
  } else {
    closeFilterOptions(filterButton, filterOptions);
  }
};

const closeFilterOptions = (filterButton, filterOptions) => {
  filterButton.style.borderBottom = "none";
  filterOptions.style.display = "none";
};

const openFilterOptions = (filterButton, filterOptions) => {
  filterButton.style.borderBottom = "1px solid var(--primary-color)";
  filterOptions.style.display = "flex";
};

const enableAccommodationCheckboxes = () => {
  const accommodationCheckboxes = document.getElementsByClassName(
    "accommodation-checkbox"
  );

  for (const accommodationCheckbox of accommodationCheckboxes) {
    accommodationCheckbox.onchange = () => filterAccommodation();
  }

  filterAccommodation();
};

const filterAccommodation = () => {
  const accommodationCards =
    document.getElementsByClassName("accommodation-card");

  const matchingAccommodation = getMatchingAccommodation(accommodationCards);

  showMatchingAccommodation(matchingAccommodation, accommodationCards);

  const noAccommodationCard = document.getElementById("no-accommodation");
  noAccommodationCard.style.display =
    matchingAccommodation.size === 0 ? "flex" : "none";
};

const showMatchingAccommodation = (
  matchingAccommodation,
  accommodationCards
) => {
  for (const accommodationCard of accommodationCards) {
    if (matchingAccommodation.has(accommodationCard.id)) {
      accommodationCard.style.display = "flex";
    } else {
      accommodationCard.style.display = "none";
    }
  }
};

const getMatchingAccommodation = (accommodationCards) => {
  let matchingAccommodation = structuredClone(ALL_ACCOMMODATION);

  matchingAccommodation = filterByAvailableTonight(
    matchingAccommodation,
    accommodationCards
  );
  matchingAccommodation = filterByPrivateRoom(matchingAccommodation);
  matchingAccommodation = filterByPrivateBathroom(matchingAccommodation);
  matchingAccommodation = filterBySeparateBeds(matchingAccommodation);

  return matchingAccommodation;
};

const filterByAvailableTonight = (
  matchingAccommodation,
  accommodationCards
) => {
  const availableTonightCheckbox = document.getElementById(
    "available-tonight-checkbox"
  );

  if (availableTonightCheckbox.checked) {
    const availableTonight = new Set();

    for (const accommodationCard of accommodationCards) {
      const accommodationAvailability = document.getElementById(
        `${accommodationCard.id}-availability`
      );

      const unavailable =
        accommodationAvailability.innerText === "Sold out for tonight";

      if (!unavailable) {
        availableTonight.add(accommodationCard.id);
      }
    }

    return matchingAccommodation.intersection(availableTonight);
  } else {
    return matchingAccommodation;
  }
};

const filterByPrivateRoom = (matchingAccommodation) => {
  const privateRoomCheckbox = document.getElementById("private-room-checkbox");

  return privateRoomCheckbox.checked
    ? matchingAccommodation.intersection(PRIVATE_ROOMS)
    : matchingAccommodation;
};

const filterByPrivateBathroom = (matchingAccommodation) => {
  const privateBathroomCheckbox = document.getElementById(
    "private-bathroom-checkbox"
  );

  return privateBathroomCheckbox.checked
    ? matchingAccommodation.intersection(PRIVATE_BATHROOMS)
    : matchingAccommodation;
};

const filterBySeparateBeds = (matchingAccommodation) => {
  const separateBedsCheckbox = document.getElementById(
    "separate-beds-checkbox"
  );

  return separateBedsCheckbox.checked
    ? matchingAccommodation.intersection(SEPARATE_BEDS)
    : matchingAccommodation;
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

  const bedOrRoom = accommodationId.includes("dorm") ? "bed" : "room";

  let availabilityText = "";
  if (accommodationUnavailable) {
    availabilityText = "Sold out for tonight";
  } else if (numAvailable === 1) {
    availabilityText = `Only 1 ${bedOrRoom} left tonight!`;
  } else {
    availabilityText = `${numAvailable} ${bedOrRoom}s available tonight`;
  }

  const accommodationAvailability = document.getElementById(
    `${accommodationId}-availability`
  );
  accommodationAvailability.innerText = availabilityText;
  accommodationAvailability.style.color = accommodationUnavailable
    ? TERTIARY_COLOR
    : PRIMARY_COLOR;

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

enableAccommodationPage(); // code is ran here
