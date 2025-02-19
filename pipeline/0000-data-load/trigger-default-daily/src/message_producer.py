class MessageProducer:
    def __init__(self, bootstrap_servers, topic):
        from kafka import KafkaProducer as KafkaProducerLib
        self.producer = KafkaProducerLib(bootstrap_servers=bootstrap_servers)
        self.topic = topic

    def send_message(self, message):
        self.producer.send(self.topic, value=message)
        self.producer.flush()

    def close(self):
        self.producer.close()