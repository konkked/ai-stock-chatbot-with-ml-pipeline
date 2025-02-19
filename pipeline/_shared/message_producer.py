from kafka import KafkaProducer
import json

class MessageProducer:
    def __init__(self, bootstrap_servers, topic):
        self.producer = KafkaProducer(bootstrap_servers=bootstrap_servers)
        self.topic = topic

    def send_message(self, message):
        value = json.dumps(message).encode('utf-8')
        self.producer.send(self.topic, value=value)
        self.producer.flush()

    def close(self):
        self.producer.close()