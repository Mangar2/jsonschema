/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
import { CheckResult } from './checkresult';
interface StringSchema {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
}
/**
 * Checks a string variable against a string schema definition.
 * @param definition - The schema definition to check against.
 * @param variable - The string variable to check.
 * @returns A CheckResult object indicating whether the variable matches the definition.
 */
export declare const checkString: (definition: StringSchema, variable: string) => CheckResult;
export {};
