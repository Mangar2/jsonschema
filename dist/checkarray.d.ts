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
import { CheckResult } from './checkresult';
/**
 * Checks an array against a definition.
 * @param definition Array definition.
 * @param array Input data.
 * @param checkSubschema Function to check subschema.
 * @param deepUnique True if the unique check compares the whole structure of Objects.
 * @returns A CheckResult indicating the result of the check.
 */
export declare const checkArray: (definition: any, array: any[], checkSubschema: (def: any, data: any) => CheckResult, deepUnique: boolean) => CheckResult;
