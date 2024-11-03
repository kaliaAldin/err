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

L.tileLayer('https://sudancivicmap.com/mapbox-tiles/styles/v1/{id}/tiles/{z}/{x}/{y}', {
  maxZoom: 30,
  id: 'ahmed-isam/clhos6n5v01ml01qt6cqgcmnr',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

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
// Rooms button behaviour 
// Rooms button onclick event
var roomButton = document.getElementById("ER");
var roomDiv = document.getElementById("RoomList");
var roomDetails = document.getElementById("RoomDetails")
var mobileDisplay = document.getElementById("mobileDesplayID")
 
var RoomsDisplayed = false; // Track whether Rooms are currently displayed
var RoomDropdown = null;

roomButton.onclick = function(){
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
            defaultZoomLevel = 13;
            
            var detailsArray = [];
            
            // Check each property and add it to the detailsArray if its value is greater than 0
            if (ErrInfo[selectedIndex].activeRooms > 0) {
              detailsArray.push(ErrInfo[selectedIndex].activeRooms + " Base ERR");
            }
            if (ErrInfo[selectedIndex].kitchens > 0) {
              detailsArray.push(ErrInfo[selectedIndex].kitchens + " Communal Kitchens");
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
        
            // Add the controlled area information
            detailsArray.push("Area controlled by " + ErrInfo[selectedIndex].control);
        
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

            for(var m = 0 ; m < ErrInfo.length ; m++){
              if (ErrInfo[m].geolocation[0] == this._latlng["lat"]){
                RoomDropdown.selectedIndex = m 
                
                var roomDetailsTextClick = ErrInfo[m].activeRooms + " Base ERR" + " with " + ErrInfo[m].kitchens + " Communal Kitchens, "
                + ErrInfo[m].children_center + " Children Centers," + ErrInfo[m].pots + " Pots, " +  ErrInfo[m].women_coop + " Women coops, "
                + ErrInfo[m].women_break + " Women break rooms"
               +"</br> Area  controlled by " + ErrInfo[m].control
                roomDetails.innerHTML = roomDetailsTextClick
                mobileDisplay.innerHTML = roomDetailsTextClick
                mobileDisplay.style.backgroundColor = "rgba(250, 79, 79, 0.888)"
              

                
            }
            }
      
            map.setView(this._latlng, 13);
            } 
            function mouseOver(){ this.setStyle({ fillColor: 'lightblue', color: 'lightblue' });
            this.setRadius(initialRadius * 2 )
            this.openPopup()
            roomDetails.style.backgroundColor = "lightblue"
            roomDetails.style.color = "black"
            }

            function mouseOut(){this.setStyle({ fillColor: 'red', color: 'red' });
            this.setRadius(initialRadius )
            this.closePopup()
            roomDetails.style.backgroundColor = "rgba(250, 79, 79, 0.888)"
            roomDetails.style.color = "white"


            

            }
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
map.setView([15.609705, 32.530528], defaultZoomLevel);}

}

//// hospital button and behavior 

hosButton.onclick = function(){
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

    var geolocationArray = roomLocation.split(',').map(function (item) {
      return parseFloat(item.trim()); // Trim any whitespace around the numbers
    });

    // Check if geolocationArray contains valid coordinates
    if (geolocationArray.length === 2 && !isNaN(geolocationArray[0]) && !isNaN(geolocationArray[1])) {
      resultArray.push({ name: name, geolocation: geolocationArray, activeRooms:activeRooms, district: district, control: control, kitchens:kitchens , pots: pots , clinic: health_clinic,
        children_center: children_center, women_coop: women_coop , women_break: women_break    
      });
    } else {
      console.error("Invalid GPSLocation data for hospital: " + name);
    }
 }
 return resultArray
}
