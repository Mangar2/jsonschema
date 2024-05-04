/**
 * @private
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNumber = exports.checkTrueFalse = exports.checkBoolean = void 0;
const checkresult_1 = require("./checkresult");
/**
 * Checks if the given number `a` is a multiple of number `b`.
 * @param a - The number to check.
 * @param b - The potential multiple.
 * @returns True if `a` is a multiple of `b`, otherwise false.
 */
const isMultipleOf = (a, b) => {
    let result = false;
    if (b !== 0) {
        const factor = Math.trunc(a / b);
        const multiply = b * factor;
        const difference = Math.abs(a - multiply);
        result = difference <= a / 1E12;
    }
    return result;
};
/**
 * Validates if the given variable is strictly a boolean value.
 * @param variable - The variable to check.
 * @returns A CheckResult object indicating the validity.
 */
const checkBoolean = (variable) => {
    const result = new checkresult_1.CheckResult(true);
    if (variable !== true && variable !== false) {
        result.invalidate({
            message: `The value provided is not boolean`,
            expected: 'true or false',
            received: variable
        });
    }
    return result;
};
exports.checkBoolean = checkBoolean;
/**
 * Checks if a value evaluates strictly to true or false.
 * @param definition - The value to check.
 * @returns A CheckResult object with the result of the check.
 */
const checkTrueFalse = (definition) => {
    const result = new checkresult_1.CheckResult(true);
    if (definition === true) {
        // do nothing true validates to everything
    }
    else if (definition === false) {
        result.invalidate({
            message: 'Validation failed because the schema explicitly forbids any data.',
            expected: 'No data (schema is set to false)'
        });
    }
    return result;
};
exports.checkTrueFalse = checkTrueFalse;
/**
 * Checks a number against a defined set of constraints.
 * @param definition - Object containing numerical constraints like minimum, maximum, etc.
 * @param variable - The number to validate against the definition.
 * @returns A CheckResult object indicating if the number meets the constraints.
 */
const checkNumber = (definition, variable) => {
    const result = new checkresult_1.CheckResult(true);
    if (definition.minimum !== undefined && variable < definition.minimum) {
        result.invalidate({
            message: `The number is below ${definition.minimum}.`,
            expected: `A number greater than or equal to ${definition.minimum}.`,
            received: variable
        });
    }
    else if (definition.maximum !== undefined && variable > definition.maximum) {
        result.invalidate({
            message: `The number is above ${definition.maximum}.`,
            expected: `A number less than or equal to ${definition.maximum}.`,
            received: variable
        });
    }
    else if (definition.exclusiveMinimum !== undefined && variable <= definition.exclusiveMinimum) {
        result.invalidate({
            message: `The number is below or equal to ${definition.exclusiveMinimum}.`,
            expected: `A number greater than ${definition.exclusiveMinimum}.`,
            received: variable
        });
    }
    else if (definition.exclusiveMaximum !== undefined && variable >= definition.exclusiveMaximum) {
        result.invalidate({
            message: `The number is above or equal to ${definition.exclusiveMaximum}.`,
            expected: `A number greater than  ${definition.exclusiveMaximum}.`,
            received: variable
        });
    }
    else if (definition.multipleOf !== undefined && !isMultipleOf(variable, definition.multipleOf)) {
        result.invalidate({
            message: `The number is not a multiple of ${definition.multipleOf}.`,
            expected: `A number that is a multiple of ${definition.multipleOf}.`,
            received: variable
        });
    }
    return result;
};
exports.checkNumber = checkNumber;
//# sourceMappingURL=checkbasictypes.js.map