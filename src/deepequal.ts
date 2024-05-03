/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

import { isObject } from './checktype';
import { CheckResult } from './checkresult';

/**
 * Recursively checks an element deeply for differences against another.
 * @param a The first element to compare.
 * @param b The second element to compare.
 * @param path The path to the element being compared, used for error messaging.
 * @returns A CheckResult object containing the decision result and any error messages.
 */
export function deepEqualRec(a: any, b: any, path: string = ''): CheckResult {
    const result = new CheckResult(true);

    if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
        result.invalidate({ 
            path,
            message: 'types are different',
            expected: `type of ${typeof a}`, 
            received: `type of ${typeof b}`
        });
    } else if (Array.isArray(a) && Array.isArray(b)) {
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
    } else if (isObject(a) && isObject(b)) {
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
    } else if (a !== b) {
        result.invalidate({ 
            path,
            message: `The values are different`,
            expected: a,
            received: b
        });
    }

    return result;
}

