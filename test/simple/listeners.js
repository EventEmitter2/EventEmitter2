EventEmitter2.prototype.init = function() {
EventEmitter2.prototype.setMaxListeners = function(n) {
EventEmitter2.prototype.delimiter = '.';
EventEmitter2.prototype.verbose = false;
EventEmitter2.prototype.emit = function() {
// EventEmitter.prototype.emit() is also defined there.
EventEmitter2.prototype.on = function(type, listener) {
EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
EventEmitter2.prototype.once = function(type, listener) {
EventEmitter2.prototype.removeListener = function(type, listener) {
EventEmitter2.prototype.removeAllListeners = function(type) {
EventEmitter2.prototype.listeners = function(type) {
