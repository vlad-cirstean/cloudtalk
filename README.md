# cloudtalk

This project was done with NestJs and uses Mysql, Kafka and Redis.

Both services are in the same repo for ease of use. 
Normally there would be 2 repos, one for each. 
Also, dtos(used for Kafka communication) and other shared resources would be published as a lib in a registry.

Product Service owns **product** and **product_review** tables. 
Is responsible for all CRUD operations exposed as a REST API
It also listens for messages on **product.rating** topic to update the average review value of a product.

Review Service owns **average_rating** table (stored in another database). 
It listens on **product.review** topic for any review change, computes the new average, updates the data in the table, and returns the result on **product.rating** topic.
The average is computed very efficiently but at the loss of some precision.

Both services can easily scale up to the number of partitions on the Kafka topic. In this dev project, there is only 1 partition per topic.

Having services with totally different resources communication using Kafka has many benefits:
- data domains are separated
- independently scalable resources (database)

But there are also some disadvantages:
- the average rating is eventually consistent
- added complexity

WIP:
- [ ] Force Nest controller to consume batches of messages from Kafka
- [ ] Add caching for products
- [ ] Add pagination
- [ ] Add logs
- [ ] Add unit/integration tests
- [ ] Add git hooks and CI/CD

