from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

password = "mCSQ34bbZ6hB0tH7"

uri = f"mongodb+srv://leonardbaranski:{password}@running-data.z2dj6fb.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


def get_user_by_id(user_id):
    return client.running_data.users.find_one({"_id": user_id})

def add_user(user_data):
    return client.running_data.users.insert_one(user_data).inserted_id

def get_running_data_by_user(user_id):
    return list(client.running_data.running_data.find({"user_id": user_id}))

def add_running_data(running_data):
    return client.running_data.running_data.insert_one(running_data).inserted_id