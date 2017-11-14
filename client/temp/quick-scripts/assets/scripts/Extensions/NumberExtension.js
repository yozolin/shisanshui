(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Extensions/NumberExtension.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '80e21gZRpNM4pIiCpZ+7s8m', 'NumberExtension', __filename);
// scripts/Extensions/NumberExtension.js

"use strict";

// number.kq_times(f)   调用多次


if (!Number.prototype.kq_times) {

    /**
     * 调用一个方法 this 次
     * 
     * @param  {Function} f 要调用的方法
     * @param  {Object}   thisArg   可选； f 的 this值
     */
    Number.prototype.kq_times = function (f, thisArg) {
        if (!f) {
            return;
        }

        for (var i = 0; i < this; ++i) {
            if (thisArg) {
                f.apply(thisArg, i);
            } else {
                f(i);
            }
        }
    };
}

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
        //# sourceMappingURL=NumberExtension.js.map
        