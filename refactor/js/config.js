// Auto-refactor from main.js (config + constants only)
// Edit this file per-project.

export const MAP_CONFIG = {
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


export const ICONS = {
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

export const VIDEO_MARKERS = [
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

// API endpoints (edit for your deployment)
export const API = {
  liveData: 'https://sudancivicmap.com/data',
  history: 'https://sudancivicmap.com/history',
  manifest: 'https://sudancivicmap.com/history/manifest',
};
