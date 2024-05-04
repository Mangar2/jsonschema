"use strict";
/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEqualRec = void 0;
const checktype_1 = require("./checktype");
const checkresult_1 = require("./checkresult");
/**
 * Recursively checks an element deeply for differences against another.
 * @param a The first element to compare.
 * @param b The second element to compare.
 * @param path The path to the element being compared, used for error messaging.
 * @returns A CheckResult object containing the decision result and any error messages.
 */
function deepEqualRec(a, b, path = '') {
    const result = new checkresult_1.CheckResult(true);
    const checkArray = (a, b, path) => {
        if (a.length !== b.length) {
            result.invalidate({
                path,
                message: 'The arrays are different in length',
                expected: a,
                received: b
            });
        }
        for (const index in a) {
            result.addCheck(deepEqualRec(a[index], b[index], `${path}/${index}`));
        }
    };
    const checkObject = (a, b, path) => {
        if (Object.keys(a).length !== Object.keys(b).length) {
            result.invalidate({
                path,
                message: 'The objects are different in length',
                expected: a,
                received: b
            });
        }
        if (a.constructor.name !== b.constructor.name) {
            result.invalidate({
                path,
                message: `objects have different constructor names`,
                expected: a.constructor.name,
                received: b.constructor.name
            });
        }
        for (const key in a) {
            if (Object.prototype.hasOwnProperty.call(a, key)) {
                result.addCheck(deepEqualRec(a[key], b[key], `${path}/${key}`));
            }
        }
    };
    if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
        result.invalidate({
            path,
            message: 'types are different',
            expected: `type of ${typeof a}`,
            received: `type of ${typeof b}`
        });
    }
    else if (Array.isArray(a) && Array.isArray(b)) {
        checkArray(a, b, path);
    }
    else if ((0, checktype_1.isObject)(a) && (0, checktype_1.isObject)(b)) {
        checkObject(a, b, path);
    }
    else if (a !== b) {
        result.invalidate({
            path,
            message: `The values are different`,
            expected: a,
            received: b
        });
    }
    return result;
}
exports.deepEqualRec = deepEqualRec;
//# sourceMappingURL=deepequal.js.map