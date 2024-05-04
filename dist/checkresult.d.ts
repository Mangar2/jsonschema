/**
 * @private
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
export interface ErrorMessage {
    path?: string;
    message: string;
    expected?: string;
    received?: any;
    detail: ErrorMessage[];
}
export declare class CheckResult {
    private _check;
    private _messages;
    /**
     * Creates a result object
     * @param check Result of the check. Undefined means that no check has been performed.
     * @param message Initial message, defaults to an empty string.
     */
    constructor(check: boolean | undefined, message?: string, expected?: string, received?: any);
    private stringifyArray;
    private stringifyObject;
    private truncateString;
    private stringify;
    private getMessage;
    /**
     * Gets the check result.
     */
    get check(): boolean | undefined;
    /**
     * Sets the check result.
     */
    set check(value: boolean | undefined);
    /**
     * Gets the messages.
     */
    get messages(): ErrorMessage[];
    /**
     * Sets the messages.
     */
    set messages(value: ErrorMessage[]);
    /**
     * Returns a string with all error messages.
     * @param truncateLength - Optional length to truncate the error message. Note the result string may be longer than this value.
     * @returns A string with all error messages.
     */
    getErrorAsString(truncateLength?: number): string;
    /**
     * Invalidates the result, sets 'check' to false and assigns the error message.
     * @param message Error message.
     * @param path Name of the property causing the invalidation (optional).
     */
    invalidate({ message, path, expected, received }: {
        message: string;
        path?: string;
        expected?: any;
        received?: any;
    }): void;
    /**
     * Sets the property related to the message.
     * @param property Name of the property related to this message.
     */
    addToPath(property: string | number): void;
    /**
     * Adds an alternative result. The value is combined with an OR. If value is still false,
     * the messages are added in an array.
     * @param result Result of an alternative evaluation.
     */
    addAlternative(result: CheckResult): void;
    /**
     * Joins the error messages into a single error message and sets it as the detail of the error message.
     * @param message - The main error message.
     * @param path - The path of the error.
     * @param received - The received value.
     */
    joinMessages({ message, path, received }: {
        message: string;
        path?: string;
        received?: any;
    }): void;
    /**
     * Adds another check. The value is combined with an AND, the messages are combined.
     * @param result Result of an alternative evaluation.
     * @param propertyName Name of the property (optional).
     */
    addCheck(result: CheckResult, path?: string): void;
}
