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
import { QRScanner } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs/Observable';
var QRScannerMock = (function (_super) {
    __extends(QRScannerMock, _super);
    function QRScannerMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Request permission to use QR scanner.
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.prepare = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Call this method to enable scanning. You must then call the `show` method to make the camera preview visible.
     * @return {Observable<string>} returns an Observable that emits the scanned text. Unsubscribe from the observable to stop scanning.
     */
    QRScannerMock.prototype.scan = function () {
        var response;
        return Observable.create(function (observer) {
            observer.next(response);
            observer.complete();
        });
    };
    ;
    /**
     * Configures the native webview to have a transparent background, then sets the background of the <body> and <html> DOM elements to transparent, allowing the webview to re-render with the transparent background.
     * @returns {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.show = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Configures the native webview to be opaque with a white background, covering the video preview.
     * @returns {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.hide = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Enable the device's light (for scanning in low-light environments).
     * @returns {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.enableLight = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Disable the device's light.
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.disableLight = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Use front camera
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.useFrontCamera = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Use back camera
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.useBackCamera = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Set camera to be used.
     * @param camera {number} Provide `0` for back camera, and `1` for front camera.
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.useCamera = function (camera) {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Pauses the video preview on the current frame and pauses scanning.
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.pausePreview = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Resumse the video preview and resumes scanning.
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.resumePreview = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Returns permission status
     * @return {Promise<QRScannerStatus>}
     */
    QRScannerMock.prototype.getStatus = function () {
        var response;
        return new Promise(function (resolve, reject) {
            resolve(response);
        });
    };
    ;
    /**
     * Opens settings to edit app permissions.
     */
    QRScannerMock.prototype.openSettings = function () { };
    ;
    return QRScannerMock;
}(QRScanner));
export { QRScannerMock };
//# sourceMappingURL=index.js.map