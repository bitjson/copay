import { __awaiter } from 'tslib';
import { BinaryBitmap, ChecksumException, FormatException, HTMLCanvasElementLuminanceSource, HybridBinarizer, NotFoundException, MultiFormatReader, BarcodeFormat, QRCodeReader } from '@zxing/library';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Based on zxing-typescript BrowserCodeReader
 */
class BrowserCodeReader {
    /**
     * Constructor for dependency injection.
     *
     * @param {?} reader The barcode reader to be used to decode the stream.
     * @param {?=} timeBetweenScans The scan throttling in milliseconds.
     */
    constructor(reader, timeBetweenScans = 500) {
        this.reader = reader;
        this.timeBetweenScans = timeBetweenScans;
        /**
         * Shows if torch is available on the camera.
         */
        this.torchCompatible = new BehaviorSubject(false);
    }
    /**
     * Starts the decoding from the current or a new video element.
     *
     * \@todo Return Promise<Result>
     * @param {?=} callbackFn The callback to be executed after every scan attempt
     * @param {?=} deviceId The device's to be used Id
     * @param {?=} videoElement A new video element
     *
     * @return {?}
     */
    decodeFromInputVideoDevice(callbackFn, deviceId, videoElement) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reset();
            this.prepareVideoElement(videoElement);
            // Keeps the deviceId between scanner resets.
            if (typeof deviceId !== 'undefined') {
                this.deviceId = deviceId;
            }
            const /** @type {?} */ video = typeof deviceId === 'undefined'
                ? { facingMode: { exact: 'environment' } }
                : { deviceId: { exact: deviceId } };
            const /** @type {?} */ constraints = {
                audio: false,
                video
            };
            if (typeof navigator === 'undefined') {
                return;
            }
            try {
                const /** @type {?} */ stream = yield navigator
                    .mediaDevices
                    .getUserMedia(constraints);
                this.startDecodeFromStream(stream, callbackFn);
            }
            catch (/** @type {?} */ err) {
                /* handle the error, or not */
                console.error(err);
            }
        });
    }
    /**
     * Sets the new stream and request a new decoding-with-delay.
     *
     * \@todo Return Promise<Result>
     * @param {?} stream The stream to be shown in the video element.
     * @param {?=} callbackFn A callback for the decode method.
     *
     * @return {?}
     */
    startDecodeFromStream(stream, callbackFn) {
        this.stream = stream;
        this.checkTorchCompatibility(this.stream);
        this.bindVideoSrc(this.videoElement, this.stream);
        this.bindEvents(this.videoElement, callbackFn);
    }
    /**
     * Defines what the videoElement src will be.
     *
     * @param {?} videoElement
     * @param {?} stream
     * @return {?}
     */
    bindVideoSrc(videoElement, stream) {
        // Older browsers may not have `srcObject`
        try {
            // @NOTE Throws Exception if interrupted by a new loaded request
            videoElement.srcObject = stream;
        }
        catch (/** @type {?} */ err) {
            // @NOTE Avoid using this in new browsers, as it is going away.
            videoElement.src = window.URL.createObjectURL(stream);
        }
    }
    /**
     * Unbinds a HTML video src property.
     *
     * @param {?} videoElement
     * @return {?}
     */
    unbindVideoSrc(videoElement) {
        try {
            videoElement.srcObject = null;
        }
        catch (/** @type {?} */ err) {
            videoElement.src = '';
        }
    }
    /**
     * Binds listeners and callbacks to the videoElement.
     *
     * @param {?} videoElement
     * @param {?=} callbackFn
     * @return {?}
     */
    bindEvents(videoElement, callbackFn) {
        if (typeof callbackFn !== 'undefined') {
            this.videoPlayingEventListener = () => this.decodingStream = this.decodeWithDelay(this.timeBetweenScans)
                .pipe(catchError((e, x) => this.handleDecodeStreamError(e, x)))
                .subscribe((x) => callbackFn(x));
        }
        videoElement.addEventListener('playing', this.videoPlayingEventListener);
        this.videoLoadedMetadataEventListener = () => videoElement.play();
        videoElement.addEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
    }
    /**
     * Checks if the stream supports torch control.
     *
     * @param {?} stream The media stream used to check.
     * @return {?}
     */
    checkTorchCompatibility(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.track = stream.getVideoTracks()[0];
                const /** @type {?} */ imageCapture = new ImageCapture(this.track);
                const /** @type {?} */ capabilities = yield imageCapture.getPhotoCapabilities();
                const /** @type {?} */ compatible = !!capabilities.torch || ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
                this.torchCompatible.next(compatible);
            }
            catch (/** @type {?} */ err) {
                this.torchCompatible.next(false);
            }
        });
    }
    /**
     * Enables and disables the device torch.
     * @param {?} on
     * @return {?}
     */
    setTorch(on) {
        if (!this.torchCompatible.value) {
            return;
        }
        if (on) {
            this.track.applyConstraints({
                advanced: [/** @type {?} */ ({ torch: true })]
            });
        }
        else {
            this.restart();
        }
    }
    /**
     * Observable that says if there's a torch available for the current device.
     * @return {?}
     */
    get torchAvailable() {
        return this.torchCompatible.asObservable();
    }
    /**
     * Sets a HTMLVideoElement for scanning or creates a new one.
     *
     * @param {?=} videoElement The HTMLVideoElement to be set.
     * @return {?}
     */
    prepareVideoElement(videoElement) {
        if (!videoElement && typeof document !== 'undefined') {
            videoElement = document.createElement('video');
            videoElement.width = 200;
            videoElement.height = 200;
        }
        this.videoElement = videoElement;
    }
    /**
     * Opens a decoding stream.
     * @param {?=} delay
     * @return {?}
     */
    decodeWithDelay(delay = 500) {
        // The decoding stream.
        return Observable.create((observer) => {
            // Creates on Subscribe.
            const /** @type {?} */ intervalId = setInterval(() => {
                try {
                    observer.next(this.decode());
                }
                catch (/** @type {?} */ err) {
                    observer.error(err);
                }
            }, delay);
            // Destroys on Unsubscribe.
            return () => clearInterval(intervalId);
        });
    }
    /**
     * Gets the BinaryBitmap for ya! (and decodes it)
     * @return {?}
     */
    decode() {
        // get binary bitmap for decode function
        const /** @type {?} */ binaryBitmap = this.createBinaryBitmap(this.videoElement || this.imageElement);
        return this.decodeBitmap(binaryBitmap);
    }
    /**
     * Call the encapsulated readers decode
     * @param {?} binaryBitmap
     * @return {?}
     */
    decodeBitmap(binaryBitmap) {
        return this.reader.decode(binaryBitmap);
    }
    /**
     * Administra um erro gerado durante o decode stream.
     * @param {?} err
     * @param {?} caught
     * @return {?}
     */
    handleDecodeStreamError(err, caught) {
        if (
        // scan Failure - found nothing, no error
        err instanceof NotFoundException ||
            // scan Error - found the QR but got error on decoding
            err instanceof ChecksumException ||
            err instanceof FormatException) {
            return caught;
        }
        throw err;
    }
    /**
     * Creates a binaryBitmap based in some image source.
     *
     * @param {?} mediaElement HTML element containing drawable image source.
     * @return {?}
     */
    createBinaryBitmap(mediaElement) {
        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }
        this.canvasElementContext.drawImage(mediaElement, 0, 0);
        const /** @type {?} */ luminanceSource = new HTMLCanvasElementLuminanceSource(this.canvasElement);
        const /** @type {?} */ hybridBinarizer = new HybridBinarizer(luminanceSource);
        return new BinaryBitmap(hybridBinarizer);
    }
    /**
     * 🖌 Prepares the canvas for capture and scan frames.
     * @return {?}
     */
    prepareCaptureCanvas() {
        if (typeof document === 'undefined') {
            this.canvasElement = undefined;
            this.canvasElementContext = undefined;
            return;
        }
        const /** @type {?} */ canvasElement = document.createElement('canvas');
        let /** @type {?} */ width;
        let /** @type {?} */ height;
        if (typeof this.videoElement !== 'undefined') {
            width = this.videoElement.videoWidth;
            height = this.videoElement.videoHeight;
        }
        if (typeof this.imageElement !== 'undefined') {
            width = this.imageElement.naturalWidth || this.imageElement.width;
            height = this.imageElement.naturalHeight || this.imageElement.height;
        }
        canvasElement.style.width = width + 'px';
        canvasElement.style.height = height + 'px';
        canvasElement.width = width;
        canvasElement.height = height;
        this.canvasElement = canvasElement;
        this.canvasElementContext = canvasElement.getContext('2d');
    }
    /**
     * Stops the continuous scan and cleans the stream.
     * @return {?}
     */
    stop() {
        if (this.decodingStream) {
            this.decodingStream.unsubscribe();
        }
        if (this.stream) {
            this.stream.getVideoTracks().forEach(t => t.stop());
            this.stream = undefined;
        }
    }
    /**
     * Resets the scanner and it's configurations.
     * @return {?}
     */
    reset() {
        // stops the camera, preview and scan 🔴
        this.stop();
        if (this.videoElement) {
            // first gives freedon to the element 🕊
            if (typeof this.videoPlayEndedEventListener !== 'undefined') {
                this.videoElement.removeEventListener('ended', this.videoPlayEndedEventListener);
            }
            if (typeof this.videoPlayingEventListener !== 'undefined') {
                this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
            }
            if (typeof this.videoLoadedMetadataEventListener !== 'undefined') {
                this.videoElement.removeEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
            }
            // then forgets about that element 😢
            this.unbindVideoSrc(this.videoElement);
            this.videoElement.removeAttribute('src');
            this.videoElement = undefined;
        }
        if (this.imageElement) {
            // first gives freedon to the element 🕊
            if (undefined !== this.videoPlayEndedEventListener) {
                this.imageElement.removeEventListener('load', this.imageLoadedEventListener);
            }
            // then forgets about that element 😢
            this.imageElement.src = undefined;
            this.imageElement.removeAttribute('src');
            this.imageElement = undefined;
        }
        // cleans canvas references 🖌
        this.canvasElementContext = undefined;
        this.canvasElement = undefined;
    }
    /**
     * Restarts the scanner.
     * @return {?}
     */
    restart() {
        // reset
        // start
        this.decodeFromInputVideoDevice(undefined, this.deviceId, this.videoElement);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class BrowserMultiFormatReader extends BrowserCodeReader {
    /**
     * @param {?=} hints
     * @param {?=} timeBetweenScansMillis
     */
    constructor(hints = null, timeBetweenScansMillis = 500) {
        const /** @type {?} */ reader = new MultiFormatReader();
        reader.setHints(hints);
        super(reader, timeBetweenScansMillis);
    }
    /**
     * Overwrite decodeBitmap to call decodeWithState, which will pay
     * attention to the hints set in the constructor function
     * @param {?} binaryBitmap
     * @return {?}
     */
    decodeBitmap(binaryBitmap) {
        return this.reader.decodeWithState(binaryBitmap);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ZXingScannerComponent {
    /**
     * Constructor to build the object and do some DI.
     */
    constructor() {
        /**
         * Barcode formats to scan
         */
        this._formats = [BarcodeFormat.QR_CODE];
        /**
         * Allow start scan or not.
         */
        this.scannerEnabled = true;
        /**
         * Enable or disable autofocus of the camera (might have an impact on performance)
         */
        this.autofocusEnabled = true;
        /**
         * How the preview element shoud be fit inside the :host container.
         */
        this.previewFitMode = 'cover';
        /**
         * Emitts events when the torch compatibility is changed.
         */
        this.torchCompatible = new EventEmitter();
        /**
         * Emitts events when a scan is successful performed, will inject the string value of the QR-code to the callback.
         */
        this.scanSuccess = new EventEmitter();
        /**
         * Emitts events when a scan fails without errors, usefull to know how much scan tries where made.
         */
        this.scanFailure = new EventEmitter();
        /**
         * Emitts events when a scan throws some error, will inject the error to the callback.
         */
        this.scanError = new EventEmitter();
        /**
         * Emitts events when a scan is performed, will inject the Result value of the QR-code scan (if available) to the callback.
         */
        this.scanComplete = new EventEmitter();
        /**
         * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
         */
        this.camerasFound = new EventEmitter();
        /**
         * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
         */
        this.camerasNotFound = new EventEmitter();
        /**
         * Emitts events when the users answers for permission.
         */
        this.permissionResponse = new EventEmitter();
        /**
         * Emitts events when has devices status is update.
         */
        this.hasDevices = new EventEmitter();
        this.codeReader = new BrowserCodeReader(new QRCodeReader(), 500);
        this.hasNavigator = typeof navigator !== 'undefined';
        this.isMediaDevicesSuported = this.hasNavigator && !!navigator.mediaDevices;
        this.isEnumerateDevicesSuported = !!(this.isMediaDevicesSuported && navigator.mediaDevices.enumerateDevices);
    }
    /**
     * If any media device were found.
     * @param {?} hasDevice
     * @return {?}
     */
    set _hasDevices(hasDevice) {
        this.hasDevices.next(hasDevice);
    }
    /**
     * @return {?}
     */
    get formats() {
        return this._formats;
    }
    /**
     * @param {?} formatsInput
     * @return {?}
     */
    set formats(formatsInput) {
        if (typeof formatsInput === 'string') {
            throw new Error('Formats shouldn\'t be a string, make sure the [formats] input is a binding.');
        }
        // formats may be set from html template as BarcodeFormat or string array
        const /** @type {?} */ formats = /** @type {?} */ (formatsInput);
        this._formats = formats.map(f => (typeof f === 'string') ? BarcodeFormat[f.trim()] : f);
    }
    /**
     * Allow start scan or not.
     * @param {?} on
     * @return {?}
     */
    set torch(on) {
        this.codeReader.setTorch(on);
    }
    /**
     * Manages the bindinded property changes.
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["scannerEnabled"]) {
            if (!this.scannerEnabled) {
                this.resetScan();
            }
            else if (this.videoInputDevice) {
                this.scan(this.videoInputDevice.deviceId);
            }
        }
        if (changes["device"]) {
            if (this.device) {
                this.changeDevice(this.device);
            }
            else {
                console.warn('zxing-scanner', 'device', 'Unselected device.');
                this.resetScan();
            }
        }
        if (changes["formats"] !== undefined) {
            this.setFormats(this.formats);
        }
    }
    /**
     * Executed after the view initialization.
     * @return {?}
     */
    ngAfterViewInit() {
        return __awaiter(this, void 0, void 0, function* () {
            // Chrome 63 fix
            if (!this.previewElemRef) {
                console.warn('zxing-scanner', 'Preview element not found!');
                return;
            }
            // iOS 11 Fix
            this.previewElemRef.nativeElement.setAttribute('autoplay', false);
            this.previewElemRef.nativeElement.setAttribute('muted', true);
            this.previewElemRef.nativeElement.setAttribute('playsinline', true);
            this.previewElemRef.nativeElement.setAttribute('autofocus', this.autofocusEnabled);
            // Asks for permission before enumerating devices so it can get all the device's info
            const /** @type {?} */ hasPermission = yield this.askForPermission();
            // gets and enumerates all video devices
            this.enumarateVideoDevices().then((videoInputDevices) => {
                if (videoInputDevices && videoInputDevices.length > 0) {
                    this._hasDevices = true;
                    this.camerasFound.next(videoInputDevices);
                }
                else {
                    this._hasDevices = false;
                    this.camerasNotFound.next();
                }
            });
            // There's nothin' to do anymore if we don't have permissions.
            if (hasPermission !== true) {
                return;
            }
            this.startScan(this.videoInputDevice);
            this.codeReader.torchAvailable.subscribe((value) => {
                this.torchCompatible.emit(value);
            });
        });
    }
    /**
     * Executes some actions before destroy the component.
     * @return {?}
     */
    ngOnDestroy() {
        this.resetScan();
    }
    /**
     * Changes the supported code formats.
     * @param {?} formats The formats to support.
     * @return {?}
     */
    setFormats(formats) {
        this.formats = formats;
        const /** @type {?} */ hints = new Map();
        hints.set(2 /* POSSIBLE_FORMATS */, formats);
        this.codeReader = new BrowserMultiFormatReader(hints);
        this.restartScan();
    }
    /**
     * Properly changes the current target device.
     *
     * @param {?} device
     * @return {?}
     */
    changeDevice(device) {
        this.videoInputDevice = device;
        this.startScan(device);
    }
    /**
     * Properly changes the current target device using it's deviceId.
     *
     * @param {?} deviceId
     * @return {?}
     */
    changeDeviceById(deviceId) {
        this.changeDevice(this.getDeviceById(deviceId));
    }
    /**
     * Properly returns the target device using it's deviceId.
     *
     * @param {?} deviceId
     * @return {?}
     */
    getDeviceById(deviceId) {
        return this.videoInputDevices.find(device => device.deviceId === deviceId);
    }
    /**
     * Sets the permission value and emmits the event.
     * @param {?} hasPermission
     * @return {?}
     */
    setPermission(hasPermission) {
        this.hasPermission = hasPermission;
        this.permissionResponse.next(hasPermission);
        return this.permissionResponse;
    }
    /**
     * Gets and registers all cammeras.
     *
     * \@todo Return a Promise.
     * @return {?}
     */
    askForPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasNavigator) {
                console.error('zxing-scanner', 'askForPermission', 'Can\'t ask permission, navigator is not present.');
                this.setPermission(null);
                return this.hasPermission;
            }
            if (!this.isMediaDevicesSuported) {
                console.error('zxing-scanner', 'askForPermission', 'Can\'t get user media, this is not supported.');
                this.setPermission(null);
                return this.hasPermission;
            }
            let /** @type {?} */ stream;
            try {
                // Will try to ask for permission
                stream = yield navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            }
            catch (/** @type {?} */ err) {
                return this.handlePermissionException(err);
            }
            let /** @type {?} */ permission;
            try {
                // Start stream so Browser can display its permission-dialog
                this.codeReader.bindVideoSrc(this.previewElemRef.nativeElement, stream);
                // After permission was granted, we can stop it again
                stream.getVideoTracks().forEach(track => {
                    track.stop();
                });
                // should stop the opened stream
                this.codeReader.unbindVideoSrc(this.previewElemRef.nativeElement);
                // if the scripts lives until here, that's only one mean:
                // permission granted
                permission = true;
                this.setPermission(permission);
            }
            catch (/** @type {?} */ err) {
                console.error('zxing-scanner', 'askForPermission', err);
                // permission aborted
                permission = null;
                this.setPermission(permission);
            }
            // Returns the event emitter, so the dev can subscribe to it
            return permission;
        });
    }
    /**
     * Returns the filtered permission.
     *
     * @param {?} err
     * @return {?}
     */
    handlePermissionException(err) {
        // failed to grant permission to video input
        console.warn('zxing-scanner', 'askForPermission', err);
        let /** @type {?} */ permission;
        switch (err.name) {
            // usually caused by not secure origins
            case 'NotSupportedError':
                console.warn('@zxing/ngx-scanner', err.message);
                // could not claim
                permission = null;
                // can't check devices
                this._hasDevices = null;
                break;
            // user denied permission
            case 'NotAllowedError':
                console.warn('@zxing/ngx-scanner', err.message);
                // claimed and denied permission
                permission = false;
                // this means that input devices exists
                this._hasDevices = true;
                break;
            // the device has no attached input devices
            case 'NotFoundError':
                console.warn('@zxing/ngx-scanner', err.message);
                // no permissions claimed
                permission = null;
                // because there was no devices
                this._hasDevices = false;
                // tells the listener about the error
                this.camerasNotFound.next(err);
                break;
            case 'NotReadableError':
                console.warn('@zxing/ngx-scanner', 'Couldn\'t read the device(s)\'s stream, it\'s probably in use by another app.');
                // no permissions claimed
                permission = null;
                // there are devices, which I couldn't use
                this._hasDevices = false;
                // tells the listener about the error
                this.camerasNotFound.next(err);
                break;
            default:
                console.warn('@zxing/ngx-scanner', 'I was not able to define if I have permissions for camera or not.', err);
                // unknown
                permission = null;
                // this._hasDevices = undefined;
                break;
        }
        this.setPermission(permission);
        // tells the listener about the error
        this.permissionResponse.error(err);
        return permission;
    }
    /**
     * Starts the continuous scanning for the given device.
     *
     * @param {?} deviceId The deviceId from the device.
     * @return {?}
     */
    scan(deviceId) {
        try {
            this.codeReader.decodeFromInputVideoDevice((result) => {
                if (result) {
                    this.dispatchScanSuccess(result);
                }
                else {
                    this.dispatchScanFailure();
                }
                this.dispatchScanComplete(result);
            }, deviceId, this.previewElemRef.nativeElement);
        }
        catch (/** @type {?} */ err) {
            this.dispatchScanError(err);
            this.dispatchScanComplete(undefined);
        }
    }
    /**
     * Starts the scanning if allowed.
     *
     * @param {?} device The device to be used in the scan.
     * @return {?}
     */
    startScan(device) {
        if (this.scannerEnabled && device) {
            this.scan(device.deviceId);
        }
    }
    /**
     * Stops the scan service.
     * @return {?}
     */
    resetScan() {
        this.codeReader.reset();
    }
    /**
     * Stops and starts back the scan.
     * @return {?}
     */
    restartScan() {
        this.resetScan();
        this.startScan(this.device);
    }
    /**
     * Dispatches the scan success event.
     *
     * @param {?} result the scan result.
     * @return {?}
     */
    dispatchScanSuccess(result) {
        this.scanSuccess.next(result.getText());
    }
    /**
     * Dispatches the scan failure event.
     * @return {?}
     */
    dispatchScanFailure() {
        this.scanFailure.next();
    }
    /**
     * Dispatches the scan error event.
     *
     * @param {?} error
     * @return {?}
     */
    dispatchScanError(error) {
        this.scanError.next(error);
    }
    /**
     * Dispatches the scan event.
     *
     * @param {?} result the scan result.
     * @return {?}
     */
    dispatchScanComplete(result) {
        this.scanComplete.next(result);
    }
    /**
     * Enumerates all the available devices.
     * @return {?}
     */
    enumarateVideoDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasNavigator) {
                console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, navigator is not present.');
                return;
            }
            if (!this.isEnumerateDevicesSuported) {
                console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, method not supported.');
                return;
            }
            const /** @type {?} */ devices = yield navigator.mediaDevices.enumerateDevices();
            this.videoInputDevices = [];
            for (const /** @type {?} */ device of devices) {
                // @todo type this as `MediaDeviceInfo`
                const /** @type {?} */ videoDevice = {};
                // tslint:disable-next-line:forin
                for (const /** @type {?} */ key in device) {
                    videoDevice[key] = device[key];
                }
                if (videoDevice.kind === 'video') {
                    videoDevice.kind = 'videoinput';
                }
                if (!videoDevice.deviceId) {
                    videoDevice.deviceId = (/** @type {?} */ (videoDevice)).id;
                }
                if (!videoDevice.label) {
                    videoDevice.label = 'Camera (no permission 🚫)';
                }
                if (videoDevice.kind === 'videoinput') {
                    this.videoInputDevices.push(videoDevice);
                }
            }
            return this.videoInputDevices;
        });
    }
}
ZXingScannerComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'zxing-scanner',
                template: `<video #preview [style.object-fit]="previewFitMode">
  <p>
    Your browser does not support this feature, please try to upgrade it.
  </p>
  <p>
    Seu navegador não suporta este recurso, por favor tente atualizá-lo.
  </p>
</video>
`,
                styles: [`:host{display:block}video{width:100%;height:auto;-o-object-fit:contain;object-fit:contain}`],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
ZXingScannerComponent.ctorParameters = () => [];
ZXingScannerComponent.propDecorators = {
    previewElemRef: [{ type: ViewChild, args: ['preview',] }],
    formats: [{ type: Input }],
    scannerEnabled: [{ type: Input }],
    device: [{ type: Input }],
    autofocusEnabled: [{ type: Input }],
    previewFitMode: [{ type: Input }],
    torch: [{ type: Input }],
    torchCompatible: [{ type: Output }],
    scanSuccess: [{ type: Output }],
    scanFailure: [{ type: Output }],
    scanError: [{ type: Output }],
    scanComplete: [{ type: Output }],
    camerasFound: [{ type: Output }],
    camerasNotFound: [{ type: Output }],
    permissionResponse: [{ type: Output }],
    hasDevices: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ZXingScannerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: ZXingScannerModule
        };
    }
}
ZXingScannerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule
                ],
                declarations: [ZXingScannerComponent],
                exports: [ZXingScannerComponent],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { ZXingScannerModule, ZXingScannerComponent as ɵa };
//# sourceMappingURL=zxing-ngx-scanner.js.map
