module.exports = function(RED) {
      var firebase = require('firebase');
      var Utils = require('./utils/utils');

      function FirebaseOpen(config) {
            RED.nodes.createNode(this, config);
            var node = this;

            var close = function() {
                  firebase.auth().signOut().then(function() {
                          node.log("Session closed Succesfull...");
                          node.status({ fill: "green", shape: "ring", text: "Close at " + Utils.getTime()});
                  }, function(error) {
                          node.error("Error closing Session...");
                          node.status({ fill: "red", shape: "ring", text: "CLOSE FAIL!" });
                  });
            }
            
            node.on('input', function(msg) {
                  close();
                  node.send(msg);
            });
      }
      RED.nodes.registerType("google-firebase-close", FirebaseOpen);
}
