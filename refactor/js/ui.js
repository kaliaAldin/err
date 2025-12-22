import { state } from './state.js';
import { createDropdown, removeDropdown, randomOffset } from './utils.js';
import { clearMap, clearAnimatedElements, showAllRoomFeatures, handleRoomClick, createIcon, clearIntro } from './map.js';
import { setupVideoMarkers } from './videos.js';
import { MAP_CONFIG, VIDEO_MARKERS } from './config.js';
// ---- MAP LEGEND (circle meanings) -----------------------------------------
export function addCircleLegend() {
  if (!state.map) return;

  // prevent adding it twice
  if (state.circleLegendControl) return;

  const legend = L.control({ position: "topright" });

  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "map-legend");

    const items = [
      { color: "dodgerblue", label: "Blue: Women coop — a place for women gathering" },
      { color: "green", label: "Green: Population the Emergency Response Room is serving" },
      { color: "rgba(246, 174, 194, 0.9)", label: "Light Pink: Number of active ERR cells" },
      { color: "rgba(250, 126, 97, 0.904)", label: "Orange: Pots serving ready meals to the population" },
      { color: "wheat", label: "Wheat: Kitchens serving free 2 meals per day" },
      { color: "rgba(245, 217, 146, 0.9)", label: "Yellow: Children center for playing and learning" },
      {color:"rgba(210, 127, 216, 1)", label: "Purple: Clinics providing medical services" },
    ];

    div.innerHTML = `
      <div class="legend-title">Circle meanings</div>
      <ul class="legend-list">
        ${items
          .map(
            (it) => `
          <li>
            <span class="legend-swatch" style="background:${it.color}"></span>
            <span class="legend-text">${it.label}</span>
          </li>`
          )
          .join("")}
      </ul>
    `;

    // Don't let legend clicks/scrolls mess with the map
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    return div;
  };

  legend.addTo(state.map);
  state.circleLegendControl = legend;
}

export function removeCircleLegend() {
  if (state.circleLegendControl && state.map) {
    state.map.removeControl(state.circleLegendControl);
    state.circleLegendControl = null;
  }
}


export function clearDetails(elements){
  elements.hospitalDetails.innerHTML = "";
  elements.emergencyRoomDetails.innerHTML = "";
  elements.emergencyRoomDetails.style.padding = 0;
  elements.mobileDisplay.innerHTML = "";
}

export function handleHeaderScroll(elements){
  if (window.pageYOffset > state.stickyHeaderOffset) {
    elements.header.classList.add("sticky");
  } else {
    elements.header.classList.remove("sticky");
  }
}

export function handleHospitalButtonClick(elements){
  removeCircleLegend(elements)
  clearAnimatedElements();
  elements.videoDisplay.style.display = "none";

  if (state.emergencyRoomLayerGroup) {
    state.map.removeLayer(state.emergencyRoomLayerGroup);
    state.emergencyRoomLayerGroup = null;
  }

  elements.mapStoryButton.innerHTML = "About";
  elements.intro.style.display = "none";
  clearDetails(elements);

  if (!state.hospitalsDisplayed) {
    // Remove emergency rooms if displayed
    if (state.emergencyRoomDropdown) {
      state.emergencyRoomDropdown = removeDropdown(state.emergencyRoomDropdown, elements.emergencyRoomList);
      state.emergencyRoomsDisplayed = false;
    }

    clearMap();

    // Display hospitals
    state.hospitalDropdown = createDropdown(state.hospitalData, elements.hospitalList, "hospitalDropdown");

    state.hospitalData.forEach((hospital, index) => {
      const iconType = hospital.status === "Operational" ? "hospital1" : "hospital2";
      const icon = createIcon(iconType);
      const statusStatement = hospital.status === "Operational"
        ? " hospital is operating \nالمستشفي في الخدمة  "
        : " hospital is out of service المستشفي خارج الخدمة ";

      const marker = L.marker(hospital.geolocation, { icon })
        .bindPopup(hospital.name + statusStatement)
        .addTo(state.map);

      marker.on("click", () => {
        state.hospitalDropdown.selectedIndex = index;
        updateHospitalDetails(elements, index);
        state.map.setView(marker.getLatLng(), 13);
        marker.openPopup();
      });

      marker.on("mouseover", () => marker.openPopup());

      if (hospital.status !== "Operational") {
        state.hospitalDropdown.options[index].style.backgroundColor = "red";
      }
    });

    state.hospitalsDisplayed = true;
  } else {
    state.hospitalDropdown = removeDropdown(state.hospitalDropdown, elements.hospitalList);
    clearMap();
    state.hospitalsDisplayed = false;
  }

  state.hospitalDropdown?.addEventListener('change', (e) => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex !== -1) {
      updateHospitalDetails(elements, selectedIndex);
      state.map.setView(state.hospitalData[selectedIndex].geolocation, 13);
    }
  });
}

