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
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
var AndroidFingerprintAuthMock = (function (_super) {
    __extends(AndroidFingerprintAuthMock, _super);
    function AndroidFingerprintAuthMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Opens a native dialog fragment to use the device hardware fingerprint scanner to authenticate against fingerprints registered for the device.
     * @param options {AFAAuthOptions} Options
     * @returns {Promise<any>}
     */
    AndroidFingerprintAuthMock.prototype.encrypt = function (options) {
        var reponse;
        return new Promise(function (resolve, reject) {
            resolve(reponse);
        });
    };
    ;
    /**
     * Opens a native dialog fragment to use the device hardware fingerprint scanner to authenticate against fingerprints registered for the device.
     * @param options {AFAAuthOptions} Options
     * @returns {Promise<any>}
     */
    AndroidFingerprintAuthMock.prototype.decrypt = function (options) {
        var reponse;
        return new Promise(function (resolve, reject) {
            resolve(reponse);
        });
    };
    ;
    /**
     * Check if service is available
     * @returns {Promise<any>} Returns a Promise that resolves if fingerprint auth is available on the device
     */
    AndroidFingerprintAuthMock.prototype.isAvailable = function () {
        var reponse = { isAvailable: true, isHardwareDetected: true, hasEnrolledFingerprints: true };
        return new Promise(function (resolve, reject) {
            resolve(reponse);
        });
    };
    ;
    /**
     * Delete the cipher used for encryption and decryption by username
     * @returns {Promise<any>} Returns a Promise that resolves if the cipher was successfully deleted
     */
    AndroidFingerprintAuthMock.prototype.delete = function (options) {
        var reponse;
        return new Promise(function (resolve, reject) {
            resolve(reponse);
        });
    };
    ;
    return AndroidFingerprintAuthMock;
}(AndroidFingerprintAuth));
export { AndroidFingerprintAuthMock };
//# sourceMappingURL=index.js.map