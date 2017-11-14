var KQGlobalEvent = {
    _handles: {},
    //发送事件
    emit: function emit(eventName) {
        var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (typeof data == 'string') {
            data = { 'data': data };
        }

        var returns = []; //返回值
        data.eventName = eventName; //保存一下事件名字

        for (var findEvenName in this._handles) {
            if (findEvenName == eventName) {
                for (var i = 0; i < this._handles[findEvenName].length; i++) {
                    var returnValue = this._handles[findEvenName][i](data);
                    returns.push(returnValue);
                }
            }
        }

        return returns;
    },
    //添加普通事件
    on: function on(eventName, callback, target) {
        // console.log('收到事件', eventName);
        this._handles[eventName] = this._handles[eventName] || [];

        this._handles[eventName].push(callback.bind(target));
        callback._caller = target;
    },

    //通过事件名移除一个监听器
    off: function off(eventName) {
        for (var i = 0; i < this._handles[eventName].length; i++) {
            this._handles[eventName][i] = null;
        }
    },

    // 移动一个 target 上所有的监听
    offTarget: function offTarget(target) {
        for (var name in this._handles) {
            var eventHandlers = this._handles[name];
            var indexs = eventHandlers.filter(function (callback) {
                return callback._caller = target;
            }).map(function (callback, index) {
                return index;
            });

            var indexOffset = 0;
            indexs.forEach(function (index) {
                eventHandlers.splice(index + indexOffset, 1);
                indexOffset = indexOffset + 1;
            });
        }
    }
};

module.exports = KQGlobalEvent;