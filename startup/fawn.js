const mongoose = require('mongoose');
const Fawn = require('fawn');

function fawninit() {
  Fawn.init(mongoose);
}

module.exports = fawninit;
