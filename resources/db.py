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