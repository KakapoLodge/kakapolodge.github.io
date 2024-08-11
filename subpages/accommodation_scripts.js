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

const ACCOMMODATION_NAME_ID_MAP = {
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

// const REAL_TIME_RATES_URL = "./mock_rates_response_tonight.json";
const REAL_TIME_RATES_URL = "https://kakapo-lodge-rates.onrender.com/rates";

const enableAccommodationPage = () => {
  enableMobileFilterButton();
  enableFilterCheckboxes();
  const dateRangePicker = enableDateRangePicker();
  showRealTimeRates(dateRangePicker);

  document.getElementById("date-range-picker").onchange = () =>
    showRealTimeRates(dateRangePicker);
};

const enableMobileFilterButton = () => {
  const filterButton = document.getElementById("mobile-filter-button");
  const filterOptions = document.getElementById("mobile-filter-options");

  if (WINDOW_WIDTH < MOBILE_WIDTH_MAX_NUM_PIXELS) {
    closeFilterOptions(filterOptions);

    filterButton.onclick = () =>
      toggleFilterOptions(filterButton, filterOptions);
  }
};

const toggleFilterOptions = (filterButton, filterOptions) => {
  filterButton.disabled = true;
  setTimeout(() => (filterButton.disabled = false), 1000);

  if (filterOptions.style.display === "none") {
    openFilterOptions(filterOptions);
  } else {
    closeFilterOptions(filterOptions);
  }
};

const closeFilterOptions = (filterOptions) => {
  filterOptions.style.display = "none";
};

const openFilterOptions = (filterOptions) => {
  filterOptions.style.display = "flex";
};

const enableFilterCheckboxes = () => {
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

  const matchingAccommodation = getMatchingAccommodation();
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

const getMatchingAccommodation = () => {
  let matchingAccommodation = structuredClone(ALL_ACCOMMODATION);

  matchingAccommodation = filterByPrivateRoom(matchingAccommodation);
  matchingAccommodation = filterByPrivateBathroom(matchingAccommodation);
  matchingAccommodation = filterBySeparateBeds(matchingAccommodation);

  return matchingAccommodation;
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

const enableDateRangePicker = () => {
  const todaysDate = getTodaysDate();

  const tomorrowsDate = new Date(todaysDate);
  tomorrowsDate.setDate(todaysDate.getDate() + 1);

  return new easepick.create({
    element: document.getElementById("date-range-picker"),
    css: ["../easepick/bundle/index.css", "../styles.css"],
    plugins: ["LockPlugin", "RangePlugin"],
    format: "DD MMM YYYY",
    LockPlugin: {
      minDate: new Date(),
    },
    RangePlugin: {
      startDate: todaysDate,
      endDate: tomorrowsDate,
      tooltipNumber: (numberOfNights) => numberOfNights - 1,
      locale: {
        one: "night",
        other: "nights",
      },
    },
    setup: (picker) => picker.on("select", (_) => showRealTimeRates(picker)),
  });
};

const showRealTimeRates = (dateRangePicker) => {
  const [startDateRfc3339, endDateRfc3339] = getDateRange(dateRangePicker);
  const isStayTonight = checkIsStayTonight(startDateRfc3339, endDateRfc3339);

  fetch(
    `${REAL_TIME_RATES_URL}?start_date=${startDateRfc3339}&end_date=${endDateRfc3339}`
  )
    .then((response) => response.json())
    .then((ratePlans) => updateAllAccommodationInfo(ratePlans, isStayTonight));
};

const getDateRange = (dateRangePicker) => {
  const startDateRfc3339 = convertDateToRfc3339(dateRangePicker.getStartDate());
  const endDateRfc3339 = convertDateToRfc3339(
    new Date(dateRangePicker.getEndDate() - 1)
  );

  return [startDateRfc3339, endDateRfc3339];
};

const checkIsStayTonight = (startDateRfc3339, endDateRfc3339) => {
  if (startDateRfc3339 !== endDateRfc3339) {
    return false;
  }

  const todaysDate = getTodaysDate();
  return convertDateToRfc3339(todaysDate) === startDateRfc3339;
};

const getTodaysDate = () => {
  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0);
  return todaysDate;
};

const convertDateToRfc3339 = (date) => {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date - timezoneOffset).toISOString().split("T")[0];
};

const updateAllAccommodationInfo = (ratePlans, isStayTonight) => {
  for (const ratePlan of ratePlans) {
    updateAccommodationInfo(ratePlan, isStayTonight);
  }
};

const updateAccommodationInfo = (ratePlan, isStayTonight) => {
  if (!(ratePlan.name in ACCOMMODATION_NAME_ID_MAP)) {
    return;
  }

  const accommodationId = ACCOMMODATION_NAME_ID_MAP[ratePlan.name];
  const ratePlanDates = ratePlan["rate_plan_dates"];

  const totalPrice = getTotalPrice(ratePlanDates);
  updatePrice(accommodationId, isStayTonight, totalPrice);

  const [isAvailable, numAvailable] = checkAvailability(ratePlanDates);
  updateAvailability(accommodationId, isStayTonight, isAvailable, numAvailable);
  updateBookAccommodationText(
    accommodationId,
    isStayTonight,
    isAvailable,
    totalPrice
  );
};

const getTotalPrice = (ratePlanDates) => {
  return ratePlanDates
    .map((ratePlanDate) => ratePlanDate.rate)
    .reduce((partialSum, rate) => partialSum + rate, 0);
};

const updatePrice = (accommodationId, isStayTonight, totalPrice) => {
  const accommodationPrice = document.getElementById(
    `${accommodationId}-price`
  );

  accommodationPrice.innerText = `${
    isStayTonight ? "Tonight" : "Total"
  }: $${totalPrice}`;
};

const checkAvailability = (ratePlanDates) => {
  let numAvailable = Number.MAX_SAFE_INTEGER;

  for (const ratePlanDate of ratePlanDates) {
    if (ratePlanDate["stop_online_sell"] || ratePlanDate.available === 0) {
      return [false, 0];
    }

    numAvailable = Math.min(numAvailable, ratePlanDate.available);
  }

  return [true, numAvailable];
};

const updateAvailability = (
  accommodationId,
  isStayTonight,
  isAvailable,
  numAvailable
) => {
  const bedOrRoom = accommodationId.includes("dorm") ? "bed" : "room";

  const availabilityText = getAvailabilityText(
    isAvailable,
    numAvailable,
    isStayTonight,
    bedOrRoom
  );

  const accommodationAvailability = document.getElementById(
    `${accommodationId}-availability`
  );

  accommodationAvailability.innerText = availabilityText;
  accommodationAvailability.style.color = isAvailable
    ? TERTIARY_COLOR
    : PRIMARY_COLOR;
};

const getAvailabilityText = (
  isAvailable,
  numAvailable,
  isStayTonight,
  bedOrRoom
) => {
  if (!isAvailable) {
    return `Unavailable for ${isStayTonight ? "tonight" : "this period"}`;
  } else if (numAvailable === 1) {
    return `Only 1 ${bedOrRoom} left  ${
      isStayTonight ? "tonight" : "for this period"
    }!`;
  } else {
    return `${numAvailable} ${bedOrRoom}s available  ${
      isStayTonight ? "tonight" : "for this period"
    }`;
  }
};

const updateBookAccommodationText = (
  accommodationId,
  isStayTonight,
  isAvailable,
  totalPrice
) => {
  const bookAccommodationText = document.getElementById(
    `book-${accommodationId}-text`
  );

  if (isAvailable) {
    // book direct: 5% off
    const discountedPrice = (totalPrice * 0.95).toFixed(2);
    bookAccommodationText.innerText = `Book with us @ $${discountedPrice}`;
  } else {
    bookAccommodationText.innerText = `Book for another ${
      isStayTonight ? "night" : "period"
    }`;
  }
};

enableAccommodationPage(); // code is ran here
