var assert = require("assert")
  , should = require('should')
  , Vantage = require('../../')
  , http = require('http')
  , _ = require('lodash')
  , chalk = require("chalk")
  ;

module.exports = function(vantage) {

  vantage
    .command('foo')
    .description('Should return "bar".')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){
        self.log('bar');
        resolve();
      });
    });

  vantage
    .command("fuzzy")
    .description("Should return 'wuzzy'.")
    .action(function(args, cb) {
      var self = this;
      return new Promise(function(resolve, reject){
        self.log("wuzzy");
        resolve();
      });
    });

  vantage
    .command('optional [arg]')
    .description('Should optionally return an arg.')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){
        self.log(args.arg || '');
        resolve();
      });
    });

  vantage
    .command('variadic [pizza] [ingredients...]')
    .description('Should optionally return an arg.')
    .option('-e, --extra', 'Extra complexity on the place.')
    .action(function(args, cb){
      var self = this;
      cb(void 0, args);
    });

  vantage
    .command('cmd [with] [one] [million] [arguments] [in] [it]')
    .description('Should deal with many args.')
    .option('-e, --extra', 'Extra complexity on the place.')
    .action(function(args, cb){
      var self = this;
      cb(void 0, args);
    });

  vantage
    .command('variadic-pizza [ingredients...]')
    .description('Should optionally return an arg.')
    .option('-e, --extra', 'Extra complexity on the place.')
    .action(function(args, cb){
      var self = this;
      cb(void 0, args);
    });

  vantage
    .command('port')
    .description('Returns port.')
    .action(function(args, cb){
      this.log(this.server._port);
      cb(void 0, this.parent.server._port);
    });

  vantage
    .command('i want')
    .description('Negative args.')
    .option('-N, --no-cheese', 'No chease please.')
    .action(function(args, cb){
      this.log(args.options.cheese);
      cb();
    });

  vantage
    .command('required <arg>')
    .description('Must return an arg.')
    .action(function(args, cb){
      var self = this;
      self.log(args.arg);
      cb(void 0, args);
    });


  vantage
    .command('fail me <arg>')
    .description('Must return an arg.')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){
        if (args.arg == 'not') {
          resolve('we are happy');
        } else {
          reject('we are not happy.');
        }
      });
    });

  vantage
    .command('deep command [arg]')
    .description('Tests execution of deep command.')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){
        self.log(args.arg);
        resolve();
      });
    });

  vantage
    .command('very deep command [arg]')
    .description('Tests execution of three-deep command.')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){
        self.log(args.arg);
        resolve();
      });
    });

  vantage
    .command('count <number>')
    .description('Tests execution of three-deep command.')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){
        self.log(args.number);
        resolve();
      });
    });

  vantage
    .command('very complicated deep command [arg]')
    .option('-r', 'Test Option.')
    .option('-a', 'Test Option.')
    .option('-d', 'Test Option.')
    .option('-s, --sleep', 'Test Option.')
    .option('-t', 'Test Option.')
    .option('-i [param]', 'Test Option.')
    .description('Tests execution of three-deep command.')
    .action(function(args, cb){
      var self = this;
      return new Promise(function(resolve, reject){

        var str = '';
        str = (args.options.r === true) ? str + 'r' : str;
        str = (args.options.a === true) ? str + 'a' : str;
        str = (args.options.d === true) ? str + 'd' : str;
        str = (args.options.t === true) ? str + 't' : str;
        str = (args.options.i === 'j') ? str + args.options.i : str;
        str = (args.options.sleep === 'well') ? str + args.options.sleep : str;
        str = str + (args.arg || '');

        self.log(str);
        resolve();
      });
    });

}

