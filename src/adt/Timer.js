var Timer = newClass(Object.prototype, null);

Timer._setCallback = function(callback) {
    if (!isFunction(callback)) {
        throw "E: invalid argument: function expected: " + Object.prototype.toString.call(callback);
    }
    this._callback = callback;
};

Timer._setDelay = function(delay) {
    if (!isNumber(delay)) {
        throw "E: invalid argument: number expected: " + Object.prototype.toString.call(delay);
    }
    this._delay = delay;
};

Timer._setTimes = function(times) {
    if (isVoid(times)) {
        times = 1;
    } else if (!isNumber(times)) {
        throw "E: invalid argument: number expected: " + Object.prototype.toString.call(times);
    } else {
        times = Math.floor(times);
    }
    this._times = times;
};

Timer.isRunning = function() {
    return !isVoid(this._intervalToken);
};

Timer.schedule = function(callback, delay, times) {
    this._setCallback(callback);
    this._setDelay(delay);
    this._setTimes(times);

    this._onDelay = function() {
        if (this._count++ < this._times) {
            this._callback();
        } else {
            this.stop();
        }
    }.bind(this);

    this._count = 0;
    this._intervalToken = setInterval(this._onDelay, this._delay);

    return this;
};

Timer.stop = function() {
    if (this.isRunning()) {
        clearInterval(this._intervalToken);
        this._intervalToken = null;
    }
    return this;
};

Timer.reschedule = function() {
    if (!isFunction(this._onDelay) || !isNumber(this._delay) || !isNumber(this._times)) {
        throw "E: timer is not configured";
    }
    this.stop();
    this._count = 0;
    this._intervalToken = setInterval(this._onDelay, this._delay);
    return this;
};
