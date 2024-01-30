from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId


class Database(object):
    def __init__(self, app=None):
        self.app = app
        self.db = None
        self.users = None
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.db = MongoClient(app.config["MONGO_URI"], server_api=ServerApi('1'))
        self.db = self.db.running_data
        self.users = self.db.users

    def get_user_by_id(self, user_id):
        return self.db.users.find_one({"user_id": user_id})

    def add_user(self, user_data):
        return self.db.users.insert_one(user_data).inserted_id

    def get_running_data_by_user(self, user_id):
        return self.db.running_data.find({"user_id": user_id})

    def add_running_data(self, running_data):
        return self.db.running_data.insert_one(running_data).inserted_id
    
    def delete_running_data(self, id):
        return self.db.running_data.delete_one({"_id": ObjectId(id)})
