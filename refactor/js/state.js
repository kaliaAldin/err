// Shared state container

export const state = {
  stickyHeaderOffset: 0,
  map: null,

  videoMarkers: [],
  hospitalMarkers: [],
  emergencyRoomMarkers: [],

  hospitalDropdown: null,
  emergencyRoomDropdown: null,
  emergencyRoomLayerGroup: null,

  hospitalsDisplayed: false,
  emergencyRoomsDisplayed: false,

  hospitalData: [],
  emergencyRoomData: [],
  videoLines: [],

  availableDates: [],
};

export function setStickyOffset(px){
  state.stickyHeaderOffset = px;
}
