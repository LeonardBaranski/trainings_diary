from flask import Flask, request, jsonify
from backend import models



password = "mCSQ34bbZ6hB0tH7"


app = Flask(__name__)
app.secret_key = 'default_secret_key'
app.config["MONGO_URI"] =  f"mongodb+srv://leonardbaranski:{password}@running-data.z2dj6fb.mongodb.net/?retryWrites=true&w=majority"

models.init_app(app)


@app.route("/", methods=['GET'])
def home():
    return "Hello World!"


@app.route('/add_running_data', methods=['POST'])
def add_running_data():
    data = request.json  # Get data sent in the request
    
    # Validate or transform data as needed
    # Example: Ensure necessary fields are present
    if 'distance' not in data or 'speed' not in data or 'heart_rate' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        inserted_id = models.add_running_data(data)
        return jsonify({"message": "Running data added", "id": str(inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True)
