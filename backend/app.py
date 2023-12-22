from flask import Flask, redirect, url_for, session, request, jsonify
from flask_oauthlib.client import OAuth
from models import User, RunningData


app = Flask(__name__)
app.secret_key = 'random secret'

# Configure Google OAuth
oauth = OAuth(app)
google = oauth.remote_app(
    'google',
    consumer_key='42379345688-mqd6d271fdaa2scqmjju6cosobe81ehg.apps.googleusercontent.com',
    consumer_secret='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',
    request_token_params={
        'scope': 'https://www.googleapis.com/auth/userinfo.email',
        'prompt': 'select_account'
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

@app.route('/login/google')
def login_google():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/login/google/authorized')
def authorized():
    resp = google.authorized_response()
    if resp is None or resp.get('access_token') is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )

    session['google_token'] = (resp['access_token'], '')
    userinfo = google.get('userinfo')
    # Now you have user info, you can create/login user in your database

    return 'Logged in as id={}'.format(userinfo.data['id'])

@app.route('/mydata')
def get_my_data():
    user_google_id = session['google_user_id']  # Set this during login
    user = User.objects(google_id=user_google_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    training_data = RunningData.objects(user_id=user.id)
    return jsonify(training_data)


@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

if __name__ == '__main__':
    app.run(debug=True)
