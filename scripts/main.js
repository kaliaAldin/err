// Constants and Configuration
const MAP_CONFIG = {
  center: [15.565997978769493, 32.530363706569275],
  zoom: 12.5,
  tileLayer: {
    url: 'https://sudancivicmap.com/mapbox-tiles/styles/v1/{id}/tiles/{z}/{x}/{y}',
    options: {
      maxZoom: 30,
      id: 'ahmed-isam/clhos6n5v01ml01qt6cqgcmnr',
      tileSize: 512,
      zoomOffset: -1,
    }
  }
};

const ICONS = {
  video: {
    iconUrl: "images/videoIcon.png",
    shadowUrl: '/images/videoShadow.png',
    iconSize: [70, 70],
    shadowSize: [70, 70],
    iconAnchor: [12, 55],
    shadowAnchor: [14, 50],
    popupAnchor: [-1, -36]
  },
  hospital1: {
    iconUrl: "/images/hospital.png",
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [50, 50],
    shadowSize: [50, 50],
    iconAnchor: [12, 55],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  },
  hospital2: {
    iconUrl: "/images/hospital2.png",
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [50, 50],
    shadowSize: [50, 50],
    iconAnchor: [12, 55],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  },
  emergencyRoom: {
    iconUrl: "/images/ErrLogoRed-01.png",
    iconSize: [50, 50],
    shadowSize: [30, 30],
    iconAnchor: [50, 50],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  }
};

const VIDEO_MARKERS = [
  {
    position: [15.639717, 32.540528],
    videoId: "LwOtvXB_Nwk",
    caption:"After spending 48 days in RSF detention, Camoun is home free. He tells us about what he experienced, and the ethnic and tribal tension fueling the war."
  },
  {
    position: [15.639717 - .12, 32.540528 + .04],
    videoId: "UEQPi9febBA",
    caption:"After 34 days in detention at one of the Rapid Support Forces' camps in Khartoum, West Jireif Emergency Response Team member Ahmed Elhadi is released, to the relief of his family, friends and comrades."
  },
  {
    position: [15.639717 - .08, 32.540528 + .04],
    videoId: "S6LGZRqsYnk",
    caption:"Get to know some of the electrical engineers on the front lines, working to provide residents of Khartoum with power in the midst of war."
  },
  {
    position: [15.639717 - .01, 32.540528 + .06],
    videoId: "lLzjpKwYMSw",
    caption:"Nafisa and her son run one of the few remaining shops in the Jireif neighborhood of Khartoum. Despite the danger and difficulty, they are determined to stay and help their community make it through."
  },
  {
    position: [15.639717 - .06, 32.540528 - .03],
    videoId: "0EuxcBheteI",
    caption:"In Sudan, this year's Eid-ul-Fitr was marked by the first sounds of war. For the fourth consecutive year, what should have been a time for celebration and togetherness, was marred by blood and tragedy. But to be Sudanese is to be resilient, to be unbroken, and to choose life in the midst of death."
  },
  {
    position: [15.639717 - .06, 32.540528 - 0.09],
    videoId: "I_IBKcGYjlY",
    caption:"As the war rages on, neighborhod committees and volunteers come together to support their communities, providing everything from food and basic necessities to lifesaving medications and healthcare. In the absence of a State, the people are doing for themselves."
  },
  {
    position: [15.639717 , 32.540528 - 0.09],
    videoId: "vd8hWuadV-M",
    caption:"The civilian, voluntarily led Emergency Response Rooms are offering a lifeline for the multitude of war-affected civilians in Sudan -often at great personal risk. With NGOs facing severe access issues - people are relying more and more on these local efforts."
  },
  {
    position: [15.639717 - .07, 32.540528 - 0.05],
    videoId: "R8XY940Y-50",
    caption:"A representative of the Khartoum State Emergency Room said that their teams were able to evacuate citizens from areas attacked by the Rapid Support Forces. She also said that the Sudanese people are the first to suffer from the ongoing war between the Rapid Support Forces and the Sudanese army."

  },
    {
    position: [15.639717 - .12, 32.540528 - 0.05],
    videoId: "D_kcpSrCecE",
    caption:"In light of the war, thousands have fled the capital Khartoum -- but millions remain. A tea vendor in West Jiref neighbourhood talks about why she and her family are staying."

  },
    {
    position: [15.639717 - .1, 32.540528 - 0.1],
    videoId: "P2BJEYFiJL4",
    caption:"Sarah Elobaid takes a close look into the work of the Emergency Response Rooms and their impacts, with guests who have direct experience with these youth-led networks."

  }
  
];


