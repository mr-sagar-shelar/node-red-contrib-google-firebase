module.exports = function(RED) {
      function OnFirebase(config) {
            RED.nodes.createNode(this, config);
            var node = this;
            var firebase = RED.nodes.getNode(config.firebase)


            node.on('input', function(msg) {
                  firebaseOn( msg );
            });

            function firebaseOn( msg ) {
                  firebase.app.database().ref(config.reference).on("value", function(snapshot) {
                        node.error(snapshot.val());
                        msg.payload = snapshot.val();
                        node.send(msg);
                  });
            }
      }
      RED.nodes.registerType("on", OnFirebase);
}
