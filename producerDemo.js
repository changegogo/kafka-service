const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;

// 连接参数
let params = {
    kafkaHost: '172.25.53.178:9090,172.25.65.173:9090', // 接入地址
    sasl: { // 开启plain认证
        mechanism: 'plain',
        username: 'jvmlWnhT', // AccessKey
        password: '875456c4-75d9-4787-b7ea-5b0494b507c8' // SecurityKey
    }
};
let client = new kafka.KafkaClient(params);

// 生产消息
let producer = new Producer(client);

let km = new KeyedMessage('key1', 'The new consumer group uses Kafka broker coordinators instead of Zookeeper to manage consumer groups. This is supported in Kafka version 0.9 and above only.');

let payloads = [
    {
        topic: 'li-jdjr',
        messages: ['{data}'+Math.random()],
        partition: 0
    }
];

producer.on('ready', function() {
    setInterval(() => {
        payloads = [{
            topic: 'li-jdjr',
            messages: Math.random() + ''
        }];
        producer.send(payloads, function(err, data) {
            console.log(data);
        });
    }, 1000)
});

producer.on('error', function(err) {
    console.log(err);
});

