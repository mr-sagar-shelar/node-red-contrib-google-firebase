module.exports = function (RED) {
  var Utils = require('./utils/utils');
  var gcm = require('node-gcm');

  function GoogleGcmSend(n) {
    RED.nodes.createNode(this, n);
    this.gcmConfig = RED.nodes.getNode(n.gcmConfig);
    this.tokens = n.tokens;
    var node = this;

    if (!this.gcmConfig) {
      this.status({ fill: "red", shape: "ring", text: "Invalid API Key!" })
      this.error('You need to setup GCM configuration!');
      return;
    }

    this.status({ fill: "green", shape: "ring", text: "Ready" });
    this.on('input', function (msg) {
      var message = new gcm.Message({
        collapseKey: 'demo',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
          key1: msg.payload
        },
        notification: {
          title: "Hello, World",
          icon: "ic_launcher",
          body: "This is a notification that will be displayed ASAP."
        }
      });

      var sender = new gcm.Sender(node.gcmConfig.apiKey);
      var regTokens = node.tokens.split(','); 

      sender.send(message, { registrationTokens: regTokens }, function (err, response) {
        if (err) {
          console.error(err);
          node.status({ fill: "red", shape: "ring", text: 'Error while sending last message.' });
        }
        else {
          console.log(response);
        }
      });
    });
  }
  RED.nodes.registerType('google.gcm.send', GoogleGcmSend);
};