// DOM Elements
const elements = {
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
  openAll: document.getElementById("Openall")
};
function getRandomColor() {
  return '#' + Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6, '0');
}



// State Management
let state = {
  stickyHeaderOffset: elements.header.offsetTop,
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
  emergencyRoomDetails:[],
  videoLines: []

};
let availableDates = [];

function formatDate(iso) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function initTimeline() {
  const slider = document.getElementById('date-slider');
  const label  = document.getElementById('date-label');
  
  // clear any stray text
  label.textContent = "";

  fetch('https://sudancivicmap.com/history/manifest')
    .then(res => {
      
      return res.json();
    })
    .then(dates => {
      availableDates = dates;

      slider.min   = 0;
      slider.max   = dates.length - 1;
      slider.value = dates.length - 1;

      const today = dates[slider.value];
      label.textContent = formatDate(today);

      slider.addEventListener('input', () => {
        const idx  = +slider.value;
        const date = availableDates[idx];
        label.textContent = formatDate(date);
        
        
        loadHistory(date);
      });
      slider.addEventListener('change', () => {
  const idx  = Number(slider.value);
  const iso  = availableDates[idx];
  label.textContent = formatDate(iso);
  loadHistory(date);
});
    })
    .catch(err => console.error('Failed to load timeline manifest:', err));
}


function loadHistory(date) {
   fetch(`https://sudancivicmap.com/history?date=${date}`)
    .then(res => {
      if (!res.ok) throw new Error('History fetch failed');
      return res.json();
    })
    .then(data => {
      clearMap();
      state.emergencyRoomData = handleEmergencyRoomData(data);

      // Force the “draw” path:
      state.emergencyRoomsDisplayed = false;

      // Now this will always draw the new rooms:
      handleEmergencyRoomButtonClick(true);
    })
    .catch(err => console.error(`Failed to load history for ${date}:`, err))
}
// Utility Functions
function createVideoPopup(videoId) {
  // Create an iframe element
  const iframe = document.createElement('iframe');
  iframe.width = '560';
  iframe.height = '315';
  iframe.src = `https://www.youtube.com/embed/${videoId}?si=_JZL9scwMPV1Hq5t`;
  iframe.title = 'YouTube video player';
  iframe.frameBorder = '0';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;

  // Append it to your target container
  elements.videoDisplay.appendChild(iframe);
}

function createIcon(iconType) {
  return L.icon(ICONS[iconType]);
}


