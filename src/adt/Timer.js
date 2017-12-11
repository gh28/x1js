"use strict";

var Timer = createModule(Object.prototype, function() {
    return {
        _callback: null,
        _delay: 0,
        _token: null
    };
});

Timer.setCallback = function(callback) {
    this._callback = callback;
    return this;
};

Timer.setDelay = function(delay) {
    this._delay = delay;
    return this;
};

Timer.start = function(times) {
    var caller = this;
    assert(!!caller._token, "E: Timer running");
    assert(isNull(times) || isNumber(times));
    times = times || 0;
    if (times <= 0) {
        caller._token = setInterval(caller._callback, caller._delay);
    } else {
        caller._token = setInterval(function() {
            caller._callback();
            if (--times === 0) {
                caller.end();
            }
        }, caller._delay);
    }
};

Timer.end = function() {
    var caller = this;
    if (!!caller._token) {
        clearInterval(caller._token);
        caller._token = null;
    }
};
