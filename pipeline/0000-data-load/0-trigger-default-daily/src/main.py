from stock_tickers import load_stock_tickers
from message_producer import MessageProducer

def main():
    tickers = load_stock_tickers()
    bootstrap_servers = 'kfs.stockiyt.com:9092'
    topic = 'update-tickers'
    producer = MessageProducer(bootstrap_servers, topic)
    for ticker in tickers:
        producer.send_message(ticker)
    producer.close()

if __name__ == "__main__":
    main()