function animateCircleWithRAF(circle, targetRadius, targetOpacity, duration = 700) {
  const startTime = performance.now();
  const initialRadius = 0;
  const initialOpacity = 0;

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentRadius = initialRadius + progress * targetRadius;
    const currentOpacity = initialOpacity + progress * targetOpacity;

    circle.setStyle({ fillOpacity: currentOpacity });
    circle.setRadius(currentRadius);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function animateLineWithRAF(line, targetOpacity, duration = 2000) {
  const startTime = performance.now();
  const initialOpacity = 0;

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentOpacity = initialOpacity + progress * targetOpacity;

    line.setStyle({ opacity: currentOpacity });

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Map Initialization
function initializeMap() {
  state.map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
  L.tileLayer(MAP_CONFIG.tileLayer.url, MAP_CONFIG.tileLayer.options).addTo(state.map);
  
  // Clear animations when clicking anywhere on the map
  state.map.on('click', function(e) {
    if (e.originalEvent && e.originalEvent.target.classList.contains('leaflet-container')) {
      clearAnimatedElements();
    }
  });
  
  setTimeout(() => {
    state.map.invalidateSize();
  }, 100);
}

// Video Markers
// add this helper at top-level
function randomOffset(maxDelta) {
  return (Math.random() - 0.5) * maxDelta;
}

// replace your setupVideoMarkers() with:
function setupVideoMarkers() {
  // Clear existing videos
  elements.videoDisplay.innerHTML = '';

  // Loop through each video and create an iframe + caption
  VIDEO_MARKERS.forEach((video, index) => {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-item');

    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = `https://www.youtube.com/embed/${video.videoId}`;
    iframe.title = `Video ${index + 1}`;
    iframe.frameBorder = '0';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;

    const caption = document.createElement('p');
    caption.classList.add('video-caption');
    caption.textContent = video.caption; // or any caption text you want

    videoContainer.appendChild(iframe);
    videoContainer.appendChild(caption);

    elements.videoDisplay.appendChild(videoContainer);
    elements.videoDisplay.style.display="flex"
  });
}



// Data Handling
function handleHospitalData(data) {
  return data.Hospitals.map(hospital => {
    const geolocation = hospital.GPS_Location.split(',').map(coord => parseFloat(coord.trim()));
    
    if (geolocation.length === 2 && !isNaN(geolocation[0]) && !isNaN(geolocation[1])) {
      return {
        name: hospital.name,
        geolocation: geolocation,
        status: hospital.Status,
        district: hospital.District,
        controlledBy: hospital.Controlled_By
      };
    }
    console.error("Invalid GPSLocation data for hospital: " + hospital.name);
    return null;
  }).filter(Boolean);
}

function handleEmergencyRoomData(data) {
  return data.BaseERR.map(room => {
    const geolocation = room.geolocation.split(',').map(coord => parseFloat(coord.trim()));
    
    if (geolocation.length === 2 && !isNaN(geolocation[0]) && !isNaN(geolocation[1])) {
      return {
        name: room.baseerr,
        geolocation: geolocation,
        activeRooms: room.rooms,
        district: room.district,
        controlledBy: room.controlledby,
        kitchens: room.kitchens,
        pots: room.pots,
        clinic: room.clinics,
        childrenCenter: room.childrencenters,
        womenCoop: room.womencoops,
        womenBreak: room.womenrestrooms,
        population: room.ServedPopulation,
        arabicName: room.ArabicName,
        description: room.Discription,
        photo: room.photos
      };
    }
    console.error("Invalid GPSLocation data for room: " + room.baseerr);
    return null;
  }).filter(Boolean);
}

// UI Functions
function clearMap() {
  state.map.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.polygon || layer instanceof L.Polyline) {
      state.map.removeLayer(layer);
    }
    clearAnimatedElements()
    
  });
  
  if (state.emergencyRoomLayerGroup) {
    state.map.removeLayer(state.emergencyRoomLayerGroup);
    state.emergencyRoomLayerGroup = null;
  }
}
function clearAnimatedElements() {
  // Remove all existing animated lines and circles
  state.map.eachLayer(layer => {
    if (layer instanceof L.Circle && layer.options.isAnimated) {
      state.map.removeLayer(layer);
    }
    if (layer instanceof L.Polygon && layer.options.isAnimated) {
      state.map.removeLayer(layer);
    }
  });
  
  if (state.emergencyRoomLayerGroup) {
    state.map.removeLayer(state.emergencyRoomLayerGroup);
    state.emergencyRoomLayerGroup = null;
  }
}
function clearDetails() {
  elements.hospitalDetails.innerHTML = "";
  elements.emergencyRoomDetails.innerHTML = "";
  elements.mobileDisplay.innerHTML = "";
  
}

function createDropdown(options, parentElement, id) {
  const dropdown = document.createElement("select");
  dropdown.id = id;
  
  options.forEach((option, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index;
    optionElement.textContent = option.name;
    dropdown.appendChild(optionElement);
  });
  
  parentElement.appendChild(dropdown);
  return dropdown;
}

