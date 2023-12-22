from flask import Flask, redirect, url_for, session, request, jsonify
from authlib.integrations.flask_client import OAuth
import models
import os


password = "mCSQ34bbZ6hB0tH7"

app = Flask(__name__)
app.secret_key = 'default_secret_key'
app.config["MONGO_URI"] =  f"mongodb+srv://leonardbaranski:{password}@running-data.z2dj6fb.mongodb.net/?retryWrites=true&w=majority"

models.init_app(app)

# Configure Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='42379345688-mqd6d271fdaa2scqmjju6cosobe81ehg.apps.googleusercontent.com',
    client_secret='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',
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

@app.route('/login/google')
def login_google():
    redirect_uri = url_for('authorized', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/login/google/authorized')
def authorized():
    token = google.authorize_access_token()
    userinfo = google.get('userinfo').json()
    # Now you have user info, you can create/login user in your database

    # Check if user exists in the database, if not, create a new user
    user = models.get_user_by_id(userinfo['id'])
    if not user:
        user_data = {"google_id": userinfo['id'], "email": userinfo['email']}
        models.add_user(user_data)

    session['user_id'] = userinfo['id']
    return 'Logged in as id={}'.format(userinfo['id'])

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('home'))

@app.route('/mydata')
def get_my_data():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 403

    training_data = models.get_running_data_by_user(user_id)
    return jsonify(training_data)

if __name__ == '__main__':
    app.run(debug=True)

