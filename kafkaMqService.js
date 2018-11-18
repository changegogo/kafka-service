const kafka = require('kafka-node');
const KeyedMessage = kafka.KeyedMessage;
const assert = require('assert');
const isNumber = require('is-number');
const {writeOffset} = require('./readWriteOffest');


class KafkaMqService {
    constructor(params) {
        assert(params.groupId, '[params.groupId] is required');
        assert(params.topic, '[params.topic] is required');
        this.partition = params.partition ? params.partition : 0;
        this.topic = params.topic;
        this.groupId = params.groupId;

        this.init(params);
    }

    getCommitOffset() {
        let self = this;
        return new Promise((resolve, reject) => {
            let offset = new kafka.Offset(this.client);
            offset.fetchCommits(self.groupId, [
                { topic: this.topic, partition: this.partition }
            ], function (err, data) {
               if(!err) {
                   resolve(data[`${self.topic}`][0]);
               }else {
                   reject(err);
               }
            });
        });
    }

    init(params) {
        this.client = new kafka.KafkaClient(params);
        this.producer = new kafka.Producer(this.client);
        this.consumer = new kafka.Consumer(
            this.client, 
            [{topic: params.topic}],
            {
                groupId: this.groupId,
                autoCommit: true,
                autoCommitIntervalMs: 5000,
                fromOffset: false
            }
        );


        this.producer.on('ready', () => {
            console.log('ready');
        })
        this.producer.on('error', (error) => {
            console.log(error);
        });
        this.consumer.on('error', (error) => {
            console.log(error);
        });
        this.consumer.on('message', (message) => {
            this._handleMsg(message);
        });
    }

    async sendMsgToTopic(key, body) {
        let km = new KeyedMessage(key, body);
        let payloads = [
            {
                topic: this.topic,
                messages: [km],
                partition: this.partition
            }
        ];
        
        this.producer.send(payloads, function(err, data) {
            if(err) {
                console.error(err);
            }else {
                console.log('send success', data);
            }
        });
    }

    _handleMsg(message) {
        console.log('消费消息', message);
    }

}

module.exports = KafkaMqService;