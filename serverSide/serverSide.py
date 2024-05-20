
import os
from flask import Flask, jsonify
from flask_cors import CORS
import requests
import json
from functools import lru_cache
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

json_object = {}

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SAMPLE_SPREADSHEET_ID = "16KMfaaFco92BFtoiUEzbbBy0OMSFVNPbj3sDPrSHgpg"
SAMPLE_RANGE_NAME_Hos = "Hospitals!A2:L18"
SAMPLE_RANGE_NAME_Room = "BaseERR!A2:S60"

app = Flask(__name__)
CORS(app)

MAPBOX_ACCESS_TOKEN = os.getenv('MAPBOX_ACCESS_TOKEN')

@lru_cache(maxsize=128)
@app.route('/mapbox-tiles/styles/v1/<path:path>')
def mapbox_tiles_proxy(path):
    mapbox_url = f'https://api.mapbox.com/styles/v1/{path}'
    mapbox_url_with_token = f'{mapbox_url}?access_token={MAPBOX_ACCESS_TOKEN}'

    response = requests.get(mapbox_url_with_token)
    if response.ok:
        return response.content, response.status_code
    else:
        return jsonify({'error': 'Failed to fetch map tile'}), response.status_code

@app.route('/data')
def retrieve_data():
    data_url = "sample.json"
    try:
        with open(data_url) as dataobject:
            data = json.load(dataobject)
            return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Data file not found'}), 404
    except json.JSONDecodeError as e:
        return jsonify({'error': 'Invalid JSON format'}), 500
    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500

def extractHosRoomsInfo():
    creds = Credentials.from_service_account_file(
        os.getenv('GOOGLE_APPLICATION_CREDENTIALS'), scopes=SCOPES
    )

    try:
        service = build("sheets", "v4", credentials=creds)
        sheet = service.spreadsheets()

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

        valuesHos = resultHos.get("values", {})
        if not valuesHos:
            print("No data found.")
            return
        hospitalArray = []
        for row in valuesHos:
            Hospitalsdic = {}
            try:
                Hospitalsdic["name"] = row[0]
                Hospitalsdic["District"] = row[1]
                Hospitalsdic["Status"] = row[2]
                Hospitalsdic["ERR"] = row[3]
                Hospitalsdic["Patners"] = row[4]
                Hospitalsdic["GPS_Location"] = row[5]
                Hospitalsdic["Controlled_By"] = row[6]
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
        roomArray = []
        for row in valuesRooms:
            Roomsdic = {}
            try:
                Roomsdic["no"] = row[0]
                Roomsdic["baseerr"] = row[1]
                Roomsdic["district"] = row[2]
                Roomsdic["region"] = row[3]
                Roomsdic["rooms"] = row[4]
                Roomsdic["hosptials"] = row[5]
                Roomsdic["clinics"] = row[6]
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

    json_object["BaseERR"] = roomArray
    json_object["Hospitals"] = hospitalArray

    with open("sample.json", "w") as DataFile:
        json.dump(json_object, DataFile)

extractHosRoomsInfo()