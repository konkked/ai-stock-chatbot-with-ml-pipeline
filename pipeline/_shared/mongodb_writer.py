from pymongo import MongoClient, UpdateOne

class MongoDBWriter:
    def __init__(self, uri, db_name, collection_name):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def upsert_record(self, record_id, data):
        """
        Insert or update a record by ID.
        
        :param record_id: The ID of the record to insert or update.
        :param data: A dictionary containing the data to insert or update.
        """
        self.collection.update_one(
            {'_id': record_id},
            {'$set': data},
            upsert=True
        )
    
    def insert(self, data):
        self.collection.insert_one(data)

    def close(self):
        self.client.close()

# Example usage:
# writer = MongoDBWriter('mongodb://localhost:27017/', 'mydatabase', 'mycollection')
# writer.upsert_record('record_id', {'field1': 'value1', 'field2': 'value2'})
# writer.close()