export function updateHospitalDetails(elements, index){
  const hospital = state.hospitalData[index];
  const detailsText = `Hospital is ${hospital.status}</br> located in ${hospital.district}</br>
                      The area probably controlled by ${hospital.controlledBy}`;

  elements.hospitalDetails.innerHTML = detailsText;
  elements.mobileDisplay.innerHTML = detailsText;
  elements.mobileDisplay.style.backgroundColor = "rgba(91, 89, 229, 0.904)";
}

export function handleEmergencyRoomButtonClick(elements, showAllFeatures = false){
  clearDetails(elements);
  clearAnimatedElements();
  elements.videoDisplay.style.display = "none";

  if (state.emergencyRoomDropdown) {
    state.emergencyRoomDropdown = removeDropdown(state.emergencyRoomDropdown, elements.emergencyRoomList);
  }
  state.emergencyRoomsDisplayed = false;

  if (!state.emergencyRoomsDisplayed) {
    if (state.hospitalsDisplayed) {
      state.hospitalDropdown = removeDropdown(state.hospitalDropdown, elements.hospitalList);
      state.hospitalsDisplayed = false;
    }

    clearMap();

    state.emergencyRoomDropdown = createDropdown(state.emergencyRoomData, elements.emergencyRoomList, "roomDropdown");

    state.emergencyRoomData.forEach((room, index) => {
      const roomColor = "white";
      const initialRadius = 800;

      const roomCircle = L.circle(room.geolocation, {
        radius: initialRadius,
        color: roomColor,
        fillColor: roomColor,
        fillOpacity: 0.5,
        weight: 0,
      }).bindPopup(room.name).addTo(state.map);

      if (showAllFeatures) {
        state.emergencyRoomLayerGroup = showAllRoomFeatures(room);
        state.emergencyRoomLayerGroup.addTo(state.map);
      }

      roomCircle.on("mouseover", () => {
        roomCircle.setStyle({ fillColor: 'lightblue', color: 'lightblue' });
        roomCircle.setRadius(initialRadius * 2);
        roomCircle.openPopup();
        elements.emergencyRoomDetails.style.backgroundColor = "rgba(169, 229, 249, 0.5)";
        elements.emergencyRoomDetails.style.color = "black";
      });

      roomCircle.on("mouseout", () => {
        roomCircle.setStyle({ fillColor: 'wheat', color: 'wheat' });
        roomCircle.setRadius(initialRadius);
        elements.emergencyRoomDetails.style.backgroundColor = "rgba(250, 79, 79, 0.888)";
        elements.emergencyRoomDetails.style.color = "Black";
      });

      roomCircle.on("click", () => handleRoomClick(room, index, elements));
      roomCircle.on("touchstart", () => handleRoomClick(room, index, elements));
    });

    state.emergencyRoomsDisplayed = true;
  } else {
    clearMap();
    state.emergencyRoomDropdown = removeDropdown(state.emergencyRoomDropdown, elements.emergencyRoomList);
    state.emergencyRoomsDisplayed = false;
    state.map.setView(MAP_CONFIG.center, 13);
  }

  state.emergencyRoomDropdown?.addEventListener('change', (e) => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex !== -1) {
      updateEmergencyRoomDetails(elements, selectedIndex);
      state.map.setView(state.emergencyRoomData[selectedIndex].geolocation, 14);
    }
  });
}

