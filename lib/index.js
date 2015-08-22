
"use strict";

/**
 * Module dependencies.
 */

var _ = require("lodash");
var npm = require('npm');
var Vantage = require('./../../vantage/lib/vantage');
var VantageServer = require("./server");
var VantageClient = require("./client");
var commons = require("./vantage-io-commons");
var temp = require("temp");
var repl = require("vantage-repl");

function VantageIO() {

  var self = this;

  if (!(this instanceof VantageIO)) { return new VantageIO(); }

  Vantage.call(this);

  // Vantage client connects to other instances
  // of Vantage.
  this.client = new VantageClient(this);

  // Vantage server receives connections from
  // other vantages. Activated by vantage.listen();
  this.server = new VantageServer(this);

  this._initIO();

  return this;
}

VantageIO.prototype = Object.create(Vantage.prototype);

/**
 * VantageIO prototype.
 */

var vantageIO = VantageIO.prototype;

_.extend(VantageIO.prototype, {

  _initIO: function() {
    this
      .use(commons)
      .use(repl);
  },

  /**
   * Requires a vantage module / middleware and
   * and `.use`s it. If the module doesn't exist
   * locally, it will NPM install it into a temp
   * directory and then use it.
   *
   * @param {String} key
   * @param {String} value
   * @return {Function}
   * @api private
   */

  _use: function(options, callback) {

    var self = this
      , config
      , registeredCommands = 0
      ;

    options = (_.isString(options))
      ? { module: options }
      : (options || {});

    options = _.defaults(options, {
      loglevel: "silent"
    });

    config = {
      loglevel: options.loglevel,
      production: true
    };

    function registryCounter() {
      registeredCommands++;
    }

    function load(cbk) {
      npm.load(config, function(){
        npm.registry.log.level = config.loglevel;
        npm.commands.install(temp.dir, [options.module], function(err, data){
          if (err) {
            cbk(err, data);
          } else {
            var dir = temp.dir + "/node_modules/" + options.module;
            var mod = require(dir);
            cbk(void 0, mod);
          }
        });
      });
    }

    load(function(err, mod){
      if (err) {
        callback(true, "Error downloading module: " + mod);
      } else {
        self.on("command_registered", registryCounter);
        self.use(mod);
        self.removeListener("command_registered", registryCounter);
        var data = {
          registeredCommands: registeredCommands
        };
        callback(void 0, data);
      }
    });

  }

})

/**
 * Expose `Vantage`.
 */

exports = module.exports = VantageIO;