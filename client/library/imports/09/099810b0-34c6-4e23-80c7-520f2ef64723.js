cc.Class({
    "extends": cc.Component,
    properties: {
        /*sprites: {
            default: null,
            type: cc.SpriteAtlas
        },*/
        play_method_before: cc.Node, //玩法介绍
        play_method_content_label: cc.Node, //玩法介绍内容
        introduce_pai_before: cc.Node, //牌型介绍
        details: cc.Node, //牌型介绍内容
        caozuo_before: cc.Node, //操作介绍
        caozuo_content: cc.Node, //操作介绍内容
        _btn: null,
        _content: null,
        _buttonCom: null,
        _play_method_button: null,
        _introduce_pai_button: null,
        _caozuo_button: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this._play_method_button = this.play_method_before.getComponent(cc.Button);
        //this._introduce_pai_button = this.introduce_pai_before.getComponent(cc.Button);
        //this._caozuo_button = this.caozuo_before.getComponent(cc.Button);
        //this._btn = [this.play_method_before,this.introduce_pai_before,this.caozuo_before];
        //this._content = [this.play_method_content_label,this.details,this.caozuo_content];
        //this._buttonCom = [this._play_method_button,this._introduce_pai_button,this._caozuo_button];
        ////刚开始牌型介绍的按钮不可用
        //this._buttonCom[1].interactable = false;
    },
    // 点击玩法介绍
    onBtnPlayMethodClick: function onBtnPlayMethodClick() {
        //for(var i=0;i<3;i++){
        //    //所有按钮设置为可用
        //    this._buttonCom[i].interactable = true;
        //    //所有的内容都隐藏掉
        //    this._content[i].active = false;
        //}
        ////当前点击的设置为不可用
        //this._buttonCom[0].interactable = false;
        ////当前点击的对应的内容可见
        this._content[0].active = true;
    },
    //点击牌型介绍
    onBtnIntroducePaiClick: function onBtnIntroducePaiClick() {
        //for(var i=0;i<3;i++){
        //    //所有按钮设置为可用
        //    this._buttonCom[i].interactable = true;
        //    //所有的内容都隐藏掉
        //    this._content[i].active = false;
        //}
        ////当前点击的设置为不可用
        //this._buttonCom[1].interactable = false;
        ////当前点击的对应的内容可见
        //this._content[1].active = true;
    },
    //点击操作介绍
    onBtnCaozuoClick: function onBtnCaozuoClick() {
        //for(var i=0;i<3;i++){
        //    //所有按钮设置为可用
        //    this._buttonCom[i].interactable = true;
        //    //所有的内容都隐藏掉
        //    this._content[i].active = false;
        //}
        ////当前点击的设置为不可用
        //this._buttonCom[2].interactable = false;
        ////当前点击的对应的内容可见
        //this._content[2].active = true;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },