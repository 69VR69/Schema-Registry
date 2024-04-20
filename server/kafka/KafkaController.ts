import { Kafka, Logger, Producer } from "kafkajs";

export class KafkaController
{
    private kafka: Kafka;
    private producer: Producer;
    private logger: Logger;

    /**
     * Initialize Kafka connection, producer and logger
     * @returns Kafka object
     */
    async initKafka() : Promise<Kafka>
    {
        // Initialize Kafka
        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['localhost:2442']
        });

        // Initialize Producer
        this.producer = kafka.producer();

        // Initialize Logger
        this.logger = kafka.logger();
        this.logger.info("Kafka initialized");

        return kafka;
    }

    /**
     * Check if Kafka connection is initialized
     * @returns boolean true if Kafka connection is initialized, false otherwise
     */
    private checkKakfaConnection() : boolean
    {
        if (this.producer == null)
        {
            this.logger.error("Kafka producer not initialized");
            return false;
        }

        return true;
    }

    /**
     * Send data to Kafka
     * @param data JSON data to send
     * @param topic Kafka topic to send data to
     * @returns boolean true if data was sent successfully, false otherwise
     */
    async sendToKafka(data: JSON, topic : string) : Promise<boolean>
    {
        if (!this.checkKakfaConnection())
        {
            return false;
        }

        // Send data to Kafka
        await this.producer.send({
            topic: topic,
            messages: [
                { value: JSON.stringify(data) }
            ]
        })
        .then(() => {
            this.logger.info("Follwing data sent to Kafka on topic " + topic + ":\n" + JSON.stringify(data));
            return true;
        })
        .catch((error) => {
            this.logger.error("Error sending data to Kafka on topic " + topic + ":\n" + JSON.stringify(data) + "\n\nError: " + error);
            return false;
        });
    }

    /**
     * Close Kafka connection
     */
    async closeKafkaConnection() : Promise<void>
    {
        if (!this.checkKakfaConnection())
        {
            this.logger.error("Kafka producer not initialized");
            return;
        }

        await this.producer.disconnect();
        this.logger.info("Kafka connection closed");
    }
}