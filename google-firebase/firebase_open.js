module.exports = function(RED) {
      var firebase = require('firebase');

      function FirebaseOpen(config) {
            RED.nodes.createNode(this, config);
            var node = this;

            var open = function() {
                  firebase.auth().signInWithEmailAndPassword(config.email, config.password).then(function() {

                        node.log("Session Opened...");
                        node.send("Auth OK!");


                  }, function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        node.error("Errors Open Auth : " + errorCode + " " + errorMessage);
                        node.send("AUTH FAIL!");
                  });
            }

            node.on('input', function(msg) {
                  open();
            });
      }
      RED.nodes.registerType("google-firebase-open", FirebaseOpen);
}
