from flask import Flask, redirect, url_for, session, jsonify, render_template, url_for, request
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
import models
from bson import json_util
import json
import datetime
import pytz


password = "mCSQ34bbZ6hB0tH7"

app = Flask(__name__, static_folder="../frontend/trainings_diary/build/static")
CORS(app, supports_credentials=True)
app.secret_key = 'my_secret_key'
app.config["MONGO_URI"] =  f"mongodb+srv://leonardbaranski:{password}@running-data.z2dj6fb.mongodb.net/?retryWrites=true&w=majority"

db = models.Database(app)

GOOGLE_CLIENT_ID = '42379345688-pct8948ievr9pl261l58ml0o8cga8cut.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = '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'
REDIRECT_URI = 'http://localhost:5000/callback'

## !!!!! HIER WEITERMACHE. LOGOUT GEHT; FINDET ABER TEMPLATE ZUR STARTSEITE NICHT
@app.route("/", methods=['GET'])
def home():
    return render_template("index.html")

@app.route('/callback', methods=['POST'])
def callback():
    # Empfangen des Authentifizierungscodes von Google
    id_token_jwt = request.json.get('token')

    try:
        idinfo = id_token.verify_oauth2_token(id_token_jwt, requests.Request(), GOOGLE_CLIENT_ID, clock_skew_in_seconds=10)
        userid = idinfo['sub']

        user = db.get_user_by_id(userid)
        if not user:
            user_data = {"user_id": userid, "email": idinfo.get("email")}
            db.add_user(user_data)
    
        session['user'] = idinfo

        return jsonify({"name": idinfo.get("name"), "email": idinfo.get("email")})

    except ValueError as e:
        print(e)
        return 'Invalid token', 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Successfully logged out"})

@app.route('/mydata', methods=['GET'])
def get_my_data():
    user_info = session.get('user')
    if not user_info:
        return jsonify({"error": "User not logged in"}), 403

    user_id = user_info['sub']
    training_data_cursor = db.get_running_data_by_user(user_id)

    training_data = list(training_data_cursor)
    training_data_json = json.loads(json_util.dumps(training_data))

    return jsonify(training_data_json)

@app.route('/mydata', methods=['POST'])
def upload_data():
    user_info = session.get('user')
    if not user_info:
        return jsonify({"error": "User not logged in"}), 403

    user_id = user_info['sub']
    training_data = request.json
    training_data['user_id'] = user_id
    training_data['date'] = datetime.datetime.now(pytz.timezone('Europe/Berlin')).strftime("%h %d %Y %H:%M:%S")

    db.add_running_data(training_data)

    return jsonify({"success": True})

@app.route('/mydata/<id>', methods=['DELETE'])
def delete_data(id):
    user_info = session.get('user')
    if not user_info:
        return jsonify({"error": "User not logged in"}), 403

    db.delete_running_data(id)

    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)

