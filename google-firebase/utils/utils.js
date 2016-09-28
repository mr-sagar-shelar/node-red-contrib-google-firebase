var _ = require('lodash-node');
var moment = require('moment');

exports.getTime = function () {
  return moment().format("HH:mm");
};

exports.getNotificationTime = function () {
  return moment().format('MMMM Do YYYY, h:mm:ss a');
}; 