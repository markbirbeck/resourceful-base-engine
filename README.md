# resourceful-base-engine

A base class for [Resourceful](https://npmjs.org/package/resourceful) engines.

[![wercker status](https://app.wercker.com/status/b05e475c7e358d1e3c7e5b3395aa683e/m/master "wercker status")](https://app.wercker.com/project/bykey/b05e475c7e358d1e3c7e5b3395aa683e)

## Engines Using This Module

* [resourceful-rest](https://npmjs.org/package/resourceful-rest)
* [resourceful-s3](https://npmjs.org/package/resourceful-s3)
* [resourceful-simpledb](https://npmjs.org/package/resourceful-simpledb)

## Motivation

The idea is to keep factoring as much as possible into the base so that actual engines are very lightweight.

For example, the update method checks to see whether a resource exists, and if it does, the fields to be added get merged with the existing record which then gets overwritten. And of course if the record doesn't exist then a new entry is created. Since this logic would apply to pretty much any engine we want to factor it into the base engine:

```javascript
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
      if (!res || res.status === 404){
        res = {};
      } else if (res.status && res.status !== 200){
        delete res.status;

        self.put(id, _.extend(res, doc), callback);
      }
        callback(err, res);
    }
  });
};
```

With this core logic in place a new engine would only need to provide the `get` and `put` methods to obtain the `update` functionality.

## License

Copyright 2013-4 Mark Birbeck

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
