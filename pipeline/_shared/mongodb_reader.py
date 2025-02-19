from pymongo import MongoClient
from bson.objectid import ObjectId
import time

class MongoDBReader:
    def __init__(self, uri, db_name, collection_name):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def read_batch(self, batch_size):
        return list(self.collection.find().sort("_ts", -1).limit(batch_size))

    def get_item_by_id(self, item_id):
        return self.collection.find_one({"_id": ObjectId(item_id)})

    def search_by_properties(self, properties):
        return list(self.collection.find(properties))

    def get_records_since(self, date):
        unix_time = int(time.mktime(date.timetuple()))
        return list(self.collection.find({"_ts": {"$gte": unix_time}}))
    
    def search_by_properties_since(self, properties, date):
        unix_time = int(time.mktime(date.timetuple()))
        properties["_ts"] = {"$gte": unix_time}
        return list(self.collection.find(properties))

# Example usage:
# reader = MongoDBReader("mongodb://localhost:27017/", "mydatabase", "mycollection")
# batch = reader.read_batch(10)
# item = reader.get_item_by_id("60c72b2f9b1d4c3d88f8e8b5")
# search_results = reader.search_by_properties({"name": "John"})
# from datetime import datetime
# records_since = reader.get_records_since(datetime(2021, 1, 1))