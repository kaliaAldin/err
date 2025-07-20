import os
import glob
import json
import re
import shutil
from datetime import datetime, timezone as dt_timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
import requests
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from apscheduler.schedulers.background import BackgroundScheduler

# Configuration
SCHEDULER_TIMEZONE = 'UTC'
HISTORY_DIR = 'history'
MANIFEST_PATH = os.path.join(HISTORY_DIR, 'manifest.json')
CACHE_DIR = 'cache-directory'
SAMPLE_JSON = 'sample.json'
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SHEET_ID = "16KMfaaFco92BFtoiUEzbbBy0OMSFVNPbj3sDPrSHgpg"
RANGE_HOS = "Hospitals!A2:L18"
RANGE_ROOM = "BaseERR!A2:U70"
MAPBOX_ACCESS_TOKEN = os.getenv('MAPBOX_ACCESS_TOKEN')

# Ensure history directory exists
os.makedirs(HISTORY_DIR, exist_ok=True)

# Flask setup
app = Flask(__name__)
CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'FileSystemCache', 'CACHE_DIR': CACHE_DIR})

# Data extraction
json_object = {}

def extractHosRoomsInfo():
    creds = Credentials.from_service_account_file(
        os.getenv('GOOGLE_APPLICATION_CREDENTIALS'), scopes=SCOPES
    )
    try:
        service = build("sheets", "v4", credentials=creds)
        sheet = service.spreadsheets()

        # Hospitals
        resultHos = sheet.values().get(spreadsheetId=SHEET_ID, range=RANGE_HOS).execute()
        valuesHos = resultHos.get("values", [])
        hospitalArray = []
        for row in valuesHos:
            try:
                hospitalArray.append({
                    "name": row[0],
                    "District": row[1],
                    "Status": row[2],
                    "ERR": row[3],
                    "Patners": row[4],
                    "GPS_Location": row[5],
                    "Controlled_By": row[6],
                    "Daily_Cases": row[7],
                    "Notes": row[11]
                })
            except IndexError:
                continue

        # Emergency Rooms
        resultRooms = sheet.values().get(spreadsheetId=SHEET_ID, range=RANGE_ROOM).execute()
        valuesRooms = resultRooms.get("values", [])
        roomArray = []
        for row in valuesRooms:
            try:
                roomArray.append({
                    "no": row[0],
                    "baseerr": row[1],
                    "district": row[2],
                    "region": row[3],
                    "rooms": row[4],
                    "hosptials": row[5],
                    "clinics": row[6],
                    "evacuationcenters": row[7],
                    "kitchens": row[8],
                    "pots": row[9],
                    "childrencenters": row[10],
                    "womenrestrooms": row[11],
                    "womencoops": row[12],
                    "volunteers": row[14],
                    "ServedPopulation": row[15],
                    "geolocation": row[16],
                    "controlledby": row[17],
                    "ArabicName": row[18],
                    "Discription": row[19],
                    "Photos": row[20]
                })
            except IndexError:
                continue

    except HttpError as err:
        print(f"Google Sheets error: {err}")
        return

    json_object["Hospitals"] = hospitalArray
    json_object["BaseERR"] = roomArray

    # Write live data snapshot
    with open(SAMPLE_JSON, 'w') as f:
        json.dump(json_object, f)

# Archive and manifest

def update_manifest():
    files = glob.glob(os.path.join(HISTORY_DIR, '*.json'))
    # Only include date-named JSON files YYYY-MM-DD.json
    dates = [os.path.splitext(os.path.basename(p))[0]
             for p in files if re.match(r'^\d{4}-\d{2}-\d{2}\.json$', os.path.basename(p))]
    dates.sort()
    with open(MANIFEST_PATH, 'w') as mf:
        json.dump(dates, mf)


def archive_daily_snapshot():
    # Refresh live data
    extractHosRoomsInfo()
    now = datetime.now(dt_timezone.utc)
    date_str = now.strftime('%Y-%m-%d')
    dest = os.path.join(HISTORY_DIR, f"{date_str}.json")
    # Copy current snapshot to history
    shutil.copyfile(SAMPLE_JSON, dest)
    update_manifest()
    print(f"Archived snapshot for {date_str}")

# Scheduler setup
scheduler = BackgroundScheduler(timezone=SCHEDULER_TIMEZONE)
scheduler.add_job(archive_daily_snapshot, 'cron', hour=0, minute=5)
scheduler.start()

# Initial population
extractHosRoomsInfo()
archive_daily_snapshot()

# Flask routes
@app.route('/mapbox-tiles/styles/v1/<path:path>')
@cache.cached(timeout=3600, query_string=True)
def mapbox_tiles_proxy(path):
    url = f'https://api.mapbox.com/styles/v1/{path}?access_token={MAPBOX_ACCESS_TOKEN}'
    resp = requests.get(url)
    return (resp.content, resp.status_code) if resp.ok else (jsonify({'error': 'tile fetch failed'}), resp.status_code)

@app.route('/data')
def live_data():
    try:
        with open(SAMPLE_JSON) as f:
            return jsonify(json.load(f))
    except Exception:
        return jsonify({'error': 'live data unavailable'}), 500

@app.route('/history')
def history_data():
    date = request.args.get('date')
    path = os.path.join(HISTORY_DIR, f"{date}.json")
    if not os.path.exists(path):
        return jsonify({'error': 'No data for that date'}), 404
    with open(path) as f:
        return jsonify(json.load(f))

@app.route('/history/manifest')
def history_manifest():
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH) as mf:
            return jsonify(json.load(mf))
    return jsonify([])

# Note: this module is WSGI-app ready; no __main__ guard