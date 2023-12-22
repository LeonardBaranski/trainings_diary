from flask_pymongo import PyMongo

mongo = PyMongo()

def init_app(app):
    mongo.init_app(app)

def get_user_by_id(user_id):
    return mongo.db.users.find_one({"_id": user_id})

def add_user(user_data):
    return mongo.db.users.insert_one(user_data).inserted_id

def get_running_data_by_user(user_id):
    return list(mongo.db.running_data.find({"user_id": user_id}))

def add_running_data(running_data):
    return mongo.db.running_data.insert_one(running_data).inserted_id
