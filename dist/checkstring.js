"use strict";
/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkString = void 0;
const checkresult_1 = require("./checkresult");
/**
 * Checks if a string variable matches a specific format.
 * @param format - The format to check against.
 * @param variable - The string variable to check.
 * @returns A CheckResult object indicating whether the variable matches the format.
 */
const checkStringFormat = (format, variable) => {
    const result = new checkresult_1.CheckResult(true);
    switch (format) {
        case 'date':
            result.check = /^\d{4}-\d{2}-\d{2}$/.test(variable);
            break;
        case 'date-time':
            result.check = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?(Z|[+-]\d{2}:\d{2})$/.test(variable);
            break;
    }
    if (result.check === false) {
        result.invalidate({
            message: `The string does not match the format ${format}.`,
            expected: `A string matching the format ${format}.`,
            received: variable
        });
    }
    return result;
};
/**
 * Checks a string variable against a string schema definition.
 * @param definition - The schema definition to check against.
 * @param variable - The string variable to check.
 * @returns A CheckResult object indicating whether the variable matches the definition.
 */
const checkString = (definition, variable) => {
    let result = new checkresult_1.CheckResult(true);
    if (definition.minLength !== undefined && variable.length < definition.minLength) {
        result.invalidate({
            message: `The string is too short. Minimum length is ${definition.minLength} characters.`,
            expected: `A string with at least ${definition.minLength} characters.`,
            received: variable
        });
    }
    else if (definition.maxLength !== undefined && variable.length > definition.maxLength) {
        result.invalidate({
            message: `The string is too long. Maximum length is ${definition.maxLength} characters.`,
            expected: `A string with at most ${definition.maxLength} characters.`,
            received: variable
        });
    }
    else if (definition.pattern !== undefined) {
        const regExp = new RegExp(definition.pattern);
        if (!regExp.test(variable)) {
            result.invalidate({
                message: `The string does not match the pattern ${definition.pattern}.`,
                expected: `A string matching the pattern ${definition.pattern}.`,
                received: variable
            });
        }
    }
    else if (definition.format !== undefined) {
        result = checkStringFormat(definition.format, variable);
    }
    return result;
};
exports.checkString = checkString;
//# sourceMappingURL=checkstring.js.map