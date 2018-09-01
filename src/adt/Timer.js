"use strict";

var Timer = newClass(Object.prototype, function() {
    this.merge({
        _callback: null,
        _delay: 0,
        _token: null
    });
});

Timer.setCallback = function(callback) {
    this._callback = callback;
    return this;
};

Timer.setDelay = function(delay) {
    this._delay = delay;
    return this;
};

Timer.start = function(numTimes) {
    if (arguments.length === 0) {
        numTimes = 0;
    }
    assert(isNumber(numTimes) && numTimes >= 0);

    if (this.isRunning()) {
        throw "E: timer is running";
    }

    if (numTimes == 0) {
        this._token = setInterval(this._callback, this._delay);
        return;
    } else if (numTimes > 0) {
        this._token = setInterval(function() {
            this._callback();
            if (--numTimes == 0) {
                this.end();
            }
        }, this._delay);
    }
};

Timer.end = function() {
    if (this.isRunning()) {
        clearInterval(this._token);
        this._token = null;
    }
};

Timer.isRunning = function() {
    return isVoid(this._token);
};