export function updateEmergencyRoomDetails(elements, index){
  const room = state.emergencyRoomData[index];
  const detailsArray = [];

  if (room.activeRooms > 0) detailsArray.push(`${room.activeRooms} Base ERR`);
  if (room.kitchens > 0) detailsArray.push(`${room.kitchens} Communal Kitchens`);
  if (room.clinic > 0) detailsArray.push(`${room.clinic} Clinics`);
  if (room.childrenCenter > 0) detailsArray.push(`${room.childrenCenter} Children Centers`);
  if (room.pots > 0) detailsArray.push(`${room.pots} Pots`);
  if (room.womenCoop > 0) detailsArray.push(`${room.womenCoop} Women Coops`);
  if (room.womenBreak > 0) detailsArray.push(`${room.womenBreak} Women Break Rooms`);
  if (room.population > 0) detailsArray.push(`Serving population of ${room.population} people`);

  detailsArray.push("<br>Area controlled by " + room.controlledBy);

  const roomDetailsText = detailsArray.join(", ") + "</br>";
  elements.emergencyRoomDetails.innerHTML = roomDetailsText;
  elements.mobileDisplay.innerHTML = roomDetailsText;
  elements.mobileDisplay.style.backgroundColor = "rgba(250, 79, 79, 0.888)";
}

export function handleStoriesButtonClick(elements){
  clearDetails(elements);
  clearAnimatedElements();

  elements.mapStoryButton.innerHTML = "About";
  elements.intro.style.display = "none";
  elements.videoDisplay.style.display = "none";

  elements.emergencyRoomDetails.innerHTML = "For the safety of citizens and activists, these videos do not represent actual locations";
  elements.emergencyRoomDetails.style.backgroundColor = "rgb(139, 48, 145)";

  if (state.emergencyRoomDropdown) {
    state.emergencyRoomDropdown = removeDropdown(state.emergencyRoomDropdown, elements.emergencyRoomList);
    state.emergencyRoomsDisplayed = false;
  }

  if (state.hospitalDropdown) {
    state.hospitalDropdown = removeDropdown(state.hospitalDropdown, elements.hospitalList);
    state.hospitalsDisplayed = false;
  }

  clearMap();

  // In your original code, Stories shows the iframe gallery + jitters markers (if used).
  // Here we keep the iframe gallery as the main UX.
  setupVideoMarkers(elements);
  state.map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
}

export function toggleMapStory(elements){
  clearDetails(elements);
  elements.videoDisplay.style.display = "none";
  removeCircleLegend();

  if (elements.mapStoryButton.innerHTML === "Map") {
    addCircleLegend();  
    elements.mapStoryButton.innerHTML = "About";
    elements.intro.style.display = "none";
    elements.container.style.display = "flex";
    setTimeout(() => state.map.invalidateSize(), 100);
  } else {
    elements.mapStoryButton.innerHTML = "Map";
    elements.container.style.display = "flex";
    elements.intro.style.display = "block";
  }
}

export function wireUI(elements){
  removeCircleLegend(elements)
  
  window.onscroll = () => handleHeaderScroll(elements);

  elements.storiesButton.addEventListener('click', () => {
    clearAnimatedElements();
    clearMap();
    clearDetails(elements);
    clearIntro(elements);
    handleStoriesButtonClick(elements);
    removeCircleLegend(elements)
     
  });

  elements.hospitalButton.addEventListener('click', () => handleHospitalButtonClick(elements));

  elements.emergencyRoomButton.addEventListener('click', () => {
     addCircleLegend();
    clearIntro(elements);
    handleEmergencyRoomButtonClick(elements, false);
  });

  elements.mapStoryButton.addEventListener('click', () => toggleMapStory(elements));

  elements.openAll.addEventListener('click', () => handleEmergencyRoomButtonClick(elements, true));
}
