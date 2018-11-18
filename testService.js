const KafkaMqService = require('./kafkaMqService');
const {readOffset} = require('./readWriteOffest');

let params = {
    kafkaHost: '172.25.53.178:9090,172.25.65.173:9090', // 接入地址
    topic: 'li-jdjr',
    sasl: {                     // 开启plain认证
        mechanism: 'plain',     // plain认证
        username: 'jvmlWnhT',   // AccessKey
        password: '875456c4-75d9-4787-b7ea-5b0494b507c8' // SecurityKey
    },
    groupId: 'dlw_consumer_group' // 订阅组
};


async function test() {
    let kafkaMqService = new KafkaMqService(params);
    
    let index = 0;
    //setInterval( function() {
        kafkaMqService.sendMsgToTopic('age', `{"age": "${index++}"}`);
    //}, 5000);
    
}

test();