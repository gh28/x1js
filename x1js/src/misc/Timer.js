"use strict";

const Timer = (function() {

    var Timer = newProto();

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
    
    Timer._setInterval = function() {
        this._count = 0;
        this._intervalToken = setInterval(function() {
            if (this._count++ < this._times) {
                this._callback();
            } else {
                this.stop();
            }
        }.bind(this), this._delay);
    };

    Timer._clearInterval = function() {
        clearInterval(this._intervalToken);
        this._intervalToken = null;
    };
    
    Timer.isRunning = function() {
        return !isVoid(this._intervalToken);
    };

    /**
     * delay in milliseconds
     */
    Timer.schedule = function(callback, delay, times) {
        if (this.isRunning()) {
            throw "E: timer is running";
        }

        this._setCallback(callback);
        this._setDelay(delay);
        this._setTimes(times);

        this._setInterval();

        return this;
    };

    Timer.stop = function() {
        if (this.isRunning()) {
            this._clearInterval();
        }
        return this;
    };

    Timer.reschedule = function() {
        if (!isFunction(this._callback) || !isNumber(this._delay) || !isNumber(this._times)) {
            throw "E: timer is not configured";
        }
        this.stop();
        this._setInterval();
        return this;
    };

    return Timer;
})();