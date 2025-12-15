import { MAP_CONFIG, ICONS } from './config.js';
import { state } from './state.js';
import { animateCircleWithRAF, animateLineWithRAF } from './animations.js';

export function createIcon(iconType){
  return L.icon(ICONS[iconType]);
}

export function initializeMap(elements){
  state.map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
  L.tileLayer(MAP_CONFIG.tileLayer.url, MAP_CONFIG.tileLayer.options).addTo(state.map);

  state.map.on('click', () => {
    clearIntro(elements);
    elements.videoDisplay.style.display = "none";
  });

  setTimeout(() => state.map.invalidateSize(), 100);
  return state.map;
}

export function clearIntro(elements){
  if (!elements?.mapStoryButton || !elements?.intro) return;
  elements.mapStoryButton.innerHTML = "About";
  elements.intro.style.display = "none";
}

export function clearMap(){
  if (!state.map) return;

  state.map.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polygon || layer instanceof L.Polyline) {
      state.map.removeLayer(layer);
    }
  });

  clearAnimatedElements();
}

export function clearAnimatedElements(){
  if (!state.map) return;

  state.map.eachLayer(layer => {
    if (layer instanceof L.Circle && layer.options.isAnimated) state.map.removeLayer(layer);
    if (layer instanceof L.Polygon && layer.options.isAnimated) state.map.removeLayer(layer);
  });

  if (state.emergencyRoomLayerGroup) {
    state.map.removeLayer(state.emergencyRoomLayerGroup);
    state.emergencyRoomLayerGroup = null;
  }
}

export function addRoomFeature(room, property, label, color, position, layerArray, radius = 400) {
  const popup = L.popup({ className: `${property}PopUp` });
  popup.setContent(`${room[property]} ${label}`);

  const shadow = L.circle(position, {
    radius: radius * 1.2,
    color: 'rgba(0,0,0,0.3)',
    fillColor: 'rgba(0,0,0,0.2)',
    weight: 2,
    fillOpacity: 0.5,
    isAnimated: true
  }).setStyle({ fillOpacity: 0 });

  const circle = L.circle(position, {
    radius,
    color,
    fillColor: color,
    weight: 0,
    isAnimated: true
  }).setStyle({ fillOpacity: 0 }).bindPopup(popup);

  circle.on("mouseover", () => circle.openPopup());

  const line = L.polygon([position, room.geolocation], { isAnimated: true })
    .setStyle({ color, opacity: 0 });

  animateLineWithRAF(line, 1);

  const delay = Math.random() * 400;
  setTimeout(() => {
    animateCircleWithRAF(shadow, radius * 1.1, 0.4);
    animateCircleWithRAF(circle, radius, 0.8);
  }, delay);

  layerArray.push(shadow, circle, line);
}

export function showAllRoomFeatures(room){
  const roomInfoLayer = [];

  if (room.activeRooms > 0) addRoomFeature(room, 'activeRooms', 'Base ERR', "rgba(246, 174, 194, 0.9)",
    [room.geolocation[0] + .02, room.geolocation[1] + .01], roomInfoLayer);

  if (room.kitchens > 0) addRoomFeature(room, 'kitchens', 'Communal Kitchens', "rgba(254, 225, 199, 0.904)",
    [room.geolocation[0] + .01, room.geolocation[1] + .02], roomInfoLayer);

  if (room.clinic > 0) addRoomFeature(room, 'clinic', 'Clinics', "rgba(210, 127, 216, 1)",
    [room.geolocation[0] - .01, room.geolocation[1] + .01], roomInfoLayer);

  if (room.childrenCenter > 0) addRoomFeature(room, 'childrenCenter', 'Children Centers', "rgba(245, 217, 146, 0.9)",
    [room.geolocation[0] - .01, room.geolocation[1] - .01], roomInfoLayer);

  if (room.pots > 0) addRoomFeature(room, 'pots', 'Pots', "rgba(250, 126, 97, 0.904)",
    [room.geolocation[0] + .02, room.geolocation[1] - .01], roomInfoLayer);

  if (room.womenCoop > 0) addRoomFeature(room, 'womenCoop', 'Women Coops', "rgba(62, 84, 207, 0.9)",
    [room.geolocation[0] + .01, room.geolocation[1] - .02], roomInfoLayer);

  if (room.womenBreak > 0) addRoomFeature(room, 'womenBreak', 'Women Break Rooms', "rgba(75, 205, 241, 0.9)",
    [room.geolocation[0] - .005, room.geolocation[1] - .02], roomInfoLayer);

  if (room.population > 0) {
    const populationRadius = Math.min(room.population / 10, 2000);
    addRoomFeature(room, 'population', `Serving population of ${room.population} people`, "rgba(104, 172, 103, 0.9)",
      [room.geolocation[0] - .03, room.geolocation[1] - .005], roomInfoLayer, populationRadius);
  }

  return L.featureGroup(roomInfoLayer);
}