function removeDropdown(dropdown, parentElement) {
  if (dropdown) {
    parentElement.removeChild(dropdown);
    return null;
  }
  return null;
}

// Event Handlers
function handleHeaderScroll() {
  if (window.pageYOffset > state.stickyHeaderOffset) {
    elements.header.classList.add("sticky");
  } else {
    elements.header.classList.remove("sticky");
  }
}

function handleHospitalButtonClick() {
   clearAnimatedElements();
   elements.videoDisplay.style.display="none"
  if (state.emergencyRoomLayerGroup) {
    state.map.removeLayer(state.emergencyRoomLayerGroup);
    state.emergencyRoomLayerGroup = null;
  }
   elements.mapStoryButton.innerHTML = "ABOUT";
    elements.intro.style.display = "none";
  clearDetails();
  
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
      const statusStatement = hospital.status === "Operational" ? 
        " hospital is operating \nالمستشفي في الخدمة  " : 
        " hospital is out of service المستشفي خارج الخدمة ";
      
      const marker = L.marker(hospital.geolocation, { icon: icon })
        .bindPopup(hospital.name + statusStatement)
        .addTo(state.map);
      
      marker.on("click", () => {
        state.hospitalDropdown.selectedIndex = index;
        updateHospitalDetails(index);
        state.map.setView(marker.getLatLng(), 13);
        marker.openPopup();
      });
      
      marker.on("mouseover", () => marker.openPopup());
      
      // Style dropdown option for non-operational hospitals
      if (hospital.status !== "Operational") {
        state.hospitalDropdown.options[index].style.backgroundColor = "red";
      }
    });
    
    state.hospitalsDisplayed = true;
  } else {
    // Remove hospitals
    state.hospitalDropdown = removeDropdown(state.hospitalDropdown, elements.hospitalList);
    clearMap();
    state.hospitalsDisplayed = false;
  }
  
  // Setup dropdown change event
  state.hospitalDropdown?.addEventListener('change', (e) => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex !== -1) {
      updateHospitalDetails(selectedIndex);
      state.map.setView(state.hospitalData[selectedIndex].geolocation, 13);
    }
  });
}

function updateHospitalDetails(index) {
  const hospital = state.hospitalData[index];
  const detailsText = `Hospital is ${hospital.status}</br> located in ${hospital.district}</br>
                      The area probably controlled by ${hospital.controlledBy}`;
  
  elements.hospitalDetails.innerHTML = detailsText;
  elements.mobileDisplay.innerHTML = detailsText;
  elements.mobileDisplay.style.backgroundColor = "rgba(91, 89, 229, 0.904)";
}

