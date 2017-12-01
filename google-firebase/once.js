module.exports = function(RED) {
      function OnceFirebase(config) {
            RED.nodes.createNode(this, config);
            var node = this;
            var firebase = RED.nodes.getNode(config.firebase);

            node.error(config.reference);

            node.on('input', function(msg) {
                  firebaseOnce( msg );
            });

            function firebaseOnce( msg ) {
                  var db =  firebase.app.database();
                  var ref = db.ref(config.reference);

                  ref.once("value", function(snapshot) {
                        node.error(snapshot.val());
                        msg.payload = snapshot.val();
                        node.send(msg);
                  });
            }
      }
      RED.nodes.registerType("once", OnceFirebase);
}
