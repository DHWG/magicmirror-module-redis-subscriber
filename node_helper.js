const NodeHelper = require('node_helper');
const redis = require('redis');

module.exports = NodeHelper.create({

  config: {
  },

  socketNotificationReceived: function(notification, payload) {
    const self = this;

    switch (notification) {
      case 'configure':
        self.config = payload;
        try {
          self.redis = redis.createClient(self.config.redis);
          self.redis.on('message', (channel, message) => {
            self.handleMessage(channel, message);
          });
          self.redis.subscribe(self.config.redisTopic);
        } catch (e) {
          console.error(e);
        }
        break;
    }
  },

  handleMessage: function(channel, message) {
    console.log(channel, message);
    var messageObject = JSON.parse(message);
    this.sendSocketNotification('message', messageObject);
  }

});
