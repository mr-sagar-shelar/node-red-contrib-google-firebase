module.exports = function(RED) {
      var firebase = require('firebase');

      function FirebaseOpen(config) {
            RED.nodes.createNode(this, config);
            var node = this;

            var close = function() {
                  firebase.auth().signOut().then(function() {
                          node.log("Session closed Succesfull...");
                  }, function(error) {
                          node.error("Error closing Session...");
                  });
            }

            node.on('input', function(msg) {
                  close();
                  node.send(msg);
            });
      }
      RED.nodes.registerType("google-firebase-close", FirebaseOpen);
}
