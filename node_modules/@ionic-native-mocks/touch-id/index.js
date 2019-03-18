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
import { TouchID } from '@ionic-native/touch-id';
var TouchIDMock = (function (_super) {
    __extends(TouchIDMock, _super);
    function TouchIDMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks Whether TouchID is available or not.
     *
     * @returns {Promise<any>} Returns a Promise that resolves if yes, rejects if no.
     */
    TouchIDMock.prototype.isAvailable = function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    /**
     * Show TouchID dialog and wait for a fingerprint scan. If user taps 'Enter Password' button, brings up standard system passcode screen.
     *
     * @param {string} message  The message to display
     * @returns {Promise<any>} Returns a Promise the resolves if the fingerprint scan was successful, rejects with an error code (see above).
     */
    TouchIDMock.prototype.verifyFingerprint = function (message) {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    /**
     * Show TouchID dialog and wait for a fingerprint scan. If user taps 'Enter Password' button, rejects with code '-3' (see above).
     *
     * @param {string} message  The message to display
     * @returns {Promise<any>} Returns a Promise the resolves if the fingerprint scan was successful, rejects with an error code (see above).
     */
    TouchIDMock.prototype.verifyFingerprintWithCustomPasswordFallback = function (message) {
        return new Promise(function (resolve, reject) {
            resolve(true);
        });
    };
    ;
    /**
     * Show TouchID dialog with custom 'Enter Password' message and wait for a fingerprint scan. If user taps 'Enter Password' button, rejects with code '-3' (see above).
     *
     * @param {string} message  The message to display
     * @param {string} enterPasswordLabel  Custom text for the 'Enter Password' button
     * @returns {Promise<any>} Returns a Promise the resolves if the fingerprint scan was successful, rejects with an error code (see above).
     */
    TouchIDMock.prototype.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel = function (message, enterPasswordLabel) {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    /**
     * Checks if the fingerprint database changed.
     *
     * @returns {Promise<any>} Returns a Promise that resolves if yes, rejects if no.
     */
    TouchIDMock.prototype.didFingerprintDatabaseChange = function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ;
    return TouchIDMock;
}(TouchID));
export { TouchIDMock };
//# sourceMappingURL=index.js.map