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


interface ErrorMessage {
    path?: string;
    message: string;
    expected?: string;
    received?: any;
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

    private summarize(value: any): string {
        if (Array.isArray(value)) {
            return `[Array of length ${value.length}]`;
        } else if (isObject(value)) {
            const keys = Object.keys(value);
            if (keys.length > 5) {
                return `{Object with keys: ${keys.slice(0, 5).join(', ')}... and more}`;
            } else {
                return `{Object with keys: ${keys.join(', ')}}`;
            }
        } else {
            return JSON.stringify(value);
        }
    }

    private truncateString(value: string, maxLength: number = 100): string {
        if (value.length > maxLength) {
            return `${value.substring(0, maxLength)}... [truncated]`;
        }
        return value;
    }

    private stringifySpecialTypes(value: any): string {
        if (typeof value === 'function') {
            return `[Function: ${value.name || 'anonymous'}]`;
        } else if (typeof value === 'symbol') {
            return `[Symbol: ${value.toString()}]`;
        } else if (value === undefined) {
            return 'undefined';
        } else if (value === null) {
            return 'null';
        } else {
            return this.summarize(value);
        }
    }

    private formatReceivedValue(value: any): string {
        if (typeof value === 'string') {
            return this.truncateString(value);
        } else {
            return this.stringifySpecialTypes(value);
        }
    }

    private getMessage(message: string, path?: string, expected?: any, received: any = ''): ErrorMessage {
        return { 
            path: path === undefined ? '' : path, 
            message, 
            expected: this.formatReceivedValue(expected), 
            received: this.formatReceivedValue(received) };
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
     * Invalidates the result, sets 'check' to false and assigns the error message.
     * @param message Error message.
     * @param path Name of the property causing the invalidation (optional).
     */
    invalidate({ message, path, expected, received } : { message: string, path?: string, expected?: any, received?: any }): void {
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
