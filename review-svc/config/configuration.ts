export default () => ({
    kafka: {
        brokers: process.env.KAFKA_BROKERS,
        clientId: process.env.KAFKA_CLIENT_ID,
        groupId: process.env.KAFKA_CONSUMER_GROUP,
    }
});