export function handleRoomClick(room, index, elements){
  if (state.emergencyRoomLayerGroup) state.map.removeLayer(state.emergencyRoomLayerGroup);

  if (state.emergencyRoomDropdown) state.emergencyRoomDropdown.selectedIndex = index;

  const detailsArray = [];
  const roomInfoLayer = [];

  if (room.activeRooms > 0) addRoomFeature(room, 'activeRooms', 'Base ERR', "rgba(246, 174, 194, 0.9)",
    [room.geolocation[0] + .02, room.geolocation[1] + .01], roomInfoLayer);

  if (room.kitchens > 0) addRoomFeature(room, 'kitchens', 'Communal Kitchens', "rgba(254, 225, 199, 0.904)",
    [room.geolocation[0] + .01, room.geolocation[1] + .02], roomInfoLayer);

  if (room.clinic > 0) addRoomFeature(room, 'clinic', 'Clinics', "rgba(210, 127, 216, 1)",
    [room.geolocation[0] - .01, room.geolocation[1] + .01], roomInfoLayer);

  if (room.childrenCenter > 0) addRoomFeature(room, 'childrenCenter', 'Children Centers', "rgba(245, 217, 146, 0.9)",
    [room.geolocation[0] - .01, room.geolocation[1] - .01], roomInfoLayer);

  if (room.pots > 0) addRoomFeature(room, 'pots', 'Pots', "rgba(250, 126, 97, 0.904)",
    [room.geolocation[0] + .02, room.geolocation[1] - .01], roomInfoLayer);

  if (room.womenCoop > 0) addRoomFeature(room, 'womenCoop', 'Women Coops', "rgba(62, 84, 207, 0.9)",
    [room.geolocation[0] + .01, room.geolocation[1] - .02], roomInfoLayer);

  if (room.womenBreak > 0) addRoomFeature(room, 'womenBreak', 'Women Break Rooms', "rgba(75, 205, 241, 0.9)",
    [room.geolocation[0] - .005, room.geolocation[1] - .02], roomInfoLayer);

  if (room.population > 0) {
    const populationRadius = Math.min(room.population / 10, 2000);
    addRoomFeature(room, 'population', `Serving population of ${room.population} people`, "rgba(104, 172, 103, 0.9)",
      [room.geolocation[0] - .03, room.geolocation[1] - .005], roomInfoLayer, populationRadius);
  }

  if (room.photo) {
    const roomImageBounds = L.latLngBounds([
      [room.geolocation[0] + .08, room.geolocation[1] + 0.09],
      [room.geolocation[0] + .03, room.geolocation[1] + 0.03]
    ]);

    const imageOverlay = L.imageOverlay(room.photo, roomImageBounds, {
      opacity: 0.8,
      alt: `${room.name} Emergency room activity`,
      className: "imageFrame",
      interactive: true
    });

    const photoLine = L.polygon([
      [room.geolocation[0] + .03, room.geolocation[1] + 0.03],
      room.geolocation
    ]).setStyle({ color: 'rgb(76, 30, 79, 1)', opacity: 1, weight: 3 });

    roomInfoLayer.push(imageOverlay, photoLine);
  }

  detailsArray.push(room.description || "");
  detailsArray.push("<br>Area controlled by " + (room.controlledBy || ""));

  const roomDetailsText = detailsArray.join(", ") + "</br>";
  elements.emergencyRoomDetails.innerHTML = roomDetailsText;
  elements.mobileDisplay.innerHTML = roomDetailsText;
  elements.mobileDisplay.style.backgroundColor = "rgba(250, 79, 79, 0.888)";

  state.emergencyRoomLayerGroup = L.featureGroup(roomInfoLayer).addTo(state.map);
  state.map.setView(room.geolocation, 13.4);
}
