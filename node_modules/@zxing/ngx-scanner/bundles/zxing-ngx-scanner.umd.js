(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@zxing/library'), require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/common'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define('@zxing/ngx-scanner', ['exports', '@zxing/library', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/common', '@angular/forms'], factory) :
	(factory((global.zxing = global.zxing || {}, global.zxing['ngx-scanner'] = {}),global.library,global.rxjs,global.Rx.Observable.prototype,global.ng.core,global.ng.common,global.ng.forms));
}(this, (function (exports,library,rxjs,operators,core,common,forms) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */
var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}





function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

var BrowserCodeReader = /** @class */ (function () {
    function BrowserCodeReader(reader, timeBetweenScans) {
        if (timeBetweenScans === void 0) { timeBetweenScans = 500; }
        this.reader = reader;
        this.timeBetweenScans = timeBetweenScans;
        this.torchCompatible = new rxjs.BehaviorSubject(false);
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
                .pipe(operators.catchError(function (e, x) { return _this.handleDecodeStreamError(e, x); }))
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
        return rxjs.Observable.create(function (observer) {
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
        if (err instanceof library.NotFoundException ||
            err instanceof library.ChecksumException ||
            err instanceof library.FormatException) {
            return caught;
        }
        throw err;
    };
    BrowserCodeReader.prototype.createBinaryBitmap = function (mediaElement) {
        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }
        this.canvasElementContext.drawImage(mediaElement, 0, 0);
        var luminanceSource = new library.HTMLCanvasElementLuminanceSource(this.canvasElement);
        var hybridBinarizer = new library.HybridBinarizer(luminanceSource);
        return new library.BinaryBitmap(hybridBinarizer);
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
        var reader = new library.MultiFormatReader();
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
        this._formats = [library.BarcodeFormat.QR_CODE];
        this.scannerEnabled = true;
        this.autofocusEnabled = true;
        this.previewFitMode = 'cover';
        this.torchCompatible = new core.EventEmitter();
        this.scanSuccess = new core.EventEmitter();
        this.scanFailure = new core.EventEmitter();
        this.scanError = new core.EventEmitter();
        this.scanComplete = new core.EventEmitter();
        this.camerasFound = new core.EventEmitter();
        this.camerasNotFound = new core.EventEmitter();
        this.permissionResponse = new core.EventEmitter();
        this.hasDevices = new core.EventEmitter();
        this.codeReader = new BrowserCodeReader(new library.QRCodeReader(), 500);
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
            this._formats = formats.map(function (f) { return (typeof f === 'string') ? library.BarcodeFormat[f.trim()] : f; });
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
    { type: core.Component, args: [{
                selector: 'zxing-scanner',
                template: "<video #preview [style.object-fit]=\"previewFitMode\">\n  <p>\n    Your browser does not support this feature, please try to upgrade it.\n  </p>\n  <p>\n    Seu navegador n\u00E3o suporta este recurso, por favor tente atualiz\u00E1-lo.\n  </p>\n</video>\n",
                styles: [":host{display:block}video{width:100%;height:auto;-o-object-fit:contain;object-fit:contain}"],
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
ZXingScannerComponent.ctorParameters = function () { return []; };
ZXingScannerComponent.propDecorators = {
    previewElemRef: [{ type: core.ViewChild, args: ['preview',] }],
    formats: [{ type: core.Input }],
    scannerEnabled: [{ type: core.Input }],
    device: [{ type: core.Input }],
    autofocusEnabled: [{ type: core.Input }],
    previewFitMode: [{ type: core.Input }],
    torch: [{ type: core.Input }],
    torchCompatible: [{ type: core.Output }],
    scanSuccess: [{ type: core.Output }],
    scanFailure: [{ type: core.Output }],
    scanError: [{ type: core.Output }],
    scanComplete: [{ type: core.Output }],
    camerasFound: [{ type: core.Output }],
    camerasNotFound: [{ type: core.Output }],
    permissionResponse: [{ type: core.Output }],
    hasDevices: [{ type: core.Output }]
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
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    forms.FormsModule
                ],
                declarations: [ZXingScannerComponent],
                exports: [ZXingScannerComponent],
            },] },
];

exports.ZXingScannerModule = ZXingScannerModule;
exports.ɵa = ZXingScannerComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=zxing-ngx-scanner.umd.js.map
