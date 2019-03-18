var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { FCM } from '@ionic-native/fcm';
import { Observable } from 'rxjs/Observable';
var FCMMock = (function (_super) {
    __extends(FCMMock, _super);
    function FCMMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get's device's current registration id
     *
     * @returns {Promise<string>} Returns a Promise that resolves with the registration id token
     */
    FCMMock.prototype.getToken = function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    /**
     * Event firing on the token refresh
     *
     * @returns {Observable<string>} Returns an Observable that notifies with the change of device's registration id
     */
    FCMMock.prototype.onTokenRefresh = function () {
        var response;
        return Observable.create(function (observer) {
            observer.next(response);
            observer.complete();
        });
    };
    ;
    /**
     * Subscribes you to a [topic](https://firebase.google.com/docs/notifications/android/console-topics)
     *
     * @param {string} topic Topic to be subscribed to
     *
     * @returns {Promise<any>} Returns a promise resolving in result of subscribing to a topic
     */
    FCMMock.prototype.subscribeToTopic = function (topic) {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    /**
     * Unubscribes you from a [topic](https://firebase.google.com/docs/notifications/android/console-topics)
     *
     * @param {string} topic Topic to be unsubscribed from
     *
     * @returns {Promise<any>} Returns a promise resolving in result of unsubscribing from a topic
     */
    FCMMock.prototype.unsubscribeFromTopic = function (topic) {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    /**
     * Watch for incoming notifications
     *
     * @returns {Observable<any>} returns an object with data from the notification
     */
    FCMMock.prototype.onNotification = function () {
        var response;
        return Observable.create(function (observer) {
            observer.next(response);
            observer.complete();
        });
    };
    ;
    return FCMMock;
}(FCM));
export { FCMMock };
//# sourceMappingURL=index.js.map