/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */

import { CheckResult } from './checkresult'

interface StringSchema {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
}

/**
 * Checks if a string variable matches a specific format.
 * @param format - The format to check against.
 * @param variable - The string variable to check.
 * @returns A CheckResult object indicating whether the variable matches the format.
 */
const checkStringFormat = (format: string, variable: string): CheckResult => {
    const result = new CheckResult(true)
    switch (format) {
    case 'date': result.check = /^\d{4}-\d{2}-\d{2}$/.test(variable); break
    case 'date-time': result.check = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?(Z|[+-]\d{2}:\d{2})$/.test(variable); break
    }
    if (result.check === false) {
        result.invalidate({ 
            message: `The string does not match the format ${format}.`,
            expected: `A string matching the format ${format}.`,
            received: variable
        })
    }
    return result
}

/**
 * Checks a string variable against a string schema definition.
 * @param definition - The schema definition to check against.
 * @param variable - The string variable to check.
 * @returns A CheckResult object indicating whether the variable matches the definition.
 */
export const checkString = (definition: StringSchema, variable: string): CheckResult => {
    let result = new CheckResult(true)
    if (definition.minLength !== undefined && variable.length < definition.minLength) {
        result.invalidate({ 
            message: `The string is too short. Minimum length is ${definition.minLength} characters.`,
            expected: `A string with at least ${definition.minLength} characters.`,
            received: variable 
        })
    } else if (definition.maxLength !== undefined && variable.length > definition.maxLength) {
        result.invalidate({ 
            message: `The string is too long. Maximum length is ${definition.maxLength} characters.`,
            expected: `A string with at most ${definition.maxLength} characters.`,
            received: variable
        })
    } else if (definition.pattern !== undefined) {
        const regExp = new RegExp(definition.pattern)
        if (!regExp.test(variable)) {
            result.invalidate({ 
                message: `The string does not match the pattern ${definition.pattern}.`,
                expected: `A string matching the pattern ${definition.pattern}.`,
                received: variable
            })
        }
    } else if (definition.format !== undefined) {
        result = checkStringFormat(definition.format, variable)
    }
    return result
}


