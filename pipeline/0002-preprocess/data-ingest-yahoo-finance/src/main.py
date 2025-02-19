from message_producer import MessageProducer
from message_consumer import MessageConsumer
import time
from threading import Timer
from stock_data_processor import StockStatsDataProcessor

def main():
    bootstrap_servers = 'kfs.stockiyt.com:9092'
    consuming_topic = 'ingest-raw-data'
    processor = StockStatsDataProcessor('mongodb://db.stockiyt.com:27017/', 'stokiyt')
    producing_topic = 'engineer-features'
    tickers = set()
    start_time = time.time()
    consumer = MessageConsumer(bootstrap_servers, consuming_topic)
    producer = MessageProducer(bootstrap_servers, producing_topic)

    def preprocess_and_send():
        nonlocal tickers
        if tickers:
            processor.process_stock_data(tickers)
            producer.send_message(tickers)
            tickers = []

    def consume_message(msg):
        nonlocal tickers
        tickers.add(msg)
        if len(tickers) >= 10:
            preprocess_and_send()

    def periodic_check():
        nonlocal start_time
        if (time.time() - start_time) >= 300:
            preprocess_and_send()
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