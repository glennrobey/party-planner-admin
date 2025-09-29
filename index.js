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

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete Event";

  delBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(`${EVENTS_URL}/${event.id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        state.events = state.events.filter((e) => e.id !== event.id);
        state.selectedEvent = null;
        render();
      } else {
        alert("Couldn't delete event.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting event.");
    }
  });

  div.append(name, id, date, description, location, delBtn);
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

fetchEvents();

function AddEventForm() {
  const form = document.createElement("form");

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Name";
  nameInput.required = true;

  const descInput = document.createElement("input");
  descInput.placeholder = "Description";
  descInput.required = true;

  const dateInput = document.createElement("input");
  dateInput.placeholder = "Date";
  dateInput.type = "date";
  dateInput.required = true;

  const locInput = document.createElement("input");
  locInput.placeholder = "Location";
  locInput.required = true;

  const subBtn = document.createElement("button");
  subBtn.textContent = "Add Event";

  form.append(nameInput, descInput, dateInput, locInput, subBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isoDate = new Date(dateInput.value).toISOString();

    const newEvent = {
      name: nameInput.value,
      description: descInput.value,
      date: isoDate,
      location: locInput.value,
    };

    try {
      const res = await fetch(EVENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();

      if (data.success) {
        state.events.push(data.data);
        form.reset();
        render();
      } else {
        alert("Couldn't create event.");
      }
    } catch (err) {
      console.error(err);
      alert("Error with creating event.");
    }
  });

  return form;
}

function render() {
  document.body.innerHTML = "";
  const app = document.createElement("div");
  app.id = "app";

  app.appendChild(AddEventForm());

  if (!state.events.length) {
    const noEvents = document.createElement("p");
    noEvents.textContent = "No events available.";
    app.appendChild(noEvents);
  } else {
    app.appendChild(EventList(state.events));

    const detailsDiv = document.createElement("div");
    if (state.selectedEvent) {
      detailsDiv.appendChild(EventDetails(state.selectedEvent));
    } else {
      detailsDiv.textContent = "Please select a party to see details.";
    }
    app.appendChild(detailsDiv);
    document.body.appendChild(app);
  }
}
