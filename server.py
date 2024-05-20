from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
import requests
import os.path
import json
from functools import lru_cache

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

json_object = {}

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = "16KMfaaFco92BFtoiUEzbbBy0OMSFVNPbj3sDPrSHgpg"
SAMPLE_RANGE_NAME_Hos = "Hospitals!A2:L18"
SAMPLE_RANGE_NAME_Room = "BaseERR!A2:S60"

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins on all routes

# Mapbox access token
#access tocken
MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWhtZWQtaXNhbSIsImEiOiJjbHcyMjVmYTkwaDBhMm1sY3E0cG4wczl2In0.QXRFHvDqdpXEfp8UJAPhmQ'

# Endpoint to proxy Mapbox requests
@lru_cache(maxsize=128)
@app.route('/mapbox-tiles/styles/v1/<path:path>')
def mapbox_tiles_proxy(path):
    mapbox_url = f'https://api.mapbox.com/styles/v1/{path}'
    mapbox_url_with_token = f'{mapbox_url}?access_token={MAPBOX_ACCESS_TOKEN}'

   

    # Send the request to the Mapbox API
    response = requests.get(mapbox_url_with_token)

    # Check if the request was successful
    if response.ok:
        # If successful, return the tile content and status code
        return response.content, response.status_code
    else:
        # If unsuccessful, return an error response
        return jsonify({'error': 'Failed to fetch map tile'}), response.status_code

@app.route('/data')

def retrieve_data():
    data_url = "sample.json"
    with open(data_url) as dataobject:
       data = json.load(dataobject)
       return data
    
def extractHosRoomsInfo():
 
  creds = None

  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentialERR.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    service = build("sheets", "v4", credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    
    #read the hospital sheet 
    resultHos = (
        sheet.values()
        .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME_Hos)
        .execute()
    )
    resultRooms = (
        sheet.values()
        .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME_Room)
        .execute()
    )

    #getting hospital values and Insert them in dict then array for json 
    valuesHos = resultHos.get("values", {})
    if not valuesHos:
      print("No data found.")
      return
    hospitalArray= []
    for row in valuesHos:
      # Print columns A and E, which correspond to indices 0 and 4.
        Hospitalsdic = {}
        
        try:

            Hospitalsdic["name"] = row[0]
            Hospitalsdic["District"] = row[1]
            Hospitalsdic["Status"] = row[2]
            Hospitalsdic["ERR"] = row[3]
            Hospitalsdic["Patners"] = row[4]
            Hospitalsdic["GPS_Location"] = row[5]
            Hospitalsdic["Controlled_By"]  = row[6]
            Hospitalsdic["Daily_Cases"] = row[7]
            Hospitalsdic["Notes"] = row[11]
            
        except IndexError:
            print("one of the rows is empty check google sheet")
            pass
        hospitalArray.append(Hospitalsdic)
    
    
    valuesRooms = resultRooms.get("values", {})

    if not valuesRooms:
      print("No data found.")
      return
    roomArray= []
    for row in valuesRooms:
      # Print columns A and E, which correspond to indices 0 and 4.
        Roomsdic = {}
        
        try:

            Roomsdic["no"] = row[0]
            Roomsdic["baseerr"] = row[1]
            Roomsdic["district"] = row[2]
            Roomsdic["region"] = row[3]
            Roomsdic["rooms"] = row[4]
            Roomsdic["hosptials"] = row[5]
            Roomsdic["clinics"]  = row[6]
            Roomsdic["evacuationcenters"] = row[7]
            Roomsdic["kitchens"] = row[8]
            Roomsdic["pots"] = row[9]
            Roomsdic["childrencenters"] = row[10]
            Roomsdic["womenrestrooms"] = row[11]
            Roomsdic["womencoops"] = row[12]
            Roomsdic["geolocation"] = row[16]
            Roomsdic["controlledby"] = row[17]

            

            
        except IndexError:
            print("one of the rows is empty check google sheet")
            pass
        roomArray.append(Roomsdic)
      
  except HttpError as err:
    print(err)
  json_object ["BaseERR"] =  roomArray
  json_object ["Hospitals"] = hospitalArray

  with open ("sample.json","w") as DataFile:
    json.dump(json_object , DataFile)
   

if __name__ == '__main__':
    
    extractHosRoomsInfo()
    app.run()
