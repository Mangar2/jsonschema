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
import { CheckResult } from './checkresult';
type NumberSchema = {
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
};
/**
 * Validates if the given variable is strictly a boolean value.
 * @param variable - The variable to check.
 * @returns A CheckResult object indicating the validity.
 */
export declare const checkBoolean: (variable: boolean) => CheckResult;
/**
 * Checks if a value evaluates strictly to true or false.
 * @param definition - The value to check.
 * @returns A CheckResult object with the result of the check.
 */
export declare const checkTrueFalse: (definition: boolean) => CheckResult;
/**
 * Checks a number against a defined set of constraints.
 * @param definition - Object containing numerical constraints like minimum, maximum, etc.
 * @param variable - The number to validate against the definition.
 * @returns A CheckResult object indicating if the number meets the constraints.
 */
export declare const checkNumber: (definition: NumberSchema, variable: number) => CheckResult;
export {};
