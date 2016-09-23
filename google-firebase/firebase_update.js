module.exports = function (RED) {
  var firebase = require('firebase');
  var Utils = require('./utils/utils');
  var _ = require('lodash-node');

  function FirebaseUpdate(n) {
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

    this.status({ fill: "green", shape: "ring", text: "Connected" });
    // this.on('input', function (msg) {
    //   console.log('!!!!!!!!!Sent Message from Update=',msg.payload);
    //   node.send(msg);
    // });
    // if (this.firebaseConfig.fbConfig.fbApp) {
    //   firebase.database().ref(this.childpath).update(msg.payload);
    //   node.status({ fill: "green", shape: "ring", text: "Received Data" + Utils.getTime() });
    // }
  }
  RED.nodes.registerType('google.firebase.update', FirebaseUpdate);
};
