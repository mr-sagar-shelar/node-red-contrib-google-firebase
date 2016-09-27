module.exports = function (RED) {
  var Utils = require('./utils/utils');
  var gcm = require('node-gcm');

  function GoogleGcmSend(n) {
    RED.nodes.createNode(this, n);
    this.firebaseConfig = RED.nodes.getNode(n.firebaseConfig);
    this.childpath = n.childpath;
    this.activeRequests = [];
    this.ready = false;
    var node = this;

    if (!this.firebaseConfig) {
      this.status({ fill: "red", shape: "ring", text: "invalid credentials" })
      this.error('You need to setup Firebase credentials!');
      return;
    }

    this.status({ fill: "green", shape: "ring", text: "Ready" });
    this.on('input', function (msg) {
      console.log('Send GCM Message = ', msg.payload);
      var message = new gcm.Message({
        collapseKey: 'demo',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        //restrictedPackageName: "somePackageName",
        //dryRun: true,
        data: {
          key1: 'message1',
          key2: 'message2'
        },
        notification: {
          title: "Hello, World",
          icon: "ic_launcher",
          body: "This is a notification that will be displayed ASAP."
        }
      });

      var sender = new gcm.Sender('AIzaSyB-9EC1ZLHOSIsyUF92bmMqRY6MWg7Nni0');
      var regTokens = [
        //office laptop localhost
        //'dVeQZHlns0s:APA91bGemJ5TO2eGqDdp9Rm_8axvGC_4THqhTjPVyNia8vBAELu1T5mNRWxgqOrL_3dj3nQIAB1jTnnuuaqLIGFuNyapAnKClI_AJAvl_PFaD6Bf8Uy2qUctdHQb_91cAzrBJCyKO1-_',
        //office laptop web
        'eiWMSb0J588:APA91bE_Rw5joSzLyLtjEXSu7mYY1fuNf7CwxAutrzd3hVS8qIyhHB9IvOMT7QYw-1IUfBtXFuPgWL2dSlUHIvi0sWAKHETFukyQ_zFvIWc1mvIfTtvmkFoWLo2wZuYPhdNiJWW3Vdjn',
        //mobile
        'dXgO80zv6wc:APA91bE8J11GgJm3IWoj9jHLu0u0CH9bE4YJbgk5guTOicvuvFYc4E6IinbHnTnVHuwq6Iex7ZC5Lamjf0-zDHGsNZr1dnXBd9uxx70cqKYM5VNzQPCEqNXWQGOY57ZGhVRDjzN8kcLo'
        ];

      sender.send(message, { registrationTokens: regTokens }, function (err, response) {
        if (err) {
          console.error(err);
        }
        else {
          console.log(response);
        }
      });
    });
  }
  RED.nodes.registerType('google.gcm.send', GoogleGcmSend);
};
