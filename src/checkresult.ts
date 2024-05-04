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

/**
 * Represents the result of a check, maintaining both a boolean status and associated messages.
 */

import { isObject } from "./checktype";


export interface ErrorMessage {
    path?: string;
    message: string;
    expected?: string;
    received?: any;
    detail: ErrorMessage[];
}

export class CheckResult {
    private _check: boolean | undefined;
    private _messages: ErrorMessage[];

    /**
     * Creates a result object
     * @param check Result of the check. Undefined means that no check has been performed.
     * @param message Initial message, defaults to an empty string.
     */
    constructor(check: boolean | undefined, message: string = '', expected?: string, received?: any) {
        this._check = check;
        this._messages = message === '' ? [] : [this.getMessage(message, '', expected, received)];
    }

    private stringifyArray(value: any[]): string {
        let result = 'array[';
        let separator = '';
        for (let element of value) {
            result += separator + this.stringify(element);
            separator = ', ';
            if (result.length > 256) {
                return `[array of length ${value.length}]`;
            }
        }
        if (result.length > 64) {
            result = result.substring(0, 64) + '... and more';
        }
        result += ']';
        return result;
    }

    private stringifyObject(value: any): string {
        const keys = Object.keys(value);
        if (keys.length > 5) {
            return `{Object with keys: ${keys.slice(0, 5).join(', ')}... and more}`;
        } else {
            return `{Object with keys: ${keys.join(', ')}}`;
        }
    }

    private truncateString(value: string, maxLength: number = 100): string {
        if (value.length > maxLength) {
            return `${value.substring(0, maxLength)}... [truncated]`;
        }
        return value;
    }

    private stringify(value: any): string {
        if (typeof value === 'function') {
            return `[Function: ${value.name || 'anonymous'}]`;
        } else if (typeof value === 'symbol') {
            return `[Symbol: ${value.toString()}]`;
        } else if (value === undefined) {
            return 'undefined';
        } else if (value === null) {
            return 'null';
        } else if (typeof value === 'string') {
            return this.truncateString(value);
        } else if (Array.isArray(value)) {
            return this.stringifyArray(value);
        } else if (isObject(value)) {
            return this.stringifyObject(value);
        } else {
            return JSON.stringify(value);
        }
    }

    private getMessage(message: string, path?: string, expected?: any, received: any = ''): ErrorMessage {
        return {
            path: path ?? '',
            message,
            expected: this.stringify(expected),
            received: this.stringify(received),
            detail: []
        };
    }

    /**
     * Gets the check result.
     */
    get check(): boolean | undefined {
        return this._check;
    }

    /**
     * Sets the check result.
     */
    set check(value: boolean | undefined) {
        this._check = value;
    }

    /**
     * Gets the messages.
     */
    get messages(): ErrorMessage[] {
        return this._messages;
    }

    /**
     * Sets the messages.
     */
    set messages(value: ErrorMessage[]) {
        this._messages = value;
    }

    /**
     * Returns a string with all error messages.
     * @param truncateLength - Optional length to truncate the error message. Note the result string may be longer than this value.
     * @returns A string with all error messages.
     */
    getErrorAsString(truncateLength: number = 512): string {
        let textMessage = '';
        let separator = textMessage === '' ? '' : '\n'; 
        for (const message of this.messages) {
            if (textMessage.length > truncateLength) {
                textMessage += '...';
                break;
            }
            const text = `Path: ${message.path}. ${message.message} Expected: ${message.expected}, received: ${message.received}`;
            textMessage = textMessage + separator + text;
            separator = '\n';
        }
        return textMessage;
    }

    /**
     * Invalidates the result, sets 'check' to false and assigns the error message.
     * @param message Error message.
     * @param path Name of the property causing the invalidation (optional).
     */
    invalidate({ message, path, expected, received }: { message: string, path?: string, expected?: any, received?: any }): void {
        if (message !== undefined && message !== '') {
            const errorMessage = this.getMessage(message, path, expected, received);
            this._messages.push(errorMessage);
        }
        this.check = false;
    }

    /**
     * Sets the property related to the message.
     * @param property Name of the property related to this message.
     */
    addToPath(property: string | number): void {
        for (let message of this._messages) {
            if (message.path !== '') {
                message.path = property + '/' + message.path;
            } else {
                message.path = property.toString();
            }
        }
    }

    /**
     * Adds an alternative result. The value is combined with an OR. If value is still false,
     * the messages are added in an array.
     * @param result Result of an alternative evaluation.
     */
    addAlternative(result: CheckResult): void {
        this.check = this.check || result.check;
        if (!this.check) {
            this._messages.push(...result.messages);
        } else {
            this._messages = [];
        }
    }


    /**
     * Joins the error messages into a single error message and sets it as the detail of the error message.
     * @param message - The main error message.
     * @param path - The path of the error.
     * @param received - The received value.
     */
    joinMessages({ message, path, received }: { message: string, path?: string, received?: any }): void {
        let expected: string = '';
        let separator = '';
        for (let detail of this._messages) {
            expected += separator + detail.expected;
            separator = ' or ';
            if (expected.length > 64) {
                if (expected.length > 128) {
                    expected = expected.substring(0, 128) + '...';
                }
                break;
            }
        }
        const errorMessage = this.getMessage(message, path, expected, received);
        errorMessage.detail = this._messages;
        this._messages = [errorMessage];
    }

    /**
     * Adds another check. The value is combined with an AND, the messages are combined.
     * @param result Result of an alternative evaluation.
     * @param propertyName Name of the property (optional).
     */
    addCheck(result: CheckResult, path?: string): void {
        if (result.check !== undefined) {
            this.check = this.check && result.check;
            if (!this.check) {
                if (path) {
                    result.addToPath(path);
                }
                this._messages.push(...result.messages);
            }
        }
    }
}
