module.exports = function(Actor) {
  Actor.prototype.greet = function(cb) {
    cb(null, 'Hello world from ' + this.name);
  };
};
