from kafka import KafkaConsumer
import json

class MessageConsumer:
    def __init__(self, bootstrap_servers, topic):
        self.consumer = KafkaConsumer(topic, bootstrap_servers=bootstrap_servers)

    def consume_messages(self, callback, signal_received=None):
        for message in self.consumer:
            decoded_message = message.value.decode('utf-8')
            message_dict = json.loads(decoded_message)  # Assuming the message is a JSON string
            callback(message_dict)
            if signal_received:
                signal_received()

    def close(self):
        self.consumer.close()