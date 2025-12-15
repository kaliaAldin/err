import { API } from './config.js';
import { state, setStickyOffset } from './state.js';
import { getElements } from './dom.js';
import { initializeMap } from './map.js';
import { handleHospitalData, handleEmergencyRoomData } from './data.js';
import { wireUI, handleEmergencyRoomButtonClick } from './ui.js';
import { initTimeline } from './timeline.js';

function init(){
  const elements = getElements();

  // Map
  initializeMap(elements);

  // Sticky header offset
  setStickyOffset(elements.header?.offsetTop || 0);

  // UI wiring
  wireUI(elements);

  // Fetch live data then render default view
  fetch(API.liveData)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      state.hospitalData = handleHospitalData(data);
      state.emergencyRoomData = handleEmergencyRoomData(data);

      // Default: show emergency rooms with all features
      handleEmergencyRoomButtonClick(elements, true);

      // Timeline (optional)
      initTimeline(elements);
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', init);
