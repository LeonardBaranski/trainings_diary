from flask import Flask, redirect, url_for, session, jsonify, render_template, url_for, request
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from google.oauth2 import id_token
from google.auth.transport import requests
import models
from bson import json_util
import json


password = "mCSQ34bbZ6hB0tH7"

app = Flask(__name__, static_folder="../frontend/trainings_diary/build/static")
CORS(app)
app.secret_key = 'my_secret_key'
app.config["MONGO_URI"] =  f"mongodb+srv://leonardbaranski:{password}@running-data.z2dj6fb.mongodb.net/?retryWrites=true&w=majority"
app.config.update(
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='None',
)

db = models.Database(app)

GOOGLE_CLIENT_ID = '42379345688-pct8948ievr9pl261l58ml0o8cga8cut.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = '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'
REDIRECT_URI = 'http://localhost:5000/callback'

# Configure Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={
        'scope': 'https://www.googleapis.com/auth/userinfo.email',
        'token_endpoint_auth_method': 'client_secret_post'
    }
)

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
        print(idinfo)
        userid = idinfo['sub']

        user = db.get_user_by_id(userid)
        if not user:
            user_data = {"user_id": userid, "email": idinfo.get("email")}
            db.add_user(user_data)
    
        session['user'] = idinfo
        print(session)

        return f'Willkommen, {idinfo.get("name")}!'

    except ValueError as e:
        print(e)
        return 'Invalid token', 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return render_template("index.html")

@app.route('/mydata')
def get_my_data():
    print(session)
    print(session.get('user'))
    user_info = session.get('user')
    if not user_info:
        return jsonify({"error": "User not logged in"}), 403

    user_id = user_info['sub']
    training_data = db.get_running_data_by_user(user_id)
    return render_template("mydata.html", training_data=training_data)

if __name__ == '__main__':
    app.run(debug=True)

