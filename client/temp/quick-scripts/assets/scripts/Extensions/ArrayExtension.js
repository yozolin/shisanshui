(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Extensions/ArrayExtension.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4fd85NSsFJLd4qHrH0UjHzl', 'ArrayExtension', __filename);
// scripts/Extensions/ArrayExtension.js

'use strict';

// 给 Array 添加方法
// arr.find(...)
// arr.findIndex(...)
// arr.includes(e)
// arr.unique(equalFunction, isNewArray)
// Array.from
// Array.equal
// arr.isEqual(otherArray, isStrict)
// Array.sortByNumber
// arr.findSubArrayIndexs([])   用于查找数组内的部分元素的索引
// arr.translationWithStartIndex(startIndex) 将数组内的元素平移
// 如：[1, 2, 3, 4, 5].translationWithStartIndex(3) => [4,5,1,2,3]
// arr.kq_insert(index, e)   插入一个元素
// arr.kq_excludes(array)   // 除了array数组中的元素


module.exports = {};

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    enumerable: false,
    value: function value(searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        // NOTE: === provides the correct "SameValueZero" comparison needed here.
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

// unique
if (!Array.prototype.unique) {
  Object.defineProperty(Array.prototype, 'unique', {
    enumerable: false,
    value: function value(equalFunction) {
      var newArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (newArray) {
        return this._unqiue_new(equalFunction);
      }

      return this._unqiue(equalFunction);
    }
  });

  Object.defineProperty(Array.prototype, '_unqiue_new', {
    enumerable: false,
    value: function value(equalFunction) {
      var array = Array.from(this);

      return array._unqiue(equalFunction);
    }
  });

  Object.defineProperty(Array.prototype, '_unqiue', {
    enumerable: false,
    value: function value(equalFunction) {
      var len = this.length;
      var i = -1;

      while (i++ < len) {
        var j = i + 1;

        for (; j < this.length; ++j) {
          var isEqual = false;
          if (equalFunction) {
            isEqual = equalFunction(this[i], this[j]);
          } else {
            isEqual = this[i] === this[j];
          }

          if (isEqual) {
            this.splice(j--, 1);
          }
        }
      }
      return this;
    }
  });
}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }();
}

if (!Array.equal) {
  Array.equal = function (arr1, arr2) {
    var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (arr1 === undefined || arr2 === undefined) {
      return false;
    }

    var length = arr1.length;
    if (length !== arr2.length) return false;
    for (var i = 0; i < length; i++) {
      if (strict) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      } else {
        var value1 = arr1[i];
        var value2 = arr2[i];
        var result = true;
        if (Array.isArray(value1) && Array.isArray(value2)) {
          result = Array.equal(value1, value2, strict);
        } else {
          result = value1 == value2;
        }
      }
    }

    return true;
  };
}

if (!Array.prototype.isEqual) {
  Object.defineProperty(Array.prototype, 'isEqual', {
    enumerable: false,
    value: function value(otherArray) {
      var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return Array.equal(this, otherArray, strict);
    }
  });
}

if (!Array.sortByNumber) {
  Array.sortByNumber = function (n1, n2) {
    var asc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    return (n1 - n2) * (asc ? 1 : -1);
  };
}

if (!Array.prototype.findSubArrayIndexs) {
  Object.defineProperty(Array.prototype, 'findSubArrayIndexs', {
    enumerable: false,
    value: function value(subArray, f) {
      var _this = this;

      var indexs = [];

      var _loop = function _loop() {
        var subValue = subArray[i];
        var findFunc = f || function (thisValue) {
          return subValue === thisValue;
        };
        var index = _this.findIndex(findFunc);
        if (index >= 0) {
          indexs.push(index);
        } else {
          indexs = [];
          return 'break';
        }
      };

      for (var i in subArray) {
        var _ret = _loop();

        if (_ret === 'break') break;
      }

      return indexs.length > 0 ? indexs : null;
    }
  });
}

if (!Array.prototype.translationWithStartIndex) {
  Object.defineProperty(Array.prototype, 'translationWithStartIndex', {
    enumerable: false,
    value: function value(startIndex) {
      if (startIndex == 0) {
        return this;
      }

      if (startIndex >= this.length) {
        return this;
      }

      var pre = this.slice(startIndex);
      var last = this.slice(0, startIndex);
      var result = pre.concat(last);

      return result;
    }
  });
}

if (!Array.prototype.kq_insert) {
  Object.defineProperty(Array.prototype, 'kq_insert', {
    enumerable: false,
    value: function value(index, e) {
      if (e == null) {
        return this;
      }

      if (index >= this.length) {
        this.push(e);
        return;
      }

      this.splice(index, 0, e);

      return this;
    }
  });
}

if (!Array.prototype.kq_excludes) {
  Object.defineProperty(Array.prototype, 'kq_excludes', {
    enumerable: false,
    value: function value(otherArray) {
      if (otherArray == null) {
        return this;
      }

      var result = [];
      this.forEach(function (element) {
        if (!otherArray.includes(element)) {
          result.push(element);
        }
      });

      return result;
    }
  });
}

/*
if(!Array.prototype.min){
  Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
      if (this[i] < min) {
        min = this[i];
      }
    }
    return min;
  }
}*/

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ArrayExtension.js.map
        