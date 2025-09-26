const API_BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT_CODE = "2508-FTB-ET-WEB-FT";
const EVENTS_URL = `${API_BASE}/${COHORT_CODE}/events`;

let state = {
  events: [],
  selectedEvent: null,
};

async function fetchEvents() {
  try {
    const res = await fetch(EVENTS_URL);
    if (!res.ok) throw new Error("Events were not fetched.");
    const data = await res.json();
    if (data.success) {
      state.events = data.data;
      render();
    } else {
      throw new Error("The server returned invalid data.");
    }
  } catch (err) {
    console.error(err);
    document.body.textContent = "Events could not be loaded.";
  }
}

async function fetchEventById(id) {
  try {
    const res = await fetch(`${EVENTS_URL}/${id}`);
    if (!res.ok) throw new Error("Cannot reach event details.");
    const data = await res.json();
    if (data.success) {
      state.selectedEvent = data.data;
      render();
    } else {
      throw new Error("Event data could not render.");
    }
  } catch (err) {
    console.error(err);
    document.body.textContent = "Could not load event details.";
  }
}

function EventDetails(event) {
  const div = document.createElement("div");
  const name = document.createElement("h2");
  name.textContent = event.name;
  const id = document.createElement("p");
  id.textContent = `ID: ${event.id}`;
  const date = document.createElement("p");
  date.textContent = `Date: ${new Date(event.date).toLocaleDateString()}`;
  const description = document.createElement("p");
  description.textContent = `Description: ${event.description}`;
  const location = document.createElement("p");
  location.textContent = `Location: ${event.location}`;
  div.append(name, id, date, description, location);
  return div;
}

function EventList(events) {
  const ul = document.createElement("ul");
  events.forEach((event) => {
    const li = document.createElement("li");
    li.textContent = event.name;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => fetchEventById(event.id));
    ul.appendChild(li);
  });
  return ul;
}

function render() {
  document.body.innerHTML = "";
  const app = document.createElement("div");
  app.id = "app";

  if (!state.events.length) {
    app.textContent = "No events available.";
    document.body.appendChild(app);
    return;
  }

  app.appendChild(EventList(state.events));

  const detailsDiv = document.createElement("div");
  if (state.selectedEvent) {
    detailsDiv.appendChild(EventDetails(state.selectedEvent));
  } else {
    detailsDiv.textContent = "Please select a party to see details.";
    detailsDiv.style.fontStyle = "italic";
  }
  app.appendChild(detailsDiv);

  document.body.appendChild(app);
}

fetchEvents();
