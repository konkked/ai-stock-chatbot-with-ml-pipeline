import json
from pymongo import MongoClient
from datetime import datetime, timedelta

class StockStatsDataProcessor:
    def __init__(self, uri, db_name):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.raw_collection = self.db['raw']
        self.stats_collection = self.db['stats']
        self.mapping_collection = self.db['mapping']

    def get_mappings(self):
        """Retrieve all mappings from the database."""
        return list(self.mapping_collection.find())

    def get_recent_raw_data(self):
        """Retrieve raw stock data from the last day."""
        midnight_yesterday = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        midnight_yesterday_unix = int(midnight_yesterday.timestamp())
        return list(self.raw_collection.find({'_ts': {'$gte': midnight_yesterday_unix},  'processed': {'$ne': True}}))

    def get_latest_stats(self, ticker, period, source):
        """Fetch the most recent stats record for a given ticker, period, and source."""
        return self.stats_collection.find_one(
            {"ticker": ticker, "period": period, "source": source}, 
            sort=[("_ts", -1)]
        )

    def get_stats_count(self, ticker, period, source):
        """Count how many stats records exist for a given ticker and period."""
        now = datetime.now()
        if period == "daily":
            start_time = now - timedelta(days=1)
        elif period == "weekly":
            start_time = now - timedelta(weeks=1)
        elif period == "monthly":
            start_time = now - timedelta(days=30)
        else:
            raise ValueError(f"Unsupported period: {period}")

        start_time_unix = int(start_time.timestamp())

        return self.stats_collection.count_documents({
            "ticker": ticker,
            "period": period,
            "source": source,
            "_ts": {"$gte": start_time_unix}
        })

    def merge_data(self, existing_data, new_data):
        """Merge two datasets, taking the newest values."""
        merged = existing_data.copy() if existing_data else {}
        for key, value in new_data.items():
            if value is not None:
                merged[key] = value
        return merged

    def process_stock_data(self, tickers):
        """Main pipeline to process stock data."""
        mappings = self.get_mappings()
        raw_records = self.get_recent_raw_data()

        for raw_record in raw_records:
            ticker = raw_record.get("yahoo_finance", {}).get("symbol")
            if not ticker or ticker not in tickers:
                continue  # Skip records without a valid ticker

            for mapping in mappings:
                source = mapping['source']
                period = mapping['period']

                # Check how many stats records exist for this ticker
                stats_count = self.get_stats_count(ticker, period, source)
                if stats_count >= 3:
                    print(f"Skipping {ticker} ({period}) - More than 3 records exist")
                    continue

                # Get the most recent stats record
                existing_stats = self.get_latest_stats(ticker, period, source)

                # Extract data using mapping definition
                new_data = {}
                for key, path in mapping['def'].items():
                    try:
                        path_parts = path.split('.')
                        value = raw_record
                        for part in path_parts:
                            value = value.get(part, {})
                        if isinstance(value, dict):  # If it's an empty dict, treat it as None
                            value = None
                        new_data[key] = value
                    except Exception as e:
                        print(f"Error extracting {key} for {ticker}: {e}")

                # Merge with existing stats if available
                merged_data = self.merge_data(existing_stats, new_data)

                # Insert into stats collection
                merged_data["_ts"] = datetime.utcnow()
                merged_data["ticker"] = ticker
                merged_data["period"] = period
                merged_data["source"] = source

                self.stats_collection.insert_one(merged_data)
                print(f"Inserted stats for {ticker} ({period})")

            # Mark raw record as processed
            self.raw_collection.update_one({'_id': raw_record['_id']}, {'$set': {'processed': True}})

    def close(self):
        """Close database connection."""
        self.client.close()

# Usage:
# processor = StockDataProcessor("mongodb://localhost:27017", "stock_db")
# processor.process_stock_data()
# processor.close()