function handleEmergencyRoomButtonClick(showAllFeatures = false) {
   clearDetails();
   clearAnimatedElements();
   elements.videoDisplay.style.display="none"
   // Remove any previous dropdown before we do anything
  if (state.emergencyRoomDropdown) {
  state.emergencyRoomDropdown = removeDropdown(
      state.emergencyRoomDropdown,
      elements.emergencyRoomList
    );
  }
  state.emergencyRoomsDisplayed = false; // reset the toggle flag
  
  
  if (!state.emergencyRoomsDisplayed) {
    // Remove hospitals if displayed
    if (state.hospitalsDisplayed) {
      state.hospitalDropdown = removeDropdown(state.hospitalDropdown, elements.hospitalList);
      state.hospitalsDisplayed = false;
    }
    
    clearMap();
    
    // Display emergency rooms
    state.emergencyRoomDropdown = createDropdown(state.emergencyRoomData, elements.emergencyRoomList, "roomDropdown");
    
    
    state.emergencyRoomData.forEach((room, index) => {
      const roomColor = "wheat";
      const initialRadius = 800;
      
      const roomCircle = L.circle(room.geolocation, {
        radius: initialRadius,
        color: roomColor,
        fillColor: roomColor,
        fillOpacity: 0.5,
        weight: 0,
      }).bindPopup(room.name).addTo(state.map);
       
      // Show all features on initial load if requested
      if (showAllFeatures) {
        state.emergencyRoomLayerGroup = showAllRoomFeatures(room);
        state.emergencyRoomLayerGroup.addTo(state.map);
      }
      
      // Event handlers
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
      
      roomCircle.on("click", () => handleRoomClick(room, index));
      roomCircle.on("touchstart", () => handleRoomClick(room, index));
    });
    
    state.emergencyRoomsDisplayed = true;
  } else {
    // Remove emergency rooms
    clearMap();
    state.emergencyRoomDropdown = removeDropdown(state.emergencyRoomDropdown, elements.emergencyRoomList);
    state.emergencyRoomsDisplayed = false;
    state.map.setView(MAP_CONFIG.center, 13);
  }
  
  // Setup dropdown change event
  state.emergencyRoomDropdown?.addEventListener('change', (e) => {
    const selectedIndex = e.target.selectedIndex;
    if (selectedIndex !== -1) {
      updateEmergencyRoomDetails(selectedIndex);
      state.map.setView(state.emergencyRoomData[selectedIndex].geolocation, 14);
    }
  });
 
}
function showAllRoomFeatures(room) {
  const roomInfoLayer = [];
  
  // Add all room features to the map
  if (room.activeRooms > 0) {
    addRoomFeature(room, 'activeRooms', 'Base ERR', "rgba(246, 174, 194, 0.9)", 
                  [room.geolocation[0] + .02, room.geolocation[1] + .01], roomInfoLayer);
  }
  
  if (room.kitchens > 0) {
    addRoomFeature(room, 'kitchens', 'Communal Kitchens', "rgba(254, 225, 199, 0.904)", 
                  [room.geolocation[0] + .01, room.geolocation[1] + .02], roomInfoLayer);
  }
  
  if (room.clinic > 0) {
    addRoomFeature(room, 'clinic', 'Clinics', "rgba(210, 127, 216, 1)", 
                  [room.geolocation[0] - .01, room.geolocation[1] + .01], roomInfoLayer);
  }
  
  if (room.childrenCenter > 0) {
    addRoomFeature(room, 'childrenCenter', 'Children Centers', "rgba(245, 217, 146, 0.9)", 
                  [room.geolocation[0] - .01, room.geolocation[1] - .01], roomInfoLayer);
  }
  
  if (room.pots > 0) {
    addRoomFeature(room, 'pots', 'Pots', "rgba(250, 126, 97, 0.904)", 
                  [room.geolocation[0] + .02, room.geolocation[1] - .01], roomInfoLayer);
  }
  
  if (room.womenCoop > 0) {
    addRoomFeature(room, 'womenCoop', 'Women Coops', "rgba(62, 84, 207, 0.9)", 
                  [room.geolocation[0] + .01, room.geolocation[1] - .02], roomInfoLayer);
  }
  
  if (room.womenBreak > 0) {
    addRoomFeature(room, 'womenBreak', 'Women Break Rooms', "rgba(75, 205, 241, 0.9)", 
                  [room.geolocation[0] - .005, room.geolocation[1] - .02], roomInfoLayer);
  }
  
  if (room.population > 0) {
    const populationRadius = Math.min(room.population / 10, 2000);
    addRoomFeature(room, 'population', `Serving population of ${room.population} people`, 
                  "rgba(104, 172, 103, 0.9)", 
                  [room.geolocation[0] - .03, room.geolocation[1] - .005], 
                  roomInfoLayer, populationRadius);
  }
  
  
  
  return L.featureGroup(roomInfoLayer);
}


