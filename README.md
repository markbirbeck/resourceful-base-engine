# resourceful-base-engine

A base class for [Resourceful](https://npmjs.org/package/resourceful) engines.

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
      if (res.status === 404){
        res = {};
      } else if (res.status !== 200){
        callback(err, res);
      }
      delete res.status;

      self.put(id, _.extend(res, doc), callback);
    }
  });
};
```

With this core logic in place a new engine would only need to provide the `get` and `put` methods to obtain the `update` functionality.

## License

Copyright 2013 Mark Birbeck

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
