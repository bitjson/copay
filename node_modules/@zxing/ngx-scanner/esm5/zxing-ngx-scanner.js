import { __awaiter, __generator, __extends, __values } from 'tslib';
import { BinaryBitmap, ChecksumException, FormatException, HTMLCanvasElementLuminanceSource, HybridBinarizer, NotFoundException, MultiFormatReader, BarcodeFormat, QRCodeReader } from '@zxing/library';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

var BrowserCodeReader = /** @class */ (function () {
    function BrowserCodeReader(reader, timeBetweenScans) {
        if (timeBetweenScans === void 0) { timeBetweenScans = 500; }
        this.reader = reader;
        this.timeBetweenScans = timeBetweenScans;
        this.torchCompatible = new BehaviorSubject(false);
    }
    BrowserCodeReader.prototype.decodeFromInputVideoDevice = function (callbackFn, deviceId, videoElement) {
        return __awaiter(this, void 0, void 0, function () {
            var video, constraints, stream, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reset();
                        this.prepareVideoElement(videoElement);
                        if (typeof deviceId !== 'undefined') {
                            this.deviceId = deviceId;
                        }
                        video = typeof deviceId === 'undefined'
                            ? { facingMode: { exact: 'environment' } }
                            : { deviceId: { exact: deviceId } };
                        constraints = {
                            audio: false,
                            video: video
                        };
                        if (typeof navigator === 'undefined') {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator
                                .mediaDevices
                                .getUserMedia(constraints)];
                    case 2:
                        stream = _a.sent();
                        this.startDecodeFromStream(stream, callbackFn);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BrowserCodeReader.prototype.startDecodeFromStream = function (stream, callbackFn) {
        this.stream = stream;
        this.checkTorchCompatibility(this.stream);
        this.bindVideoSrc(this.videoElement, this.stream);
        this.bindEvents(this.videoElement, callbackFn);
    };
    BrowserCodeReader.prototype.bindVideoSrc = function (videoElement, stream) {
        try {
            videoElement.srcObject = stream;
        }
        catch (err) {
            videoElement.src = window.URL.createObjectURL(stream);
        }
    };
    BrowserCodeReader.prototype.unbindVideoSrc = function (videoElement) {
        try {
            videoElement.srcObject = null;
        }
        catch (err) {
            videoElement.src = '';
        }
    };
    BrowserCodeReader.prototype.bindEvents = function (videoElement, callbackFn) {
        var _this = this;
        if (typeof callbackFn !== 'undefined') {
            this.videoPlayingEventListener = function () { return _this.decodingStream = _this.decodeWithDelay(_this.timeBetweenScans)
                .pipe(catchError(function (e, x) { return _this.handleDecodeStreamError(e, x); }))
                .subscribe(function (x) { return callbackFn(x); }); };
        }
        videoElement.addEventListener('playing', this.videoPlayingEventListener);
        this.videoLoadedMetadataEventListener = function () { return videoElement.play(); };
        videoElement.addEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
    };
    BrowserCodeReader.prototype.checkTorchCompatibility = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            var imageCapture, capabilities, compatible, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.track = stream.getVideoTracks()[0];
                        imageCapture = new ImageCapture(this.track);
                        return [4 /*yield*/, imageCapture.getPhotoCapabilities()];
                    case 1:
                        capabilities = _a.sent();
                        compatible = !!capabilities.torch || ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
                        this.torchCompatible.next(compatible);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        this.torchCompatible.next(false);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BrowserCodeReader.prototype.setTorch = function (on) {
        if (!this.torchCompatible.value) {
            return;
        }
        if (on) {
            this.track.applyConstraints({
                advanced: [({ torch: true })]
            });
        }
        else {
            this.restart();
        }
    };
    Object.defineProperty(BrowserCodeReader.prototype, "torchAvailable", {
        get: function () {
            return this.torchCompatible.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    BrowserCodeReader.prototype.prepareVideoElement = function (videoElement) {
        if (!videoElement && typeof document !== 'undefined') {
            videoElement = document.createElement('video');
            videoElement.width = 200;
            videoElement.height = 200;
        }
        this.videoElement = videoElement;
    };
    BrowserCodeReader.prototype.decodeWithDelay = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 500; }
        return Observable.create(function (observer) {
            var intervalId = setInterval(function () {
                try {
                    observer.next(_this.decode());
                }
                catch (err) {
                    observer.error(err);
                }
            }, delay);
            return function () { return clearInterval(intervalId); };
        });
    };
    BrowserCodeReader.prototype.decode = function () {
        var binaryBitmap = this.createBinaryBitmap(this.videoElement || this.imageElement);
        return this.decodeBitmap(binaryBitmap);
    };
    BrowserCodeReader.prototype.decodeBitmap = function (binaryBitmap) {
        return this.reader.decode(binaryBitmap);
    };
    BrowserCodeReader.prototype.handleDecodeStreamError = function (err, caught) {
        if (err instanceof NotFoundException ||
            err instanceof ChecksumException ||
            err instanceof FormatException) {
            return caught;
        }
        throw err;
    };
    BrowserCodeReader.prototype.createBinaryBitmap = function (mediaElement) {
        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }
        this.canvasElementContext.drawImage(mediaElement, 0, 0);
        var luminanceSource = new HTMLCanvasElementLuminanceSource(this.canvasElement);
        var hybridBinarizer = new HybridBinarizer(luminanceSource);
        return new BinaryBitmap(hybridBinarizer);
    };
    BrowserCodeReader.prototype.prepareCaptureCanvas = function () {
        if (typeof document === 'undefined') {
            this.canvasElement = undefined;
            this.canvasElementContext = undefined;
            return;
        }
        var canvasElement = document.createElement('canvas');
        var width;
        var height;
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
    };
    BrowserCodeReader.prototype.stop = function () {
        if (this.decodingStream) {
            this.decodingStream.unsubscribe();
        }
        if (this.stream) {
            this.stream.getVideoTracks().forEach(function (t) { return t.stop(); });
            this.stream = undefined;
        }
    };
    BrowserCodeReader.prototype.reset = function () {
        this.stop();
        if (this.videoElement) {
            if (typeof this.videoPlayEndedEventListener !== 'undefined') {
                this.videoElement.removeEventListener('ended', this.videoPlayEndedEventListener);
            }
            if (typeof this.videoPlayingEventListener !== 'undefined') {
                this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
            }
            if (typeof this.videoLoadedMetadataEventListener !== 'undefined') {
                this.videoElement.removeEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
            }
            this.unbindVideoSrc(this.videoElement);
            this.videoElement.removeAttribute('src');
            this.videoElement = undefined;
        }
        if (this.imageElement) {
            if (undefined !== this.videoPlayEndedEventListener) {
                this.imageElement.removeEventListener('load', this.imageLoadedEventListener);
            }
            this.imageElement.src = undefined;
            this.imageElement.removeAttribute('src');
            this.imageElement = undefined;
        }
        this.canvasElementContext = undefined;
        this.canvasElement = undefined;
    };
    BrowserCodeReader.prototype.restart = function () {
        this.decodeFromInputVideoDevice(undefined, this.deviceId, this.videoElement);
    };
    return BrowserCodeReader;
}());
var BrowserMultiFormatReader = /** @class */ (function (_super) {
    __extends(BrowserMultiFormatReader, _super);
    function BrowserMultiFormatReader(hints, timeBetweenScansMillis) {
        if (hints === void 0) { hints = null; }
        if (timeBetweenScansMillis === void 0) { timeBetweenScansMillis = 500; }
        var _this = this;
        var reader = new MultiFormatReader();
        reader.setHints(hints);
        _this = _super.call(this, reader, timeBetweenScansMillis) || this;
        return _this;
    }
    BrowserMultiFormatReader.prototype.decodeBitmap = function (binaryBitmap) {
        return this.reader.decodeWithState(binaryBitmap);
    };
    return BrowserMultiFormatReader;
}(BrowserCodeReader));
var ZXingScannerComponent = /** @class */ (function () {
    function ZXingScannerComponent() {
        this._formats = [BarcodeFormat.QR_CODE];
        this.scannerEnabled = true;
        this.autofocusEnabled = true;
        this.previewFitMode = 'cover';
        this.torchCompatible = new EventEmitter();
        this.scanSuccess = new EventEmitter();
        this.scanFailure = new EventEmitter();
        this.scanError = new EventEmitter();
        this.scanComplete = new EventEmitter();
        this.camerasFound = new EventEmitter();
        this.camerasNotFound = new EventEmitter();
        this.permissionResponse = new EventEmitter();
        this.hasDevices = new EventEmitter();
        this.codeReader = new BrowserCodeReader(new QRCodeReader(), 500);
        this.hasNavigator = typeof navigator !== 'undefined';
        this.isMediaDevicesSuported = this.hasNavigator && !!navigator.mediaDevices;
        this.isEnumerateDevicesSuported = !!(this.isMediaDevicesSuported && navigator.mediaDevices.enumerateDevices);
    }
    Object.defineProperty(ZXingScannerComponent.prototype, "_hasDevices", {
        set: function (hasDevice) {
            this.hasDevices.next(hasDevice);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "formats", {
        get: function () {
            return this._formats;
        },
        set: function (formatsInput) {
            if (typeof formatsInput === 'string') {
                throw new Error('Formats shouldn\'t be a string, make sure the [formats] input is a binding.');
            }
            var formats = (formatsInput);
            this._formats = formats.map(function (f) { return (typeof f === 'string') ? BarcodeFormat[f.trim()] : f; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "torch", {
        set: function (on) {
            this.codeReader.setTorch(on);
        },
        enumerable: true,
        configurable: true
    });
    ZXingScannerComponent.prototype.ngOnChanges = function (changes) {
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
    };
    ZXingScannerComponent.prototype.ngAfterViewInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var hasPermission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.previewElemRef) {
                            console.warn('zxing-scanner', 'Preview element not found!');
                            return [2 /*return*/];
                        }
                        this.previewElemRef.nativeElement.setAttribute('autoplay', false);
                        this.previewElemRef.nativeElement.setAttribute('muted', true);
                        this.previewElemRef.nativeElement.setAttribute('playsinline', true);
                        this.previewElemRef.nativeElement.setAttribute('autofocus', this.autofocusEnabled);
                        return [4 /*yield*/, this.askForPermission()];
                    case 1:
                        hasPermission = _a.sent();
                        this.enumarateVideoDevices().then(function (videoInputDevices) {
                            if (videoInputDevices && videoInputDevices.length > 0) {
                                _this._hasDevices = true;
                                _this.camerasFound.next(videoInputDevices);
                            }
                            else {
                                _this._hasDevices = false;
                                _this.camerasNotFound.next();
                            }
                        });
                        if (hasPermission !== true) {
                            return [2 /*return*/];
                        }
                        this.startScan(this.videoInputDevice);
                        this.codeReader.torchAvailable.subscribe(function (value) {
                            _this.torchCompatible.emit(value);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ZXingScannerComponent.prototype.ngOnDestroy = function () {
        this.resetScan();
    };
    ZXingScannerComponent.prototype.setFormats = function (formats) {
        this.formats = formats;
        var hints = new Map();
        hints.set(2, formats);
        this.codeReader = new BrowserMultiFormatReader(hints);
        this.restartScan();
    };
    ZXingScannerComponent.prototype.changeDevice = function (device) {
        this.videoInputDevice = device;
        this.startScan(device);
    };
    ZXingScannerComponent.prototype.changeDeviceById = function (deviceId) {
        this.changeDevice(this.getDeviceById(deviceId));
    };
    ZXingScannerComponent.prototype.getDeviceById = function (deviceId) {
        return this.videoInputDevices.find(function (device) { return device.deviceId === deviceId; });
    };
    ZXingScannerComponent.prototype.setPermission = function (hasPermission) {
        this.hasPermission = hasPermission;
        this.permissionResponse.next(hasPermission);
        return this.permissionResponse;
    };
    ZXingScannerComponent.prototype.askForPermission = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stream, err_3, permission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasNavigator) {
                            console.error('zxing-scanner', 'askForPermission', 'Can\'t ask permission, navigator is not present.');
                            this.setPermission(null);
                            return [2 /*return*/, this.hasPermission];
                        }
                        if (!this.isMediaDevicesSuported) {
                            console.error('zxing-scanner', 'askForPermission', 'Can\'t get user media, this is not supported.');
                            this.setPermission(null);
                            return [2 /*return*/, this.hasPermission];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: false, video: true })];
                    case 2:
                        stream = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        return [2 /*return*/, this.handlePermissionException(err_3)];
                    case 4:
                        try {
                            this.codeReader.bindVideoSrc(this.previewElemRef.nativeElement, stream);
                            stream.getVideoTracks().forEach(function (track) {
                                track.stop();
                            });
                            this.codeReader.unbindVideoSrc(this.previewElemRef.nativeElement);
                            permission = true;
                            this.setPermission(permission);
                        }
                        catch (err) {
                            console.error('zxing-scanner', 'askForPermission', err);
                            permission = null;
                            this.setPermission(permission);
                        }
                        return [2 /*return*/, permission];
                }
            });
        });
    };
    ZXingScannerComponent.prototype.handlePermissionException = function (err) {
        console.warn('zxing-scanner', 'askForPermission', err);
        var permission;
        switch (err.name) {
            case 'NotSupportedError':
                console.warn('@zxing/ngx-scanner', err.message);
                permission = null;
                this._hasDevices = null;
                break;
            case 'NotAllowedError':
                console.warn('@zxing/ngx-scanner', err.message);
                permission = false;
                this._hasDevices = true;
                break;
            case 'NotFoundError':
                console.warn('@zxing/ngx-scanner', err.message);
                permission = null;
                this._hasDevices = false;
                this.camerasNotFound.next(err);
                break;
            case 'NotReadableError':
                console.warn('@zxing/ngx-scanner', 'Couldn\'t read the device(s)\'s stream, it\'s probably in use by another app.');
                permission = null;
                this._hasDevices = false;
                this.camerasNotFound.next(err);
                break;
            default:
                console.warn('@zxing/ngx-scanner', 'I was not able to define if I have permissions for camera or not.', err);
                permission = null;
                break;
        }
        this.setPermission(permission);
        this.permissionResponse.error(err);
        return permission;
    };
    ZXingScannerComponent.prototype.scan = function (deviceId) {
        var _this = this;
        try {
            this.codeReader.decodeFromInputVideoDevice(function (result) {
                if (result) {
                    _this.dispatchScanSuccess(result);
                }
                else {
                    _this.dispatchScanFailure();
                }
                _this.dispatchScanComplete(result);
            }, deviceId, this.previewElemRef.nativeElement);
        }
        catch (err) {
            this.dispatchScanError(err);
            this.dispatchScanComplete(undefined);
        }
    };
    ZXingScannerComponent.prototype.startScan = function (device) {
        if (this.scannerEnabled && device) {
            this.scan(device.deviceId);
        }
    };
    ZXingScannerComponent.prototype.resetScan = function () {
        this.codeReader.reset();
    };
    ZXingScannerComponent.prototype.restartScan = function () {
        this.resetScan();
        this.startScan(this.device);
    };
    ZXingScannerComponent.prototype.dispatchScanSuccess = function (result) {
        this.scanSuccess.next(result.getText());
    };
    ZXingScannerComponent.prototype.dispatchScanFailure = function () {
        this.scanFailure.next();
    };
    ZXingScannerComponent.prototype.dispatchScanError = function (error) {
        this.scanError.next(error);
    };
    ZXingScannerComponent.prototype.dispatchScanComplete = function (result) {
        this.scanComplete.next(result);
    };
    ZXingScannerComponent.prototype.enumarateVideoDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var devices, devices_1, devices_1_1, device, videoDevice, key, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.hasNavigator) {
                            console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, navigator is not present.');
                            return [2 /*return*/];
                        }
                        if (!this.isEnumerateDevicesSuported) {
                            console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, method not supported.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                    case 1:
                        devices = _b.sent();
                        this.videoInputDevices = [];
                        try {
                            for (devices_1 = __values(devices), devices_1_1 = devices_1.next(); !devices_1_1.done; devices_1_1 = devices_1.next()) {
                                device = devices_1_1.value;
                                videoDevice = {};
                                for (key in device) {
                                    videoDevice[key] = device[key];
                                }
                                if (videoDevice.kind === 'video') {
                                    videoDevice.kind = 'videoinput';
                                }
                                if (!videoDevice.deviceId) {
                                    videoDevice.deviceId = ((videoDevice)).id;
                                }
                                if (!videoDevice.label) {
                                    videoDevice.label = 'Camera (no permission 🚫)';
                                }
                                if (videoDevice.kind === 'videoinput') {
                                    this.videoInputDevices.push(videoDevice);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (devices_1_1 && !devices_1_1.done && (_a = devices_1.return)) _a.call(devices_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/, this.videoInputDevices];
                }
            });
        });
    };
    return ZXingScannerComponent;
}());
ZXingScannerComponent.decorators = [
    { type: Component, args: [{
                selector: 'zxing-scanner',
                template: "<video #preview [style.object-fit]=\"previewFitMode\">\n  <p>\n    Your browser does not support this feature, please try to upgrade it.\n  </p>\n  <p>\n    Seu navegador n\u00E3o suporta este recurso, por favor tente atualiz\u00E1-lo.\n  </p>\n</video>\n",
                styles: [":host{display:block}video{width:100%;height:auto;-o-object-fit:contain;object-fit:contain}"],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
ZXingScannerComponent.ctorParameters = function () { return []; };
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
var ZXingScannerModule = /** @class */ (function () {
    function ZXingScannerModule() {
    }
    ZXingScannerModule.forRoot = function () {
        return {
            ngModule: ZXingScannerModule
        };
    };
    return ZXingScannerModule;
}());
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

export { ZXingScannerModule, ZXingScannerComponent as ɵa };
//# sourceMappingURL=zxing-ngx-scanner.js.map