function handleRoomClick(room, index) {
   
  if (state.emergencyRoomLayerGroup) {
    state.map.removeLayer(state.emergencyRoomLayerGroup);
  }
  
  
  state.emergencyRoomDropdown.selectedIndex = index;
  
  const detailsArray = [];
  const roomInfoLayer = [];
  
  // Add room features to the map and details array
  if (room.activeRooms > 0) {
    addRoomFeature(room, 'activeRooms', 'Base ERR', "rgba(246, 174, 194, 0.9)", 
                  [room.geolocation[0] + .02, room.geolocation[1] + .01], roomInfoLayer);
  }
  
  if (room.kitchens > 0) {
    addRoomFeature(room, 'kitchens', 'Communal Kitchens', "rgba(254, 225, 199, 0.904)", 
                  [room.geolocation[0] + .01, room.geolocation[1] + .02], roomInfoLayer);
  }
  
  if (room.clinic > 0) {
    addRoomFeature(room, 'clinic', 'Clinics', "rgba(210, 127, 216, 1)", 
                  [room.geolocation[0] - .01, room.geolocation[1] + .01], roomInfoLayer);
  }
  
  if (room.childrenCenter > 0) {
    addRoomFeature(room, 'childrenCenter', 'Children Centers', "rgba(245, 217, 146, 0.9)", 
                  [room.geolocation[0] - .01, room.geolocation[1] - .01], roomInfoLayer);
  }
  
  if (room.pots > 0) {
    addRoomFeature(room, 'pots', 'Pots', "rgba(250, 126, 97, 0.904)", 
                  [room.geolocation[0] + .02, room.geolocation[1] - .01], roomInfoLayer);
  }
  
  if (room.womenCoop > 0) {
    addRoomFeature(room, 'womenCoop', 'Women Coops', "rgba(62, 84, 207, 0.9)", 
                  [room.geolocation[0] + .01, room.geolocation[1] - .02], roomInfoLayer);
  }
  
  if (room.womenBreak > 0) {
    addRoomFeature(room, 'womenBreak', 'Women Break Rooms', "rgba(75, 205, 241, 0.9)", 
                  [room.geolocation[0] - .005, room.geolocation[1] - .02], roomInfoLayer);
  }
  
  if (room.population > 0) {
    const populationRadius = Math.min(room.population / 10, 2000);
    addRoomFeature(room, 'population', `Serving population of ${room.population} people`, 
                  "rgba(104, 172, 103, 0.9)", 
                  [room.geolocation[0] - .03, room.geolocation[1] - .005], 
                  roomInfoLayer, populationRadius);
  }
  
  // Add room photo if available
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
  
  // Add description and control information
  detailsArray.push(room.description);
  detailsArray.push("<br>Area controlled by " + room.controlledBy);
  
  // Update UI
  const roomDetailsText = detailsArray.join(", ") + "</br>";
  elements.emergencyRoomDetails.innerHTML = roomDetailsText;
  elements.mobileDisplay.innerHTML = roomDetailsText;
  elements.mobileDisplay.style.backgroundColor = "rgba(250, 79, 79, 0.888)";
  
  // Add layer group to map
  state.emergencyRoomLayerGroup = L.featureGroup(roomInfoLayer).addTo(state.map);
  state.map.setView(room.geolocation, 13.4);
}

function addRoomFeature(room, property, label, color, position, layerArray, radius = 400) {
  const popup = L.popup({ className: `${property}PopUp` });
  popup.setContent(`${room[property]} ${label}`);
  
  // Create the shadow first (larger and darker)
  const shadow = L.circle(position, {
    radius: radius * 1.2, // Slightly larger than main circle
    color: 'rgba(0,0,0,0.3)',
    fillColor: 'rgba(0,0,0,0.2)',
    weight: 2,
    fillOpacity: 0.5,
    isAnimated: true
  }).setStyle({ fillOpacity: 0 });
  
  // Create the main circle
  const circle = L.circle(position, {
    radius: radius,
    color: color,
    fillColor: color,
    weight: 0,
    isAnimated: true
  }).setStyle({ fillOpacity: 0 }).bindPopup(popup);
  
  circle.on("mouseover", () => circle.openPopup());
  
  const line = L.polygon([position, room.geolocation], {
    isAnimated: true
  }).setStyle({ color: color, opacity: 0 });
  
  // Animate all elements
  animateLineWithRAF(line, 1);
  const delay = Math.random() * 400;

setTimeout(() => {
  animateCircleWithRAF(shadow, radius * 1.1, 0.4);
  animateCircleWithRAF(circle, radius, 0.8);
}, delay);
  
  // Add shadow first so it appears behind the main circle
  layerArray.push(shadow, circle, line);
}

