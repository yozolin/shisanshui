(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/overTime.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '48748u5hxdOD4WTPWQqSQwN', 'overTime', __filename);
// scripts/overTime.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        nodes: [cc.Node],
        //selectedIndex: 0,
        _selected: 1
    },

    /*####*/
    onLoad: function onLoad() {
        var self = this;
        this._select = true;
        var overTime = 0;
        if (cc.set) {
            overTime = cc.set.setting6;
            this._selected = this._select = overTime;
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var active = this._select;
            this._selected = this._select;
            this.nodes[i].getComponent('select').setSelected(active);
            var title = this.nodes[i].getChildByName('title');
            if (self._select) {
                title.color = new cc.Color(13, 210, 222);
            } else {
                title.color = new cc.Color(255, 255, 255);
            }
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function () {
                this.setSelected(self._selected = self._select = !self._select);
                var title = this.node.getChildByName("title");
                if (self._select) {
                    title.color = new cc.Color(13, 210, 222);
                } else {
                    title.color = new cc.Color(255, 255, 255);
                }
                self.onSelectChange(this.index);
            };
        }
        if (this.node._name == "orders" && cc.set) {
            //this.remember_set(overTime);
        }
    },
    remember_set: function remember_set(obj) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].getComponent('select').setSelected(obj);
            this.nodes[i].getChildByName('title').color = new cc.Color(255, 255, 255);
            if (obj) {
                var title = this.nodes[0].getChildByName('title');
                title.color = new cc.Color(13, 210, 222);
            }
        }
    },

    onSelectChange: function onSelectChange(selectIndex) {
        //cc.log(selectIndex);
    }

});

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
        //# sourceMappingURL=overTime.js.map
        