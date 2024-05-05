from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
import requests
import os.path
import json

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
SAMPLE_RANGE_NAME_Room = "BaseERR!A2:S44"

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins on all routes

# Mapbox access token
#access tocken
MAPBOX_ACCESS_TOKEN = ''

# Endpoint to proxy Mapbox requests
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
    data_url = "http://localhost:5000/sample.json"
    response = requests.get(data_url)
    if response.ok:
        # If successful, return the data content and status code
        return response.content, response.status_code
    else:
        # If unsuccessful, return an error response
        return jsonify({'error': 'Failed to fetch data'}), response.status_code


def extractHosInfo():
  """Shows basic usage of the Sheets API.
  Prints values from a sample spreadsheet.
  """
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials2.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    service = build("sheets", "v4", credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = (
        sheet.values()
        .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME_Hos)
        .execute()
    )
    values = result.get("values", {})

    if not values:
      print("No data found.")
      return
    hospitalArray= []
    for row in values:
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
            pass
        hospitalArray.append(Hospitalsdic)
    
  
    
      
    
  except HttpError as err:
    print(err)
  return hospitalArray
def extractROOMInfo():
  """Shows basic usage of the Sheets API.
  Prints values from a sample spreadsheet.
  """
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials2.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    service = build("sheets", "v4", credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = (
        sheet.values()
        .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME_Room)
        .execute()
    )
    values = result.get("values", {})

    if not values:
      print("No data found.")
      return
    roomArray= []
    for row in values:
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
            pass
        roomArray.append(Roomsdic)
    
  

    
      
   
  except HttpError as err:
    print(err)
  return  roomArray

rooms = extractROOMInfo()
hospitals = extractHosInfo()
json_object["Hospitals"] = hospitals
json_object ["BaseERR"] = rooms
with open ("sample.json","w") as DataFile:
   json.dump(json_object , DataFile)
   

if __name__ == '__main__':
    

    app.run()
