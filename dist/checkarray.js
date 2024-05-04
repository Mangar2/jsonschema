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
exports.checkArray = void 0;
const deepequal_1 = require("./deepequal");
const checkresult_1 = require("./checkresult");
/**
 * Checks if an array does not contain any element twice.
 * @param data The array to test.
 * @param deepUnique If true, checks content deeply (i.e., different objects with the same content are considered equal); if false, only tests object references.
 * @returns A boolean indicating if the array is unique.
 */
const isUniqueArray = (data, deepUnique = true) => {
    let result = true;
    if (deepUnique === false) {
        const dataSet = new Set(data);
        result = dataSet.size === data.length;
    }
    else {
        for (let outer = 0; outer < data.length; outer++) {
            for (let inner = outer + 1; inner < data.length; inner++) {
                const checkResult = (0, deepequal_1.deepEqualRec)(data[outer], data[inner], '');
                if (checkResult.check === true) {
                    result = false;
                    break;
                }
            }
            if (!result) {
                break;
            }
        }
    }
    return result;
};
/**
 * Checks array data against the constraints of an array definition.
 * @param definition Array schema definition.
 * @param data Array data.
 * @param deepUnique If true, checks content deeply.
 * @returns A CheckResult instance indicating the validation result.
 */
const checkArrayConstrains = (definition, data, deepUnique = true) => {
    const result = new checkresult_1.CheckResult(true);
    if (definition.minItems !== undefined && data.length < definition.minItems) {
        result.invalidate({
            path: `items[${data.length}]`,
            message: `Too few items in array.`,
            expected: `A minimum of ${definition.minItems} elements.`,
            received: data
        });
    }
    if (definition.maxItems !== undefined && data.length > definition.maxItems) {
        result.invalidate({
            path: `items[${data.length}]`,
            message: 'Too many items in array.',
            expected: `A maximum of ${definition.maxItems} elements.`,
            received: data
        });
    }
    if (definition.uniqueItems === true && !isUniqueArray(data, deepUnique)) {
        result.invalidate({
            message: 'Array items must be unique.',
            expected: 'No duplicate items.',
            received: data
        });
    }
    return result;
};
/**
 * Checks if an array contains elements that validate against a definition.
 * @param definition Contains definition.
 * @param array Input data.
 * @param checkSubschema Function to check subschema.
 * @returns A CheckResult indicating the result of the check.
 */
const checkContains = (definition, array, checkSubschema) => {
    const result = new checkresult_1.CheckResult(false);
    array.forEach(element => {
        result.addAlternative(checkSubschema(definition, element));
    });
    if (!result.check) {
        result.invalidate({
            message: 'No array element validates to the definition.',
            received: array
        });
    }
    return result;
};
/**
 * Checks the items of an array having an items property of type Array.
 * @param definition Array definition.
 * @param array Array of items.
 * @param checkSubschema Function to check subschema.
 * @returns A CheckResult indicating the result of the check.
 */
const checkArrayItems = (definition, array, checkSubschema) => {
    const result = new checkresult_1.CheckResult(true);
    for (const index in array) {
        const item = array[index];
        let check;
        const defItem = definition.items[index];
        if (defItem !== undefined) {
            check = checkSubschema(defItem, item);
        }
        else if (definition.additionalItems === false) {
            result.invalidate({
                path: `items[${index}]`,
                message: 'No additional items are allowed.',
                expected: `A maximum of ${definition.items.length} elements.`,
                received: array
            });
            break;
        }
        else if (definition.additionalItems !== undefined) {
            check = checkSubschema(definition.additionalItems, item);
        }
        else {
            break;
        }
        if (!check.check) {
            check.addToPath(`[${index}]`);
            result.addCheck(check);
            break;
        }
        else {
            result.addCheck(check);
        }
    }
    return result;
};
/**
 * Checks an array against a definition.
 * @param definition Array definition.
 * @param array Input data.
 * @param checkSubschema Function to check subschema.
 * @param deepUnique True if the unique check compares the whole structure of Objects.
 * @returns A CheckResult indicating the result of the check.
 */
const checkArray = (definition, array, checkSubschema, deepUnique) => {
    const result = new checkresult_1.CheckResult(true);
    result.addCheck(checkArrayConstrains(definition, array, deepUnique));
    if (definition.contains !== undefined) {
        result.addCheck(checkContains(definition.contains, array, checkSubschema));
    }
    if (Array.isArray(definition.items)) {
        result.addCheck(checkArrayItems(definition, array, checkSubschema));
    }
    else if (definition.items !== undefined) {
        array.forEach((item, index) => {
            const check = checkSubschema(definition.items, item);
            if (!check.check) {
                check.addToPath(`[${index}]`);
            }
            result.addCheck(check);
        });
    }
    return result;
};
exports.checkArray = checkArray;
//# sourceMappingURL=checkarray.js.map