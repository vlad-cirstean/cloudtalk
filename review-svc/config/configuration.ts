export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    mysql:{
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
        user: process.env.MYSQL_USER,
        pass: process.env.MYSQL_PASS,
        db: process.env.MYSQL_DB,
    },
    kafka: {
        brokers: process.env.KAFKA_BROKERS,
        clientId: process.env.KAFKA_CLIENT_ID,
        groupId: process.env.KAFKA_CONSUMER_GROUP,
    }
});