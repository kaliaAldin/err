// function to handle the behavior of the title 

var header = document.getElementById("headermain");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

// set up the map, retrieve the map from Flask endpoint

var map = L.map('map').setView([15.629717, 32.530528], 13);
L.tileLayer('https://sudancivicmap.com/mapbox-tiles/styles/v1/{id}/tiles/{z}/{x}/{y}', {
  maxZoom: 30,
  id: 'ahmed-isam/clhos6n5v01ml01qt6cqgcmnr',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);
// Force map to recalculate its size after initialization
var videoIcon = L.icon({
  iconUrl: "images/videoIcon.png",
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [70, 70],
  shadowSize: [70, 70],
  iconAnchor: [12, 55],
  shadowAnchor: [4, 62],
  popupAnchor: [-1, -36]
});
var storiesbutton = document.getElementById("story")
var firstVideo = L.marker([15.639717, 32.540528],{ icon: videoIcon }).bindPopup(`<iframe width="560" height="315" src="https://www.youtube.com/embed/LwOtvXB_Nwk?si=_JZL9scwMPV1Hq5t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,{className:"videos"})
var secondVideo = L.marker([15.639717 - .12, 32.540528 + .04],{ icon: videoIcon }).bindPopup(`<iframe width="560" height="315" src="https://www.youtube.com/embed/UEQPi9febBA?si=d3UiKM9h7HWm7BBP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,{className:"videos"})
var thirdVideo = L.marker([15.639717 - .08, 32.540528 + .04],{ icon: videoIcon }).bindPopup(`<iframe width="560" height="315" src="https://www.youtube.com/embed/S6LGZRqsYnk?si=fb7TOyvtf2oZjLGi" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,{className:"videos"})
var fourthVideo = L.marker([15.639717 - .01, 32.540528 + .06],{ icon: videoIcon }).bindPopup(`<iframe width="560" height="315" src="https://www.youtube.com/embed/lLzjpKwYMSw?si=s_YXw0VNwHEfOUZW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,{className:"videos"})
var fifthVideo = L.marker([15.639717 - .06, 32.540528 - .03],{ icon: videoIcon }).bindPopup(`<iframe width="560" height="315" src="https://www.youtube.com/embed/0EuxcBheteI?si=sk6Bzzv3xhHNgYf5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,{className:"videos"})
var sixthVideo = L.marker([15.639717 - .06, 32.540528- 0.09 ],{ icon: videoIcon }).bindPopup(`<<iframe width="560" height="315" src="https://www.youtube.com/embed/I_IBKcGYjlY?si=hx_KaNdbbxzG7mS5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,{className:"videos"})

var request = new XMLHttpRequest();

request.open("GET", 'https://sudancivicmap.com/data', true)
request.onreadystatechange = function () {
  if (request.readyState === XMLHttpRequest.DONE) {
    if (request.status === 200) {
      var retrived_data = JSON.parse(request.responseText);
      // Call function to handle hospital data after retrieving JSON
      hospitalInfo = handleJsonHosData(retrived_data);
      // Call function to handle Room data after retrieving JSON
      ErrInfo = handleJsonRoomData(retrived_data);
      

      // Hospitals button onclick event
var hosButton = document.getElementById("hos");
var HosDiv = document.getElementById("HosList");
var HosDetails = document.getElementById("hosDetails");
var hospitalsDisplayed = false; // Track whether hospitals are currently displayed
var hospitalDropdown = null; // Track the dropdown list


// define hospital icons in the map 
// Define hospital icons
var hosIcon1 = L.icon({
  iconUrl: "/images/hospital.png",
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [30, 30],
  shadowSize: [30, 30],
  iconAnchor: [12, 55],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});

var hosIcon2 = L.icon({
  iconUrl: "/images/hospital2.png",
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [30, 30],
  shadowSize: [30, 30],
  iconAnchor: [12, 55],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});
var ErrIcon = L.icon({
  iconUrl: "/images/ErrLogoRed-01.png",
  //shadowUrl: '/images/marker-shadow.png',
  iconSize: [50, 50],
  shadowSize: [30, 30],
  iconAnchor: [50, 50],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
})
var roomlayergroup = null
// Rooms button behaviour 
// Rooms button onclick event
var roomButton = document.getElementById("ER");
var roomDiv = document.getElementById("RoomList");
var roomDetails = document.getElementById("RoomDetails")
var mobileDisplay = document.getElementById("mobileDesplayID")
 
var RoomsDisplayed = false; // Track whether Rooms are currently displayed
var RoomDropdown = null;
storiesbutton.onclick = function(){
  
  HosDetails.innerHTML =   "" 
  roomDetails.innerHTML ="For the safety of citizens and activists, these videos do not represent actual locations"
  mobileDisplay.innerHTML= ""
  roomDetails.style.backgroundColor =  " rgb(139, 48, 145)"
  if (RoomDropdown) {
    roomDiv.removeChild(RoomDropdown);
    RoomDropdown = null;
    RoomsDisplayed = false;
  }

  if (roomlayergroup) {
    map.removeLayer(roomlayergroup);
  }

  map.eachLayer(function(layer) {
    if (layer instanceof L.Circle) {
      map.removeLayer(layer);
    }
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  if (roomlayergroup) {
    map.removeLayer(roomlayergroup);
  }
  if(hospitalsDisplayed){
    HosDiv.removeChild(hospitalDropdown);
    hospitalDropdown = null;
    hospitalsDisplayed = false;
  }
  
  firstVideo.addTo(map)
  secondVideo.addTo(map)
  thirdVideo.addTo(map)
  fourthVideo.addTo(map)
  fifthVideo.addTo(map)
  sixthVideo.addTo(map)
}

roomButton.onclick = function(){
  if (roomlayergroup) {
    map.removeLayer(roomlayergroup);
  }
  HosDetails.innerHTML =   "" 
  roomDetails.innerHTML =""
  mobileDisplay.innerHTML= ""
  if(!RoomsDisplayed){
    if(hospitalsDisplayed){
      HosDiv.removeChild(hospitalDropdown);
      hospitalDropdown = null;
      hospitalsDisplayed = false;
    }
    // Remove hospitals from the map if displayed
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    RoomDropdown = document.createElement("select"); // create a dropdown room menu
    RoomDropdown.id = "roomDropdown"; // id for the newly inserted dropdown menu
    roomDiv.appendChild(RoomDropdown); // adding the drobdwon menu to the room div

    for(var i = 0 ; i < ErrInfo.length ; i++){
      var ErrGeolocation = ErrInfo[i].geolocation;
      
       

     
        var roomColor = "wheat";
        
    if(!isNaN(ErrGeolocation[0]) && !isNaN(ErrGeolocation[1])){
      var roomOption = document.createElement("option");

        roomOption.id = "room" + i;
        roomOption.textContent = ErrInfo[i].name;
        roomOption.classList.add("RoomClasses" 
      + i);
        RoomDropdown.appendChild(roomOption);
        RoomDropdown.addEventListener('change', function() {
          var selectedIndex = RoomDropdown.selectedIndex;
          if (selectedIndex !== -1) {
            defaultZoomLevel = 14;
            
            var detailsArray = [];
            
            // Check each property and add it to the detailsArray if its value is greater than 0
            if (ErrInfo[selectedIndex].activeRooms > 0) {
              detailsArray.push(ErrInfo[selectedIndex].activeRooms + " Base ERR");
            }
            if (ErrInfo[selectedIndex].kitchens > 0) {
              detailsArray.push(ErrInfo[selectedIndex].kitchens + " Communal Kitchens");
            }
            if (ErrInfo[selectedIndex].clinic > 0) {
              detailsArray.push(ErrInfo[selectedIndex].clinic + " Clinics");
            }
            if (ErrInfo[selectedIndex].children_center > 0) {
              detailsArray.push(ErrInfo[selectedIndex].children_center + " Children Centers");
            }
            if (ErrInfo[selectedIndex].pots > 0) {
              detailsArray.push(ErrInfo[selectedIndex].pots + " Pots");
            }
            if (ErrInfo[selectedIndex].women_coop > 0) {
              detailsArray.push(ErrInfo[selectedIndex].women_coop + " Women Coops");
            }
            if (ErrInfo[selectedIndex].women_break > 0) {
              detailsArray.push(ErrInfo[selectedIndex].women_break + " Women Break Rooms");
            }
            if(ErrInfo[selectedIndex].pobulation > 0){
              detailsArray.push(" Serving pobulation of " + ErrInfo[selectedIndex].pobulation + " people " )
            }
        
            // Add the controlled area information
            detailsArray.push("<br>Area controlled by " + ErrInfo[selectedIndex].control);
        
            // Join the details and set it as innerHTML
            var roomDetailsText = detailsArray.join(", ") + "</br>";
            roomDetails.innerHTML = roomDetailsText;
            mobileDisplay.innerHTML = roomDetailsText;
            mobileDisplay.style.backgroundColor = "rgba(250, 79, 79, 0.888)";
            mobileDisplay.style.transition = "20ms";
        
            var selectedRoomGbs = ErrInfo[selectedIndex].geolocation;
            if (!isNaN(selectedRoomGbs[0]) && !isNaN(selectedRoomGbs[1])) {
              map.setView([selectedRoomGbs[0], selectedRoomGbs[1]], defaultZoomLevel);
            }
          }
        });
        

        initialRadius = 800 
        var roomCircle = L.circle([ErrGeolocation[0],ErrGeolocation[1]], {
          radius:initialRadius,
          color: roomColor,
          fillColor: roomColor,
          fillOpacity: .5,
          weight: 0,
        })
        responseRooms = roomCircle.bindPopup(ErrInfo[i].name).addTo(map);

      
        function onRoomClic() {
          if (roomlayergroup) {
            map.removeLayer(roomlayergroup);
             
          }

          
          
          
         // this.setStyle({ fillColor: 'lightblue', color: 'lightblue' })
          
          
          for (var m = 0; m < ErrInfo.length; m++) {
            
            if (ErrInfo[m].geolocation[0] == this._latlng["lat"]) {
              RoomDropdown.selectedIndex = m;
              
              var detailsArray = [];
              var roominfolayer = [];
           
              // Check each property and add it to the detailsArray if its value is greater than 0
              if (ErrInfo[m].activeRooms > 0) {
                //detailsArray.push(ErrInfo[m].activeRooms + " Base ERR");
                var baseErrPopup = L.popup ({className:"baseErrPopUp"})
                baseErrPopup.setContent(ErrInfo[m].activeRooms + " Base ERR")
                 var activeroomscircle = L.circle([ErrInfo[m].geolocation[0]+ .02,ErrInfo[m].geolocation[1] +.01], {
                  radius:400,
                  color: "rgba(246, 174, 194, 0.9)",
                  fillColor: "rgba(246, 174, 194, 0.9)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(baseErrPopup)
                activeroomscircle.on("mouseover", function(){
                  this.openPopup()
                })
               
                var activeroomline = L.polygon([
                  [ErrInfo[m].geolocation[0]+ .02,ErrInfo[m].geolocation[1] +.01],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(246, 174, 194, 0.9)',opacity: 0});
              animateLineWithRAF(activeroomline, 1);
              animateCircleWithRAF(activeroomscircle, 400, 0.8)
              roominfolayer.push(activeroomscircle,activeroomline)

              }
              if (ErrInfo[m].kitchens > 0) {
                var kitchenline = L.polygon([
                  [ErrInfo[m].geolocation[0]+ .01,ErrInfo[m].geolocation[1] +.02],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]]
                  
              ])
              var comuPooUp =L.popup({className:"comuPopUp"})
                comuPooUp.setContent(ErrInfo[m].kitchens + " Communal Kitchens")
              kitchenline.setStyle({color:"rgba(254, 225, 199, 0.904)" , opacity:1 , weight: 5})
                var kitchencircle = L.circle([ErrInfo[m].geolocation[0]+ .01,ErrInfo[m].geolocation[1] +.02], {
                  radius:400,
                  color: "rgba(254, 225, 199, 0.904)",
                  fillColor: "rgba(254, 225, 199, 0.904)",
                  fillOpacity: 0,
                  weight: 0,
                }).bindPopup( comuPooUp)
                kitchencircle.on("mouseover" , function(){
          
                  this.openPopup()
             
                  
                })
                animateLineWithRAF(kitchenline, 1);
               animateCircleWithRAF(kitchencircle, 400, 0.8)
                
                //detailsArray.push(ErrInfo[m].kitchens + " Communal Kitchens");
                roominfolayer.push(kitchencircle,kitchenline)
              }
              if (ErrInfo[m].clinic > 0) {
                //detailsArray.push(ErrInfo[m].clinic + " Clinics");
                var clinicPopUp =L.popup({className:"clinicPopUp"})
                clinicPopUp.setContent(ErrInfo[m].clinic + " Clinics")
                var cliniccircle = L.circle([ErrInfo[m].geolocation[0]- .01,ErrInfo[m].geolocation[1] +.01], {
                  radius:400,
                  color: "rgba(210, 127, 216, 1)",
                  fillColor: "rgba(210, 127, 216, 1)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(clinicPopUp)
                cliniccircle.on("mouseover", function(){
                  this.openPopup()
                })
               
                var clinicline = L.polygon([
                  [ErrInfo[m].geolocation[0]- .01,ErrInfo[m].geolocation[1] +.01],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(210, 127, 216, 1)',opacity: 0});
              animateLineWithRAF(clinicline, 1);
              animateCircleWithRAF(cliniccircle, 400, 0.8)
              roominfolayer.push(cliniccircle,clinicline)
              }

              if (ErrInfo[m].children_center > 0) {
                //detailsArray.push(ErrInfo[m].children_center + " Children Centers");
                var ChildrenCenterPopUp =L.popup({className:"childrenCenterPopUp"})
                ChildrenCenterPopUp.setContent(ErrInfo[m].children_center + " Children Centers")
                var childrencentercircle = L.circle([ErrInfo[m].geolocation[0]- .01,ErrInfo[m].geolocation[1] -.01], {
                  radius:400,
                  color: "rgba(245, 217, 146, 0.9)",
                  fillColor: " rgba( 245, 217, 146, 0.9)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(ChildrenCenterPopUp)
                childrencentercircle.on("mouseover" , function(){
                  this.openPopup()
                })
               
                var childrenCenterLine = L.polygon([
                  [ErrInfo[m].geolocation[0]- .01,ErrInfo[m].geolocation[1] -.01],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(226, 210, 169, 0.9)',opacity: 0});
              animateLineWithRAF(childrenCenterLine, 1);
              animateCircleWithRAF(childrencentercircle, 400, 0.8)
              roominfolayer.push(childrencentercircle,childrenCenterLine)
              }
              if (ErrInfo[m].pots > 0) {
                //detailsArray.push(ErrInfo[m].pots + " Pots");
                var potsPopUp =L.popup( {className: "potsClass"})
                potsPopUp.setContent("<div>" +ErrInfo[m].pots + " Pots </div>" )
                
                var potscircle = L.circle([ErrInfo[m].geolocation[0]+.02,ErrInfo[m].geolocation[1] -.01], {
                  radius:400,
                  color: "rgba(250, 126, 97, 0.904)",
                  fillColor: "rgba(250, 126, 97, 0.904)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(potsPopUp)
                potscircle.on("mouseover", function(){
                  this.openPopup()
                })
               
                var potsLine = L.polygon([
                  [ErrInfo[m].geolocation[0]+ .02,ErrInfo[m].geolocation[1] -.01],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(250, 126, 97, 0.904)',opacity: 0});
              animateLineWithRAF(potsLine, 1);
              animateCircleWithRAF(potscircle, 400, 0.8)
              roominfolayer.push(potscircle,potsLine)
              }
              if (ErrInfo[m].women_coop > 0) {
                var women_coopPopup = L.popup({className:"womenCoopPopup"})
                women_coopPopup.setContent(ErrInfo[m].women_coop + " Women Coops")
                womenCoopCircle = L.circle([ErrInfo[m].geolocation[0] +.01 ,ErrInfo[m].geolocation[1] -.02],{
                  radius:400,
                  color: "rgba(62, 84, 207, 0.9)",
                  fillColor: "rgba(62, 84, 207, 0.9)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(women_coopPopup)
                womenCoopCircle.on("mouseover" , function(){
                  this.openPopup()
                })
                womenCoopLine = L.polygon([
                  [ErrInfo[m].geolocation[0] +.01 ,ErrInfo[m].geolocation[1] -.02],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(62, 84, 207, 0.9)',opacity: 0});
               animateLineWithRAF(womenCoopLine,1)
                animateCircleWithRAF(womenCoopCircle, 400, 0.8)
                roominfolayer.push(womenCoopCircle , womenCoopLine)
                

                //detailsArray.push( "<br>" +ErrInfo[m].women_coop + " Women Coops");
              }
              if (ErrInfo[m].women_break > 0) {
                //detailsArray.push(ErrInfo[m].women_break + " Women Break Rooms");
                var women_BreakPopup = L.popup({className:"womenBreakPopup"})
                women_BreakPopup.setContent(ErrInfo[m].women_break + " Women Break Rooms")
                womenBreakCircle = L.circle([ErrInfo[m].geolocation[0] -.005 ,ErrInfo[m].geolocation[1] -.02],{
                  radius:400,
                  color: "rgba(75, 205, 241, 0.9)",
                  fillColor: "rgba(75, 205, 241, 0.9)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(women_BreakPopup)
                womenBreakCircle.on("mouseover" , function(){
                  this.openPopup()
                })
                womenBreakLine = L.polygon([
                  [ErrInfo[m].geolocation[0] -.005 ,ErrInfo[m].geolocation[1] -.02],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(75, 205, 241, 0.9)',opacity: 0});
                animateLineWithRAF(womenBreakLine,1)
                animateCircleWithRAF(womenBreakCircle, 400, 0.8)
                roominfolayer.push(womenBreakCircle , womenBreakLine)
              }
              if(ErrInfo[m].pobulation > 0){
                var pobulationRadius = ErrInfo[m].pobulation/10
                if (pobulationRadius > 2000){
                  pobulationRadius = 2000
                } 
                //detailsArray.push( " serving pobulation of " +ErrInfo[m].pobulation + " people") 
                var PobulationPopup = L.popup({className:"pobulationPopup"})
                PobulationPopup.setContent("Serving pobulation of " +ErrInfo[m].pobulation + " people")
               pobulationCircle = L.circle([ErrInfo[m].geolocation[0] -.03 ,ErrInfo[m].geolocation[1] -.005],{
                  radius:400,
                  color: "rgba(104, 172, 103, 0.9)",
                  fillColor: "rgba(104, 172, 103, 0.9)",
                  
                  weight: 0,
                }).setStyle({ fillOpacity: 0 }).bindPopup(PobulationPopup)
                pobulationCircle.on("mouseover" , function(){
                  this.openPopup()
                })
                pobulationLine = L.polygon([
                  [ErrInfo[m].geolocation[0] -.03 ,ErrInfo[m].geolocation[1] -.005],
                  [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
                  
              ]).setStyle({color: 'rgba(104, 172, 103, 1)',opacity: 0});
                animateLineWithRAF(pobulationLine,1)
                animateCircleWithRAF(pobulationCircle, pobulationRadius, 0.8)
                roominfolayer.push(pobulationCircle , pobulationLine)
              }
              var roomImageUrl = ErrInfo[m].roomPhoto
              var alttext = ErrInfo[m].name +' Emergency  room activity '
              var roomImglatlng = L.latLngBounds([
                [ErrInfo[m].geolocation[0] +.08 ,ErrInfo[m].geolocation[1] + 0.09], // Southwest corner
                [ErrInfo[m].geolocation[0] +.03,ErrInfo[m].geolocation[1]+0.03] // Northeast corner
            ]);
              var imageOverlay = L.imageOverlay(roomImageUrl, roomImglatlng, {
                opacity: 0.8,
                
                alt: alttext,
                className: "imageFrame",
                interactive: true
            })
            var Photoline = L.polygon([
             [ ErrInfo[m].geolocation[0] +.03,ErrInfo[m].geolocation[1]+0.03],
              [ErrInfo[m].geolocation[0],ErrInfo[m].geolocation[1]],
              
          ]).setStyle({color: ' rgb(76, 30, 79, 1) ',opacity: 1 , weight:3});
            roominfolayer.push(imageOverlay , Photoline)
              roomlayergroup =L.featureGroup(roominfolayer)
             

              roomlayergroup.openPopup().addTo(map)
              
              // Add the controlled area information
              detailsArray.push(ErrInfo[m].roomDiscription)
              detailsArray.push("<br>Area controlled by " + ErrInfo[m].control);
        
              // Join the details and set it as innerHTML
              var roomDetailsTextClick = detailsArray.join(", ") + "</br>";
              roomDetails.innerHTML = roomDetailsTextClick;
              mobileDisplay.innerHTML = roomDetailsTextClick;
              mobileDisplay.style.backgroundColor = "rgba(250, 79, 79, 0.888)";
        
              map.setView(this._latlng, 13.4);
            }
          }
        }
         
            function mouseOver(){ this.setStyle({ fillColor: 'lightblue', color: 'lightblue' });
            this.setRadius(initialRadius * 2 )
            this.openPopup()
            roomDetails.style.backgroundColor = "rgba(169, 229, 249, 0.5)"
            roomDetails.style.color = "black"
            }

            function mouseOut(){this.setStyle({ fillColor: 'wheat', color: 'wheat' });
            this.setRadius(initialRadius )
           
            roomDetails.style.backgroundColor = "rgba(250, 79, 79, 0.888)"
            roomDetails.style.color = "Black" } 

            responseRooms.on("mouseover" , mouseOver)
            responseRooms.on("mouseout" , mouseOut)
            responseRooms.on('click' , onRoomClic )
            responseRooms.on('touchstart',onRoomClic)
           

        }
        else {
      console.error("Invalid GeoLocation data for room: " + RoomsNameType[i].RoomName);}
    }
    RoomsDisplayed = true;
  }
 else{ map.eachLayer(function(layer) {
  if (layer instanceof L.Circle) {
    map.removeLayer(layer);
  }
  
});

// Remove the dropdown menu
if (RoomDropdown) {
  roomDiv.removeChild(RoomDropdown);
  
  RoomDropdown = null; // Reset the dropdown variable
}

RoomsDisplayed = false;
defaultZoomLevel = 13;
map.setView([15.609706, 32.530528], defaultZoomLevel);}

}

//// hospital button and behavior 

hosButton.onclick = function(){
  if (roomlayergroup) {
    map.removeLayer(roomlayergroup);
  }
  //First remove any text details from the page
  HosDetails.innerHTML =   "" 
  roomDetails.innerHTML =""
  mobileDisplay.innerHTML= ""

  if(!hospitalsDisplayed){
    // Remove rooms dropdown if it's currently displayed
    if (RoomDropdown) {
      roomDiv.removeChild(RoomDropdown);
      RoomDropdown = null;
      RoomsDisplayed = false;
    }

    // Remove rooms from the map if displayed
    map.eachLayer(function(layer) {
      if (layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    // Display hospitals as a dropdown list
  hospitalDropdown = document.createElement("select");
  hospitalDropdown.id = "hospitalDropdown";
  HosDiv.appendChild(hospitalDropdown);
  for (var i = 0; i < hospitalInfo.length; i++) {
    var Gbs = hospitalInfo[i].geolocation;
    var status = hospitalInfo[i].HospitalStatus;
    

    var Pinicon;
    var statusStatment;

    if (status === "Operational") {
      Pinicon = hosIcon1;
      statusStatment = " hospital is operating \nالمستشفي في الخدمة  ";
    } else {
      Pinicon = hosIcon2;
      statusStatment = " hospital is out of service المستشفي خارج الخدمة ";
    }

    // Check if both latitude and longitude are valid numbers
    if (!isNaN(Gbs[0]) && !isNaN(Gbs[1])) {
      var marker = new L.marker([Gbs[0], Gbs[1]], { icon: Pinicon })
        .bindPopup(hospitalInfo[i].name + statusStatment)
        .addTo(map);
        marker.on("click",function (){
          for(var m = 0 ; m < hospitalInfo.length ; m++){
            if (hospitalInfo[m].geolocation[0] == this._latlng["lat"]){
              hospitalDropdown.selectedIndex = m 
             var  hosDetailsTextOnclick =   " Hospital is " 
              + hospitalInfo[m].HospitalStatus + " </br> located in " 
              + String(hospitalInfo[m].district)+  
              "</br>The area  probably controlled by " + hospitalInfo [m].controlled;
              HosDetails.innerHTML = hosDetailsTextOnclick
              mobileDisplay.innerHTML = hosDetailsTextOnclick
            mobileDisplay.style.backgroundColor = "rgba(91, 89, 229, 0.904)"

              
          }
          }
          
          map.setView(this._latlng, 13);
          this.openPopup()
        
        })
        marker.on("mouseover" , function(){
          
          this.openPopup()
     
          
        })
        

      // Create an option element for each hospital
      var option = document.createElement("option");
      //option.value = hosNameGbs[i].name;
      option.id = "hos" + i;
      option.textContent = hospitalInfo[i].name;
      option.classList.add("hosClasses");
      hospitalDropdown.appendChild(option);

      if (status !== "Operational") {
        option.style.backgroundColor = "red"; // Set background color to red for non-operational hospitals
      }
    } else {
      console.error("Invalid Gbs values at index " + i + ": " + Gbs);
    }
  }
  hospitalsDisplayed = true
} else {
  if(hospitalsDisplayed){
    HosDiv.removeChild(hospitalDropdown)
    hospitalDropdown = null;
    hospitalsDisplayed = false;
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
  }
}
hospitalDropdown.addEventListener('change', function() {
  var selectedIndex = hospitalDropdown.selectedIndex;
  
 
  if (selectedIndex !== -1) {
    defaultZoomLevel = 13;
    //0Details.innerHTML = ""; // Clearing the Details div
    //roomButton.innerHTML = ""; //clearing room button
    hosDetailsText =   " Hospital is " 
    + hospitalInfo[selectedIndex].HospitalStatus + " </br> located in " 
    + String(hospitalInfo[selectedIndex].district)+  
    "</br>The area  probably controlled by " + hospitalInfo [selectedIndex].controlled;
    HosDetails.innerHTML = hosDetailsText
    mobileDisplay.innerHTML = HosDetails.innerHTML
    mobileDisplay.style.backgroundColor = "rgba(91, 89, 229, 0.904)"
    mobileDisplay.style.transition = "20ms"    
      
  
  
    
    var selectedGbs = hospitalInfo[selectedIndex].geolocation;
    if (!isNaN(selectedGbs[0]) && !isNaN(selectedGbs[1])) {
      map.setView([selectedGbs[0], selectedGbs[1]], defaultZoomLevel);
    }
  }
});

}


    } else {
      console.error("Error fetching data:", request.status);
    }
  }


};

request.send();

// function to handle the hospital data parsed from JSON and turned it to array
function handleJsonHosData(data) {
  var hospitalInfo = [];

  for (var i = 0; i < data.Hospitals.length; i++) {
    var name = data.Hospitals[i].name;
    var gelocation = data.Hospitals[i].GPS_Location.toString();
    var district = data.Hospitals[i].District;
    var controlled = data.Hospitals[i].Controlled_By;
    var status = data.Hospitals[i].Status;
    
   

    // turning geolocation strings to array of floats
    var geolocationArray = gelocation.split(',').map(function (item) {
      return parseFloat(item.trim()); // Trim any whitespace around the numbers
    });

    // Check if geolocationArray contains valid coordinates
    if (geolocationArray.length === 2 && !isNaN(geolocationArray[0]) && !isNaN(geolocationArray[1])) {
      hospitalInfo.push({ name: name, geolocation: geolocationArray, HospitalStatus: status, district: district, controlled: controlled });
    } else {
      console.error("Invalid GPSLocation data for hospital: " + name);
    }
  }
  return hospitalInfo;
}

// function to handle the Emergency response rooms data

function handleJsonRoomData(data){
  resultArray = [];
  for(var i = 0 ; i < data.BaseERR.length;i++){

    var servedPobulation = data.BaseERR[i].ServedPopulation;
    var name = data.BaseERR[i].baseerr;
    var roomLocation = data.BaseERR[i].geolocation;
    var activeRooms =  data.BaseERR[i].rooms;
    var kitchens = data.BaseERR[i].kitchens;
    var district = data.BaseERR[i].district;
    var control = data.BaseERR[i].controlledby;
    var pots = data.BaseERR[i].pots;
    var health_clinic = data.BaseERR[i].clinics;
    var children_center = data.BaseERR[i].childrencenters;
    var women_coop = data.BaseERR[i].womencoops;
    var women_break = data.BaseERR[i].womenrestrooms;
    var roomArabic = data.BaseERR[i].ArabicName
    var roomDiscreption = data.BaseERR[i].Discription
    var photo = data.BaseERR[i].photos

    var geolocationArray = roomLocation.split(',').map(function (item) {
      return parseFloat(item.trim()); // Trim any whitespace around the numbers
    });

    // Check if geolocationArray contains valid coordinates
    if (geolocationArray.length === 2 && !isNaN(geolocationArray[0]) && !isNaN(geolocationArray[1])) {
      resultArray.push({ name: name, geolocation: geolocationArray, activeRooms:activeRooms, district: district, control: control, kitchens:kitchens , 
        pots: pots , clinic: health_clinic,children_center: children_center, women_coop: women_coop , women_break: women_break , pobulation:servedPobulation ,
        roomArabicName:roomArabic , roomDiscription:roomDiscreption   , roomPhoto:photo
      });
    } else {
      console.error("Invalid GPSLocation data for hospital: " + name);
    }
 }
 return resultArray
}
function animateCircleWithRAF(circle, targetRadius, targetOpacity, duration = 700) {
  const startTime = performance.now();
  const initialRadius = 0;
  const initialOpacity = 0;

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Normalize progress (0 to 1)

    const currentRadius = initialRadius + progress * targetRadius;
    const currentOpacity = initialOpacity + progress * targetOpacity;

    circle.setStyle({ fillOpacity: currentOpacity });
    circle.setRadius(currentRadius);

    if (progress < 1) {
      requestAnimationFrame(step); // Continue animation
    }
  }

  requestAnimationFrame(step);
}

// Animation function for lines using requestAnimationFrame
function animateLineWithRAF(line, targetOpacity, duration = 2000) {
  const startTime = performance.now();
  const initialOpacity = 0;

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Normalize progress (0 to 1)

    const currentOpacity = initialOpacity + progress * targetOpacity;

    line.setStyle({ opacity: currentOpacity });

    if (progress < 1) {
      requestAnimationFrame(step); // Continue animation
    }
  }

  requestAnimationFrame(step);
}
var  intro  = document.getElementById("intro")
var  mapStoryButton = document.getElementById("mapStory")
var container =  document.getElementById("container")
function displayMap(){
  if (mapStoryButton.innerHTML == "Map"){
  mapStoryButton.innerHTML =  mapStoryButton.innerHTML.replace("Map", "Story")
  intro.style.display ="none"
  container.style.display = "flex";
  setTimeout(() => {
    map.invalidateSize();
  }, 100);}
  else{
    mapStoryButton.innerHTML =  mapStoryButton.innerHTML.replace("Story", "Map")
   container.style.display = "none"
   intro.style.display ="block"
  }
}
