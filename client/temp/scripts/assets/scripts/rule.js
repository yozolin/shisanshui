"use strict";
cc._RFpush(module, '92f6eNs7RdDRJIRLCZnyulJ', 'rule');
// scripts\rule.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    clickExit: function clickExit() {
        cc.director.loadScene('hall');
    }
});

cc._RFpop();