function updateEmergencyRoomDetails(index) {
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

function handleStoriesButtonClick() {
  clearDetails();
  clearAnimatedElements();
     

   elements.mapStoryButton.innerHTML = "ABOUT";
    elements.intro.style.display = "none";
    elements.videoDisplay.style.display="none"
    
 
  elements.emergencyRoomDetails.innerHTML = "For the safety of citizens and activists, these videos do not represent actual locations";
  elements.emergencyRoomDetails.style.backgroundColor = "rgb(139, 48, 145)";
  
  // Remove dropdowns and layers
  if (state.emergencyRoomDropdown) {
    state.emergencyRoomDropdown = removeDropdown(state.emergencyRoomDropdown, elements.emergencyRoomList);
    state.emergencyRoomsDisplayed = false;
  }
  
  if (state.hospitalDropdown) {
    state.hospitalDropdown = removeDropdown(state.hospitalDropdown, elements.hospitalList);
    state.hospitalsDisplayed = false;
  }
  
  clearMap();
  
  // Add video markers
  state.videoMarkers.forEach(marker => marker.addTo(state.map));
  state.map.setView([15.639717 - .12, 32.540528 + .04], 12);
}

function toggleMapStory() {
    clearDetails();
    elements.videoDisplay.style.display="none"
  if (elements.mapStoryButton.innerHTML === "MAP") {
   
    elements.mapStoryButton.innerHTML = "ABOUT";
    elements.intro.style.display = "none";
    elements.container.style.display = "flex";
    setTimeout(() => {
      state.map.invalidateSize();
    }, 100);
  } else {
     clearDetails();
    elements.mapStoryButton.innerHTML = "MAP";
    elements.container.style.display = "flex";
    elements.intro.style.display = "block";
  }
}
function clearInro(){
   elements.mapStoryButton.innerHTML = "ABOUT";
   elements.intro.style.display = "none";
}

// Initialization
// Initialization
function init() {
  // Initialize map
  initializeMap();
  
  
  // Set up scroll handler for sticky header
  window.onscroll = handleHeaderScroll;
  
  // Set up button event listeners
 
  elements.storiesButton.addEventListener('click', () => {
  clearAnimatedElements();
    clearMap();
    clearDetails();
    clearInro();
    setupVideoMarkers();
  // for each marker, compute & set a new random lat/lng...
  state.videoMarkers.forEach((marker, idx) => {
    const [lat0, lng0] = VIDEO_MARKERS[idx].position;
    const jitter = 0.02;
    const newPos = [
      lat0 + randomOffset(jitter),
      lng0 + randomOffset(jitter)
    ];
    marker.setLatLng(newPos).addTo(state.map);
  });
  // **NEW**: draw fresh random-colored lines
  
  state.map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
});
  elements.hospitalButton.addEventListener('click', handleHospitalButtonClick);
elements.emergencyRoomButton.addEventListener('click', function() {
    clearInro();
    handleEmergencyRoomButtonClick(false);
}); // Don't show all features on button click
  elements.mapStoryButton.addEventListener('click', toggleMapStory);
  elements.openAll.addEventListener('click' ,() => handleEmergencyRoomButtonClick(true));
  
  
  // Fetch data
  fetch('https://sudancivicmap.com/data')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      state.hospitalData = handleHospitalData(data);
      state.emergencyRoomData = handleEmergencyRoomData(data);
      
      // Show emergency rooms with all features by default
      handleEmergencyRoomButtonClick(true);
      initTimeline();
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Start the application
document.addEventListener('DOMContentLoaded', init);