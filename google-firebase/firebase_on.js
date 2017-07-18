module.exports = function (RED) {
      var firebase = require('firebase');
      var Utils = require('./utils/utils');

      function FirebaseOn(n) {
            RED.nodes.createNode(this, n);
            this.firebaseConfig = RED.nodes.getNode(n.firebaseConfig);
            this.childpath = n.childpath;
            this.eventType = n.eventType;
            this.activeRequests = [];
            this.ready = false;
            var node = this;

            var QueryOn = function() {
                  firebase.database().ref(node.childpath).on(node.eventType.toString(), function (snapshot) {
                        var msg = {payload: snapshot.val()};
                        var globalContext = node.context().global;

                        globalContext.set("threshold-temp", msg.payload);  // this is now available to other nodes
                        node.send(msg);
                        node.status({ fill: "green", shape: "ring", text: "Received Data(On) at " + Utils.getTime() });
                  });
            }

            if (!node.firebaseConfig) {
                  node.status({ fill: "red", shape: "ring", text: "invalid credentials" })
                  node.error('You need to setup Firebase credentials!');
                  return;
            }

            node.status({ fill: "green", shape: "ring", text: "Connected" });

            node.on('input', function(msg) {
                  if (!node.firebaseConfig.fbConfig.fbApp) {
                        return;
                  }
                  QueryOn();
            });
            node.validEventTypes = {
                  "value": true,
                  "child_added": true,
                  "child_changed": true,
                  "chiled_removed": true,
                  "child_moved": true
            };
      }
      RED.nodes.registerType('google.firebase.on', FirebaseOn);
};
