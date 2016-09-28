module.exports = function (RED) {
    'use strict';

    var Ivona = require('ivona-node');
    var slug = require('slug');
    var fs = require('fs');
    var path = require('path');
    var exec = require('child_process').exec;

    function isDirSync(aPath) {
        try {
            return fs.statSync(aPath).isDirectory();
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    }

    function checkIfFile(file, cb) {
        fs.stat(file, function fsStat(err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return cb(null, false);
                } else {
                    return cb(err);
                }
            }
            return cb(null, stats.isFile());
        });
    }

    function playFile(filePath) {
        exec(filePath, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log('Reply from exec!!');
        });
    }

    var voices = {
        '0': { gender: 'Female', lang: 'en-US', name: 'Salli' },
        '1': { gender: 'Male', lang: 'en-US', name: 'Joey' },
        '2': { gender: 'Female', lang: 'da-DK', name: 'Naja' },
        '3': { gender: 'Male', lang: 'da-DK', name: 'Mads' },
        '4': { gender: 'Female', lang: 'de-DE', name: 'Marlene' },
        '5': { gender: 'Male', lang: 'de-DE', name: 'Hans' },
        '6': { gender: 'Female', lang: 'en-AU', name: 'Nicole' },
        '7': { gender: 'Male', lang: 'en-AU', name: 'Russell' },
        '8': { gender: 'Female', lang: 'en-GB', name: 'Amy' },
        '9': { gender: 'Male', lang: 'en-GB', name: 'Brian' },
        '10': { gender: 'Female', lang: 'en-GB', name: 'Emma' },
        '11': { gender: 'Female', lang: 'en-GB-WLS', name: 'Gwyneth' },
        '12': { gender: 'Male', lang: 'en-GB-WLS', name: 'Geraint' },
        '13': { gender: 'Female', lang: 'cy-GB', name: 'Gwyneth' },
        '14': { gender: 'Male', lang: 'cy-GB', name: 'Geraint' },
        '15': { gender: 'Female', lang: 'en-IN', name: 'Raveena' },
        '16': { gender: 'Male', lang: 'en-US', name: 'Chipmunk' },
        '17': { gender: 'Male', lang: 'en-US', name: 'Eric' },
        '18': { gender: 'Female', lang: 'en-US', name: 'Ivy' },
        '19': { gender: 'Female', lang: 'en-US', name: 'Jennifer' },
        '20': { gender: 'Male', lang: 'en-US', name: 'Justin' },
        '21': { gender: 'Female', lang: 'en-US', name: 'Kendra' },
        '22': { gender: 'Female', lang: 'en-US', name: 'Kimberly' },
        '23': { gender: 'Female', lang: 'es-ES', name: 'Conchita' },
        '24': { gender: 'Male', lang: 'es-ES', name: 'Enrique' },
        '25': { gender: 'Female', lang: 'es-US', name: 'Penelope' },
        '26': { gender: 'Male', lang: 'es-US', name: 'Miguel' },
        '27': { gender: 'Female', lang: 'fr-CA', name: 'Chantal' },
        '28': { gender: 'Female', lang: 'fr-FR', name: 'Celine' },
        '29': { gender: 'Male', lang: 'fr-FR', name: 'Mathieu' },
        '30': { gender: 'Female', lang: 'is-IS', name: 'Dora' },
        '31': { gender: 'Male', lang: 'is-IS', name: 'Karl' },
        '32': { gender: 'Female', lang: 'it-IT', name: 'Carla' },
        '33': { gender: 'Male', lang: 'it-IT', name: 'Giorgio' },
        '34': { gender: 'Female', lang: 'nb-NO', name: 'Liv' },
        '35': { gender: 'Female', lang: 'nl-NL', name: 'Lotte' },
        '36': { gender: 'Male', lang: 'nl-NL', name: 'Ruben' },
        '37': { gender: 'Female', lang: 'pl-PL', name: 'Agnieszka' },
        '38': { gender: 'Male', lang: 'pl-PL', name: 'Jacek' },
        '39': { gender: 'Female', lang: 'pl-PL', name: 'Ewa' },
        '40': { gender: 'Male', lang: 'pl-PL', name: 'Jan' },
        '41': { gender: 'Female', lang: 'pl-PL', name: 'Maja' },
        '42': { gender: 'Female', lang: 'pt-BR', name: 'Vitoria' },
        '43': { gender: 'Male', lang: 'pt-BR', name: 'Ricardo' },
        '44': { gender: 'Male', lang: 'pt-PT', name: 'Cristiano' },
        '45': { gender: 'Female', lang: 'pt-PT', name: 'Ines' },
        '46': { gender: 'Female', lang: 'ro-RO', name: 'Carmen' },
        '47': { gender: 'Male', lang: 'ru-RU', name: 'Maxim' },
        '48': { gender: 'Female', lang: 'ru-RU', name: 'Tatyana' },
        '49': { gender: 'Female', lang: 'sv-SE', name: 'Astrid' },
        '50': { gender: 'Female', lang: 'tr-TR', name: 'Filiz' }
    };

    function IvonaConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.ivona = new Ivona({
            accessKey: config.accessKey,
            secretKey: config.secretKey
        });
    }

    RED.nodes.registerType('ivona-config', IvonaConfigNode);

    function IvonaNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.voice = voices[config.voiceKey];
        this.dir = config.dir;
        if (!isDirSync(this.dir)) {
            this.error(RED._('The directory "' + this.dir + '" does not exist'));
            return;
        }
        this.config = RED.nodes.getNode(config.config);
        if (!this.config) {
            this.error(RED._('Missing Ivona config'));
            return;
        }

        this.on('input', function (msg) {

            msg._ivona = {
                cached: true, roundtrip: 0
            };

            msg.file = path.join(node.dir, slug(msg.payload) + '.mp3');

            checkIfFile(msg.file, function (err, isFile) {
                if (isFile) {
                    playFile(msg.file);
                    return node.send([msg, null]);
                }

                try {

                    console.log('Getting File From Server!!');

                    var writeStream = fs.createWriteStream(msg.file);

                    node.status({ fill: 'yellow', shape: 'dot', text: 'requesting' });
                    msg._ivona.cached = false;
                    var started = Date.now();
                    node.config.ivona.createVoice(msg.payload, {
                        body: { voice: node.voice }
                    }).on('error', function (err) {
                        console.log('Error while Getting File From Server!!');
                        node.error(RED._(err.message));
                        msg.error = err.message;
                        node.send([null, msg]);
                        node.status({});
                    }).on('end', function () {
                        console.log('Retrieved file successfully From Server!!');
                        msg._ivona.roundtrip = Date.now() - started;
                        node.send([msg, null]);
                        node.status({});
                    }).pipe(writeStream);

                } catch (err) {
                    node.error(RED._(err.message));
                    msg.error = err.message;
                    node.send([null, msg]);
                }

            });
        });

    }

    RED.nodes.registerType('ivona', IvonaNode);
};