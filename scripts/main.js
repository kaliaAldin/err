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

var map = L.map('map').setView([15.629717, 32.530528], 12);

L.tileLayer('http://localhost:5000/mapbox-tiles/styles/v1/{id}/tiles/{z}/{x}/{y}', {
  maxZoom: 30,
  id: 'ahmed-isam/clhos6n5v01ml01qt6cqgcmnr',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

var request = new XMLHttpRequest();

request.open("GET", 'http://localhost:5000/data', true)
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
// Rooms button behaviour 
// Rooms button onclick event
var roomButton = document.getElementById("ER");
var roomDiv = document.getElementById("RoomList");
var roomDetails = document.getElementById("RoomDetails")
var RoomsDisplayed = false; // Track whether Rooms are currently displayed
var RoomDropdown = null;

roomButton.onclick = function(){
  HosDetails.innerHTML =   "" 
  roomDetails.innerHTML =""
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
      var ErrroomNum = ErrInfo[i].activeRooms;
      var ErrName = ErrInfo[i].name;
      var ErrDistrict = ErrInfo[i].district;
       

     
        roomColor = "red";
        
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
            defaultZoomLevel= 13;
            roomDetails.innerHTML = " Emergency Response Base is located " + ErrInfo[selectedIndex].district 
            + "</br> With "  + ErrInfo[selectedIndex].activeRooms + " active Rooms"
            +" and " + ErrInfo[selectedIndex].kitchens + " Kitchens " 
            + "</br> Area probably controlled by " + ErrInfo[selectedIndex].control
             
            var selectedRoomGbs = ErrInfo[selectedIndex].geolocation;
            if (!isNaN(selectedRoomGbs[0]) && !isNaN(selectedRoomGbs[1])) {
              map.setView([selectedRoomGbs[0], selectedRoomGbs[1]], defaultZoomLevel);
              //var roommarker = new L.marker([selectedRoomGbs[0], selectedRoomGbs[1]], { icon: ErrIcon }).addTo(map);
            }
          }
        });


        var roomCircle = L.circle([ErrGeolocation[0],ErrGeolocation[1]], {
          radius:800,
          color: roomColor,
          fillColor: roomColor,
          fillOpacity: .5,
          weight: 0
        })
        responseRooms = roomCircle.bindPopup(ErrInfo[i].name).addTo(map);
        responseRooms.on("mouseover", function(){
          
         
          overlayCircle = L.circle(this._latlng, {
            radius:1200,
            color: "blue",
            fillColor: "blue",
            fillOpacity: .5,
            weight: 0
          }).bindPopup(this._popup._content).addTo(map)

          
          overlayCircle.on("mouseout",function(){
            map.removeLayer(overlayCircle)
            
          })
          overlayCircle.on('click' ,  function() { 
            
        
        
            for(var m = 0 ; m < ErrInfo.length ; m++){
              if (ErrInfo[m].geolocation[0] == this._latlng["lat"]){
                RoomDropdown.selectedIndex = m 
                
                roomDetails.innerHTML = " Emergency Response Base is located " + ErrInfo[m].district 
                + "</br> With "  + ErrInfo[m].activeRooms + " active Rooms"
                +" and " + ErrInfo[m].kitchens + " Kitchens " 
                + "</br> Area probably controlled by " + ErrInfo[m].control
                
            }
            }
            
            
            map.setView(this._latlng, 13);
            } ).openPopup()    
        })
        }else {
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
map.setView([15.609705, 32.530528], defaultZoomLevel);}

}

//// hospital button and behavior 

hosButton.onclick = function(){
  //First remove any text details from the page
  HosDetails.innerHTML =   "" 
  roomDetails.innerHTML =""
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
              HosDetails.innerHTML =   " Hospital is " 
              + hospitalInfo[m].HospitalStatus + " </br> located in " 
              + String(hospitalInfo[m].district)+  
              "</br>The area  probably controlled by " + hospitalInfo [m].controlled;
              
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
    HosDetails.innerHTML =   " Hospital is " 
    + hospitalInfo[selectedIndex].HospitalStatus + " </br> located in " 
    + String(hospitalInfo[selectedIndex].district)+  
    "</br>The area  probably controlled by " + hospitalInfo [selectedIndex].controlled;
      
  
  
    
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

    var name = data.BaseERR[i].baseerr;
    var roomLocation = data.BaseERR[i].geolocation;
    var activeRooms =  data.BaseERR[i].rooms;
    var kitchens = data.BaseERR[i].kitchens;
    var district = data.BaseERR[i].district;
    var control = data.BaseERR[i].controlledby;

    var geolocationArray = roomLocation.split(',').map(function (item) {
      return parseFloat(item.trim()); // Trim any whitespace around the numbers
    });

    // Check if geolocationArray contains valid coordinates
    if (geolocationArray.length === 2 && !isNaN(geolocationArray[0]) && !isNaN(geolocationArray[1])) {
      resultArray.push({ name: name, geolocation: geolocationArray, activeRooms:activeRooms, district: district, control: control, kitchens:kitchens });
    } else {
      console.error("Invalid GPSLocation data for hospital: " + name);
    }
 }
 return resultArray
}
