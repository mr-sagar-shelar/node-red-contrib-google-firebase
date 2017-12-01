module.exports = function(RED) {
      function UpdateFirebase(config) {
            RED.nodes.createNode(this, config);
            var node = this;
            var firebase = RED.nodes.getNode(config.firebase);

            node.on('input', function(msg) {
                  firebaseUpdate(msg.payload);
            });

            function firebaseUpdate( data ) {
                  var db = firebase.app.database();
                  var ref = db.ref(config.reference);
                  ref.update(data);
            }
      }
      RED.nodes.registerType("update", UpdateFirebase);
}
