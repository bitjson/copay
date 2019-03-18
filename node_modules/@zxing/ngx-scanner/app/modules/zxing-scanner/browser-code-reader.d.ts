/// <reference path="image-capture.d.ts" />
import { BinaryBitmap, Reader, Result } from '@zxing/library';
import { Observable } from 'rxjs';
/**
 * Based on zxing-typescript BrowserCodeReader
 */
export declare class BrowserCodeReader {
    protected readonly reader: Reader;
    private timeBetweenScans;
    /**
     * The HTML video element, used to display the camera stream.
     */
    private videoElement;
    /**
     * Should contain the current registered listener for video play-ended,
     * used to unregister that listener when needed.
     */
    private videoPlayEndedEventListener;
    /**
     * Should contain the current registered listener for video playing,
     * used to unregister that listener when needed.
     */
    private videoPlayingEventListener;
    /**
     * Should contain the current registered listener for video loaded-metadata,
     * used to unregister that listener when needed.
     */
    private videoLoadedMetadataEventListener;
    /**
     * The HTML image element, used as a fallback for the video element when decoding.
     */
    private imageElement;
    /**
     * Should contain the current registered listener for image loading,
     * used to unregister that listener when needed.
     */
    private imageLoadedEventListener;
    /**
     * The HTML canvas element, used to draw the video or image's frame for decoding.
     */
    private canvasElement;
    /**
     * The HTML canvas element context.
     */
    private canvasElementContext;
    /**
     * Used to control the decoding stream when it's open.
     */
    private decodingStream;
    /**
     * The stream output from camera.
     */
    private stream;
    /**
     * The track from camera.
     */
    private track;
    /**
     * Shows if torch is available on the camera.
     */
    private torchCompatible;
    /**
     * The device id of the current media device.
     */
    private deviceId;
    /**
     * Constructor for dependency injection.
     *
     * @param reader The barcode reader to be used to decode the stream.
     * @param timeBetweenScans The scan throttling in milliseconds.
     */
    constructor(reader: Reader, timeBetweenScans?: number);
    /**
     * Starts the decoding from the current or a new video element.
     *
     * @param callbackFn The callback to be executed after every scan attempt
     * @param deviceId The device's to be used Id
     * @param videoElement A new video element
     *
     * @todo Return Promise<Result>
     */
    decodeFromInputVideoDevice(callbackFn?: (result: Result) => any, deviceId?: string, videoElement?: HTMLVideoElement): Promise<void>;
    /**
     * Sets the new stream and request a new decoding-with-delay.
     *
     * @param stream The stream to be shown in the video element.
     * @param callbackFn A callback for the decode method.
     *
     * @todo Return Promise<Result>
     */
    private startDecodeFromStream(stream, callbackFn?);
    /**
     * Defines what the videoElement src will be.
     *
     * @param videoElement
     * @param stream
     */
    bindVideoSrc(videoElement: HTMLVideoElement, stream: MediaStream): void;
    /**
     * Unbinds a HTML video src property.
     *
     * @param videoElement
     */
    unbindVideoSrc(videoElement: HTMLVideoElement): void;
    /**
     * Binds listeners and callbacks to the videoElement.
     *
     * @param videoElement
     * @param callbackFn
     */
    private bindEvents(videoElement, callbackFn?);
    /**
     * Checks if the stream supports torch control.
     *
     * @param stream The media stream used to check.
     */
    private checkTorchCompatibility(stream);
    /**
     * Enables and disables the device torch.
     */
    setTorch(on: boolean): void;
    /**
     * Observable that says if there's a torch available for the current device.
     */
    readonly torchAvailable: Observable<boolean>;
    /**
     * Sets a HTMLVideoElement for scanning or creates a new one.
     *
     * @param videoElement The HTMLVideoElement to be set.
     */
    private prepareVideoElement(videoElement?);
    /**
     * Opens a decoding stream.
     */
    private decodeWithDelay(delay?);
    /**
     * Gets the BinaryBitmap for ya! (and decodes it)
     */
    private decode();
    /**
     * Call the encapsulated readers decode
     */
    protected decodeBitmap(binaryBitmap: BinaryBitmap): Result;
    /**
     * Administra um erro gerado durante o decode stream.
     */
    private handleDecodeStreamError(err, caught);
    /**
     * Creates a binaryBitmap based in some image source.
     *
     * @param mediaElement HTML element containing drawable image source.
     */
    private createBinaryBitmap(mediaElement);
    /**
     * 🖌 Prepares the canvas for capture and scan frames.
     */
    private prepareCaptureCanvas();
    /**
     * Stops the continuous scan and cleans the stream.
     */
    private stop();
    /**
     * Resets the scanner and it's configurations.
     */
    reset(): void;
    /**
     * Restarts the scanner.
     */
    private restart();
}
