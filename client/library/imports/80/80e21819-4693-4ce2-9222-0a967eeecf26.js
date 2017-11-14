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