import { Admin, Kafka, Logger, Partitioners, Producer } from "kafkajs";

export class KafkaController
{
    private kafka: Kafka;
    private producer: Producer;
    private logger: Logger;
    private admin: Admin;

    /**
     * Initialize Kafka connection, producer and logger
     * @returns Kafka object
     */
    async init() : Promise<Kafka>
    {
        // Initialize Kafka
        this.kafka = new Kafka({
            clientId: 'darkpioupiou',
            brokers: ['localhost:2442']
        });

        // Initialize Producer
        this.producer = this.kafka.producer({ 
            createPartitioner: Partitioners.DefaultPartitioner,
            allowAutoTopicCreation: true
        });

        // Initialize Logger
        this.logger = this.kafka.logger();
        this.logger.info("Kafka initialized");

        // Initialize Admin Client
        this.admin = this.kafka.admin();

        // Connect to Kafka
        await this.producer.connect();
        this.logger.info("Producer connected");

        return this.kafka;
    }

    /**
     * Check if Kafka connection is initialized
     * @returns boolean true if Kafka connection is initialized, false otherwise
     */
    private checkConnection() : boolean
    {
        if (!this.producer) {
            this.logger.error("Kafka producer not initialized");
            return false;
        }
        return true;
    }

    /**
     * Send data to Kafka
     * @param data string data to send
     * @param topic Kafka topic to send data to
     * @returns boolean true if data was sent successfully, false otherwise
     */
    async send(data: string, topic : string) : Promise<boolean>
    {
        if (!this.checkConnection())
        {
            return false;
        }

        // Ensure topic exists
        await this.admin.createTopics({
            topics: [{
                topic: topic,
                numPartitions: 1,
                replicationFactor: 1,
                configEntries: [
                    {
                        name: 'cleanup.policy',
                        value: 'delete'
                    },
                    {
                        name: 'min.insync.replicas',
                        value: '1'
                    }
                ]
            }]
        }).then(() => {
            this.logger.info(`Topic ${topic} created successfully`);
        })
        .catch(error => {
            this.logger.error(`Error creating topic ${topic}: ${error}`);
        });
        
        // Send data to Kafka
        await this.producer.send({
            topic: topic,
            messages: [
                { value: data }
            ]
        })
        .then(() => {
            this.logger.info("Follwing data sent to Kafka on topic " + topic + ":\n" + data);
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
    async close() : Promise<void>
    {
        if (!this.checkConnection())
        {
            this.logger.error("Kafka producer not initialized");
            return;
        }

        await this.producer.disconnect();
        this.logger.info("Kafka connection closed");
    }
}