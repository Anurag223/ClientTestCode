"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MateoQueue = /** @class */ (function () {
    function MateoQueue(_apiurl) {
        this.apiurl = _apiurl;
        this.retryCount = 1;
        this.status = MateoQueueStatus.INITIALIZED;
        this.requestType = MateoQueueType.GET;
    }
    Object.defineProperty(MateoQueue.prototype, "isValid", {
        get: function () {
            var validity = true;
            var messages = [];
            if (!(this.apiurl && this.apiurl.length > 0)) {
                messages.push('API url not set.');
            }
            if (!this.callbackSubject) {
                messages.push('Callback subject not set.');
            }
            if (!this.errorCallbackSubject) {
                messages.push(' Error callback subject not set.');
            }
            if (!this.processStatusFnRef) {
                messages.push(' Status Check Function not set.');
            }
            validity = messages.length === 0;
            this.validationMessages = validity ? [] : ["ERROR!! Invalid Mateo Queue for " + this.apiurl + "."].concat(messages);
            return validity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MateoQueue.prototype, "HasToProcess", {
        get: function () {
            return this.status && (this.status === MateoQueueStatus.QUEUED
                || this.status === MateoQueueStatus.INPROGRESS
                || this.status === MateoQueueStatus.POLLING
                || this.status === MateoQueueStatus.INITIALIZED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MateoQueue.prototype, "HasFailed", {
        get: function () {
            return this.status && this.status === MateoQueueStatus.FAILED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MateoQueue.prototype, "HasSucceded", {
        get: function () {
            return this.status && this.status === MateoQueueStatus.SUCCESS;
        },
        enumerable: true,
        configurable: true
    });
    return MateoQueue;
}());
exports.MateoQueue = MateoQueue;
var MateoQueueStatus;
(function (MateoQueueStatus) {
    MateoQueueStatus[MateoQueueStatus["INITIALIZED"] = 1] = "INITIALIZED";
    MateoQueueStatus[MateoQueueStatus["QUEUED"] = 2] = "QUEUED";
    MateoQueueStatus[MateoQueueStatus["INPROGRESS"] = 3] = "INPROGRESS";
    MateoQueueStatus[MateoQueueStatus["POLLING"] = 4] = "POLLING";
    MateoQueueStatus[MateoQueueStatus["SUCCESS"] = 5] = "SUCCESS";
    MateoQueueStatus[MateoQueueStatus["FAILED"] = 6] = "FAILED";
})(MateoQueueStatus = exports.MateoQueueStatus || (exports.MateoQueueStatus = {}));
var MateoQueueType;
(function (MateoQueueType) {
    MateoQueueType["GET"] = "GET";
    MateoQueueType["PATCH"] = "PATCH";
})(MateoQueueType = exports.MateoQueueType || (exports.MateoQueueType = {}));
//# sourceMappingURL=mateoQueue.js.map