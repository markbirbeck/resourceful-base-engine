'use strict';

/**
 * For more information see:
 *
 *  https://github.com/flatiron/resourceful/wiki/Engine-Constructor
 */

var util = require('util')
  , resourceful = null
  , _ = require('underscore');

var register = exports.register = function register(resourcefulLib, engineName,
    engine){
  resourceful = resourcefulLib;
  resourceful.engines[engineName] = engine;
};

exports.init = function init(resourcefulLib){
  register(resourcefulLib, 'BaseEngine', BaseEngine);
};

var BaseEngine = exports.BaseEngine = function BaseEngine(config) {
  if (!config || !config.uri) {
    throw new Error('The uri property is required');
  }

  this.resourceful = resourceful;

  /**
   * Specify the part of the object to return or null for the root:
   */

  this.childNode = config.childNode;

  /**
   * If there's a content type then store that too:
   */

  this.contentType = config.contentType || 'application/json';

  /**
   * Store the base URI with a trailing slash including the prefix if any:
   */

  if (config.uri){
    this.uri = (config.prefix || '') + config.uri.replace(/\/$/, '') + '/';
  }

  /**
   * Create a cache courtesy of resourceful:
   */

  this.cache = new this.resourceful.Cache();

  /**
   * Finally, set the protocol:
   */

  this.protocol = config.protocol || 'baseengine';
};


/**
 * Engine Instance Methods:
 */

[
  'all'
, 'create'
, 'destroy'
, 'get'
, 'head'
, 'filter'
, 'find'
, 'load'
, 'new'
, 'post'
, 'put'
, 'request'
, 'save'
, 'sync'
, 'update'
].forEach(function(eim) {
  BaseEngine.prototype[eim] = function() {
    throw new Error(util.format('Method %s is not available for engine %s',
      eim, this.protocol));
  };
});


/**
 * L O W   L E V E L   M E T H O D S
 * =================================
 */

/**
 * This will be called with at least a method, id and callback,
 * but also possibly with a document to store:
 */

BaseEngine.prototype.request = function(method, id, doc, callback) {
  var body = null
    , err = null
    , url;

  switch (method) {
  case 'del':
    url = this.uri + id;
    err = new Error('No delete method.');
    body = { status: 500 };
    break;

  case 'get':
    url = this.uri + id;
    err = new Error('No get method.');
    body = { status: 404 };
    break;

  case 'head':
    url = this.uri + id;
    err = new Error('No head method.');
    body = { status: 404 };
    break;

  case 'post':
    url = this.uri + this.resourceful.pluralize(doc.resource.toLowerCase());
    err = new Error('No post method.');
    body = { status: 500 };
    break;

  case 'put':
    url = this.uri + id;
    err = new Error('No put method.');
    body = { status: 500 };
    break;

  default:
    err = new Error(util.format('No %s handler', method));
    break;
  }

  return callback(err, body);
};


/**
 * Get a resource:
 */

BaseEngine.prototype.get = function(id, callback) {
  return this.request('get', id, null, function(err, res){
    if (err){
      callback(err);
    } else {
      if (res && !res._id){
        res._id = id;
      }
      callback(null, res);
    }
  });
};


/**
 * Check if a resource exists:
 */

BaseEngine.prototype.head = function(id, callback) {
  console.log('In proper head function');
  return this.request('head', id, null, callback);
};


/**
 * Overwrite an existing resource:
 */

BaseEngine.prototype.put = function (id, doc, callback){
  return this.request('put', id, doc, function (err, res){
    if (err) {
      callback(err);
    } else {
      callback(null, _.extend({ 'status': 201 }, res));
    }
  });
};


/**
 * Create a new resource:
 */

BaseEngine.prototype.post = function (doc, callback){
  console.log('In proper post function');
  return this.request('post', null, doc, function (err, res){
    if (err) {
      callback(err);
    } else {
      callback(null, _.extend({ 'status': 201 }, res));
    }
  });
};


/**
 * H I G H   L E V E L   M E T H O D S
 */


/**
 * Save a resource:
 */

BaseEngine.prototype.save = function(id, doc, callback) {

  /**
   * If there's an id value then do a put, otherwise shift the
   * parameters and do a post:
   */

  if (callback) {
    this.put(id, doc, function(err, res){
      if (res && res.status !== 201){
        callback(new Error('Failed to put document: ' + id));
      } else {
        callback(err, res);
      }
    });
  } else {
    callback = doc;
    doc = id;
    this.post(doc, callback);
  }
};


/**
 * Update a resource:
 */

BaseEngine.prototype.update = function(id, doc, callback) {
  var self = this;

  /**
   * If the resource exists it's modified, otherwise a new
   * one is created:
   */

  self.get(id, function(err, res){

    if (err){
      callback(err);
    } else {
      if (res.status === 404){
        res = {status: 200};
      }
      if (res.status === 200){
        delete res.status;

        self.put(id, _.extend(res, doc), callback);
      } else {
        callback(err, res);
      }
    }
  });
};


/**
 * Destroy a resource:
 */

BaseEngine.prototype.destroy = function(id, callback) {
  return this.request('del', id, null, function(err, res) {
    if (err || (res && res.status !== 204)){
      callback(err, { 'status': res.status });
    } else {
      callback(null, _.extend({ 'status': 204 }, res));
    }
  });
};


/**
 * Load a list of resources:
 */

BaseEngine.prototype.load = function(/* id, callback */) {
  console.log('In proper load function');
};


/**
 * Add any needed aliases:
 */

BaseEngine.prototype.create = BaseEngine.prototype.post;
