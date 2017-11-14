"use strict";
cc._RFpush(module, 'b8a30Txa91I27+7HOFLyJA6', 'hall_btn_anima');
// scripts\hall_btn_anima.js

cc.Class({
    "extends": cc.Component,

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
        create_anima: {
            type: cc.SpriteFrame,
            "default": []
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();