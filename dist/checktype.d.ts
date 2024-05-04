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
 * Type predicate that checks if the given input is a plain object (not an array, function, or any other non-object type).
 * @param input The variable to check.
 * @returns True if the input is a plain object, otherwise false.
 */
export declare const isObject: (input: any) => input is Record<string, unknown>;
/**
 * Checks the type of a variable against a specified definition.
 * @param definition - The definition containing allowed type(s) of the variable.
 * @param variable - The data input to check.
 * @returns A CheckResult indicating if the variable matches the allowed type(s).
 */
export declare const checkType: (definition: {
    type: string | string[];
}, variable: any) => CheckResult;
