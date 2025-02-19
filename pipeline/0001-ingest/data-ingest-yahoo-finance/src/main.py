from ingest_data import ingest_data
from message_producer import MessageProducer
from message_consumer import MessageConsumer
from mongodb_writer import MongoDBWriter
import time
from threading import Timer

def main():
    bootstrap_servers = 'kfs.stockiyt.com:9092'
    consuming_topic = 'update-tickers'
    consumer = MessageConsumer(bootstrap_servers, consuming_topic)
    producing_topic = 'ingest-raw-data'
    producer = MessageProducer(bootstrap_servers, producing_topic)
    tickers = []
    start_time = time.time()
    mongo_db_writer =  MongoDBWriter('mongodb://localhost:27017/', 'mydatabase', 'mycollection')

    def aggregate_and_send():
        nonlocal tickers
        if tickers:
            result = ingest_data(tickers)
            producer.send_message(result)
            tickers = []

    def consume_message(msg):
        nonlocal tickers
        tickers.append(msg)
        if len(tickers) >= 10:
            aggregate_and_send()

    def periodic_check():
        nonlocal start_time
        if (time.time() - start_time) >= 300:
            aggregate_and_send()
            start_time = time.time()
        Timer(300, periodic_check).start()

    periodic_check()

    consumer.consume_messages(consume_message)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Interrupted by user, closing producer...")
    finally:
        producer.close()
        print("Producer closed.")
    producer.close()
    consumer.close()

if __name__ == "__main__":
    main()