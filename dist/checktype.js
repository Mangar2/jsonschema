/**
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
exports.checkType = exports.isObject = void 0;
const checkresult_1 = require("./checkresult");
/**
 * Type predicate that checks if the given input is a plain object (not an array, function, or any other non-object type).
 * @param input The variable to check.
 * @returns True if the input is a plain object, otherwise false.
 */
const isObject = (input) => {
    return typeof input === 'object' && input !== null && !Array.isArray(input) && !(input instanceof Date) && !(input instanceof RegExp);
};
exports.isObject = isObject;
/**
 * Checks the type of a variable against a specified definition.
 * @param definition - The definition containing allowed type(s) of the variable.
 * @param variable - The data input to check.
 * @returns A CheckResult indicating if the variable matches the allowed type(s).
 */
const checkType = (definition, variable) => {
    const result = new checkresult_1.CheckResult(true);
    const typeList = Array.isArray(definition.type) ? definition.type : [definition.type];
    let check = true; // True, if the list of types is empty
    for (const type of typeList) {
        switch (type) {
            case 'string':
                check = typeof variable === 'string';
                break;
            case 'number':
                check = typeof variable === 'number';
                break;
            case 'integer':
                check = Number.isInteger(variable);
                break;
            case 'array':
                check = Array.isArray(variable);
                break;
            case 'object':
                check = (0, exports.isObject)(variable);
                break;
            case 'boolean':
                check = typeof variable === 'boolean';
                break;
            case 'null':
                check = variable === null;
                break;
        }
        if (check) {
            break;
        }
    }
    if (!check) {
        const expected = `${typeList.length > 1 ? 'any of ' : ''}${typeList.join(',')}`;
        result.invalidate({
            path: '',
            message: 'Type mismatch.',
            expected,
            received: variable
        });
    }
    return result;
};
exports.checkType = checkType;
//# sourceMappingURL=checktype.js.map