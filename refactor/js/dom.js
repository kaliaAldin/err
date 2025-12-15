// DOM element registry (call after DOM is loaded)

export function getElements(){
  return {
    header: document.getElementById("headermain"),
    storiesButton: document.getElementById("story"),
    hospitalButton: document.getElementById("hos"),
    hospitalList: document.getElementById("HosList"),
    hospitalDetails: document.getElementById("hosDetails"),
    emergencyRoomButton: document.getElementById("ER"),
    emergencyRoomList: document.getElementById("RoomList"),
    emergencyRoomDetails: document.getElementById("RoomDetails"),
    videoDisplay: document.getElementById("videosDisplay"),
    mobileDisplay: document.getElementById("mobileDesplayID"),
    intro: document.getElementById("intro"),
    mapStoryButton: document.getElementById("mapStory"),
    container: document.getElementById("container"),
    openAll: document.getElementById("Openall"),
    timelineSlider: document.getElementById('date-slider'),
    timelineLabel: document.getElementById('date-label'),
  };
}
