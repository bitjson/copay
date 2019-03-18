import { MultiFormatReader, DecodeHintType, BinaryBitmap, Result } from '@zxing/library';
import { BrowserCodeReader } from './browser-code-reader';
export declare class BrowserMultiFormatReader extends BrowserCodeReader {
    protected readonly reader: MultiFormatReader;
    constructor(hints?: Map<DecodeHintType, any>, timeBetweenScansMillis?: number);
    /**
     * Overwrite decodeBitmap to call decodeWithState, which will pay
     * attention to the hints set in the constructor function
     */
    protected decodeBitmap(binaryBitmap: BinaryBitmap): Result;
}
