const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const Offset = kafka.Offset;
const {readOffset, writeOffset} = require('./readWriteOffest');

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
let offset = new Offset(client);

readOffset()
    .then(offset => {
        let consumer = new Consumer(
            client, 
            [{topic: 'li-jdjr', offset: offset}],
            {
                autoCommit: true,
                fromOffset: true
            }
        );
        
        consumer.on('message', (message) => {
            // 更新offset
            writeOffset(message.highWaterOffset);
            // 模拟消费
            console.log(`value:${message.value}, offset:${message.offset}, highWaterOffset:${message.highWaterOffset}, key:${message.key}`);
        });
        
        consumer.on('error', (err) => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    })



