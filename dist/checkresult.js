"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckResult = void 0;
/**
 * Represents the result of a check, maintaining both a boolean status and associated messages.
 */
const checktype_1 = require("./checktype");
class CheckResult {
    /**
     * Creates a result object
     * @param check Result of the check. Undefined means that no check has been performed.
     * @param message Initial message, defaults to an empty string.
     */
    constructor(check, message = '', expected, received) {
        this._check = check;
        this._messages = message === '' ? [] : [this.getMessage(message, '', expected, received)];
    }
    stringifyArray(value) {
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
    stringifyObject(value) {
        const keys = Object.keys(value);
        if (keys.length > 5) {
            return `{Object with keys: ${keys.slice(0, 5).join(', ')}... and more}`;
        }
        else {
            return `{Object with keys: ${keys.join(', ')}}`;
        }
    }
    truncateString(value, maxLength = 100) {
        if (value.length > maxLength) {
            return `${value.substring(0, maxLength)}... [truncated]`;
        }
        return value;
    }
    stringify(value) {
        if (typeof value === 'function') {
            return `[Function: ${value.name || 'anonymous'}]`;
        }
        else if (typeof value === 'symbol') {
            return `[Symbol: ${value.toString()}]`;
        }
        else if (value === undefined) {
            return 'undefined';
        }
        else if (value === null) {
            return 'null';
        }
        else if (typeof value === 'string') {
            return this.truncateString(value);
        }
        else if (Array.isArray(value)) {
            return this.stringifyArray(value);
        }
        else if ((0, checktype_1.isObject)(value)) {
            return this.stringifyObject(value);
        }
        else {
            return JSON.stringify(value);
        }
    }
    getMessage(message, path, expected, received = '') {
        return {
            path: path === undefined ? '' : path,
            message,
            expected: this.stringify(expected),
            received: this.stringify(received),
            detail: []
        };
    }
    /**
     * Gets the check result.
     */
    get check() {
        return this._check;
    }
    /**
     * Sets the check result.
     */
    set check(value) {
        this._check = value;
    }
    /**
     * Gets the messages.
     */
    get messages() {
        return this._messages;
    }
    /**
     * Sets the messages.
     */
    set messages(value) {
        this._messages = value;
    }
    /**
     * Returns a string with all error messages.
     * @param truncateLength - Optional length to truncate the error message. Note the result string may be longer than this value.
     * @returns A string with all error messages.
     */
    getErrorAsString(truncateLength = 512) {
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
    invalidate({ message, path, expected, received }) {
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
    addToPath(property) {
        for (let message of this._messages) {
            if (message.path !== '') {
                message.path = property + '/' + message.path;
            }
            else {
                message.path = property.toString();
            }
        }
    }
    /**
     * Adds an alternative result. The value is combined with an OR. If value is still false,
     * the messages are added in an array.
     * @param result Result of an alternative evaluation.
     */
    addAlternative(result) {
        this.check = this.check || result.check;
        if (!this.check) {
            this._messages.push(...result.messages);
        }
        else {
            this._messages = [];
        }
    }
    /**
     * Joins the error messages into a single error message and sets it as the detail of the error message.
     * @param message - The main error message.
     * @param path - The path of the error.
     * @param received - The received value.
     */
    joinMessages({ message, path, received }) {
        let expected = '';
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
    addCheck(result, path) {
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
exports.CheckResult = CheckResult;
//# sourceMappingURL=checkresult.js.map