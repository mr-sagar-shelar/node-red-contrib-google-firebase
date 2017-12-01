var Initialized = false;
var App = null;

module.exports = function (RED) {
      var firebase = require('firebase');

      function RemoteServerNode(n) {
            RED.nodes.createNode(this, n);

            // Initialize Firebase
            var config = {
                  apiKey: n.apiKey,
                  authDomain: n.project + ".firebaseapp.com",
                  databaseURL: "https://" + n.project + ".firebaseio.com",
                  projectId: n.project,
                  storageBucket: n.project + ".appspot.com"
            };

            if (!Initialized) {
                  this.app = firebase.initializeApp(config);
                  App = this.app;
            } else {
                  this.app = App;
            }
            Initialized = true;
      }
      RED.nodes.registerType("config-firebase", RemoteServerNode);
};
