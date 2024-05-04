/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */
import { CheckResult } from './checkresult';
/**
 * Recursively checks an element deeply for differences against another.
 * @param a The first element to compare.
 * @param b The second element to compare.
 * @param path The path to the element being compared, used for error messaging.
 * @returns A CheckResult object containing the decision result and any error messages.
 */
export declare function deepEqualRec(a: any, b: any, path?: string): CheckResult;
