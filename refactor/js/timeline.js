import { API } from './config.js';
import { state } from './state.js';
import { formatDate } from './utils.js';
import { clearMap } from './map.js';
import { handleEmergencyRoomData } from './data.js';
import { handleEmergencyRoomButtonClick } from './ui.js';

export function initTimeline(elements){
  const slider = elements.timelineSlider;
  const label  = elements.timelineLabel;

  if (!slider || !label) return;

  label.textContent = "";

  fetch(API.manifest)
    .then(res => res.json())
    .then(dates => {
      state.availableDates = dates;

      slider.min = 0;
      slider.max = dates.length - 1;
      slider.value = dates.length - 1;

      const today = dates[slider.value];
      label.textContent = formatDate(today);

      slider.addEventListener('input', () => {
        const idx = Number(slider.value);
        const iso = state.availableDates[idx];
        label.textContent = formatDate(iso);
        loadHistory(iso, elements);
      });

      slider.addEventListener('change', () => {
        const idx = Number(slider.value);
        const iso = state.availableDates[idx];
        label.textContent = formatDate(iso);
        loadHistory(iso, elements);
      });
    })
    .catch(err => console.error('Failed to load timeline manifest:', err));
}

export function loadHistory(date, elements){
  fetch(`${API.history}?date=${encodeURIComponent(date)}`)
    .then(res => {
      if (!res.ok) throw new Error('History fetch failed');
      return res.json();
    })
    .then(data => {
      clearMap();
      state.emergencyRoomData = handleEmergencyRoomData(data);

      // Force redraw
      state.emergencyRoomsDisplayed = false;
      handleEmergencyRoomButtonClick(elements, true);
    })
    .catch(err => console.error(`Failed to load history for ${date}:`, err));
}
