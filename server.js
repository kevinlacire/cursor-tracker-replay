var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const Kafka = require("node-rdkafka");

var kafkaHost = "localhost:9092";
var kafkaTopicTracker = "cursor-tracker";
var channelCursorReplay = "cursor-replay";

var streamProducer = Kafka.Producer.createWriteStream({
    "metadata.broker.list": kafkaHost
  }, {}, {
    topic: kafkaTopicTracker
  }
);

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': kafkaHost,
  'enable.auto.commit': false, // don't commit my offset
}, {
  'auto.offset.reset': 'earliest' // consume from the start
});

io.on('connection', function(socket) {
  socket.on(kafkaTopicTracker, function(data) {
    if (!streamProducer.write(Buffer.from(JSON.stringify(data)))) {
      console.log("the message couldn't have been sent");
    }
  });

  consumer.connect();

  consumer
    .on('ready', function() {
      consumer.subscribe([kafkaTopicTracker]);
      setInterval(function() {
        consumer.consume(1);
      }, 50);
    })
    .on('data', function(data) {
      console.info(data.value.toString());
      socket.emit(channelCursorReplay, JSON.parse(data.value.toString()));
    });
});

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res, next) {
  res.render("./public/index.html");
});

server.listen(8888);
