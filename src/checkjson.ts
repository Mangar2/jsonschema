/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 * @overview JSON schema validator matching standard version 0.7
 */

'use strict';

import { deepEqualRec } from './deepequal';
import { CheckResult, ErrorMessage } from './checkresult';
import { checkBoolean, checkTrueFalse, checkNumber } from './checkbasictypes';
import { checkString } from './checkstring';
import { checkType } from './checktype';
import { checkObject } from './checkobject';
import { checkArray } from './checkarray';
import { resolveRef } from './resolveref';
import { schemaValidator } from './jsonschema';

export type CheckJsonResult = {
    result: boolean;
    messages: ErrorMessage[];
    messagesAsString: string;
};


/**
 * Class to validate a data object according to a JSON Schema.
 */
export class CheckJson {
    private definition: any;
    private _options: { deepUnique: boolean; stringToNumber?: boolean };

    constructor(definition: any, options: { deepUnique?: boolean; stringToNumber?: boolean } = {}) {
        this.definition = definition;
        this._options = { deepUnique: options.deepUnique || true, stringToNumber: options.stringToNumber || false };
    }

    private _isEqual = (definition: any, variable: any): CheckResult => {
        return deepEqualRec(definition, variable);
    };

    private _checkEnum = (definition: any[], variable: any): CheckResult => {
        let result = new CheckResult(false);
        for (const element of definition) {
            const cur = this._isEqual(element, variable);
            if (cur.check) {
                result = cur;
                break;
            }
        }
        if (!result.check) {
            result.invalidate({ 
                message:  'The value does not match any of the enum values.',
                expected: `One of [${definition.join(', ')}]`,
                received: variable
            });
        }
        return result;
    };

    private _checkIfThenElse = (definition: { if: any; then?: any; else?: any }, variable: any): CheckResult => {
        const ifCheck = this._checkSchema(definition.if, variable);
        let result = new CheckResult(true);
        if (ifCheck.check === true && definition.then) {
            result = this._checkSchema(definition.then, variable);
        } else if (ifCheck.check === false && definition.else) {
            result = this._checkSchema(definition.else, variable);
        }
        return result;
    };

    private _anyOf = (definitions: any[], variable: any): CheckResult => {
        const result = new CheckResult(false);
        definitions.forEach((definition, index) => {
            const current = this._checkSchema(definition, variable);
            current.addToPath(index);
            result.addAlternative(current);
        });
        if (!result.check) {
            result.joinMessages({ 
                message: 'No alternative matches.', 
                received: variable
            });
        }
        return result;
    };

    private _allOf = (definitions: any[], variable: any): CheckResult => {
        const result = new CheckResult(true);
        definitions.forEach(definition => {
            const current = this._checkSchema(definition, variable);
            result.addCheck(current);
        });
        return result;
    };

    private _oneOf = (definitions: any[], variable: any): CheckResult => {
        const result = new CheckResult(false);
        for (const definition of definitions) {
            const current = this._checkSchema(definition, variable)
            if (result.check === true && current.check === true) {
                result.invalidate({ message: ' matches more than one ' })
                break
            } else {
                result.addAlternative(current)
            }
        }
        if (!result.check) {
            result.addToPath('oneOf');
        }
        return result;
    };

    private _checkCommands = (definition: any, variable: any): CheckResult => {
        const result = new CheckResult(true);
        if (definition.oneOf !== undefined) {
            result.addCheck(this._oneOf(definition.oneOf, variable));
        }
        if (definition.anyOf !== undefined) {
            result.addCheck(this._anyOf(definition.anyOf, variable));
        }
        if (definition.allOf !== undefined) {
            result.addCheck(this._allOf(definition.allOf, variable));
        }
        if (definition.const !== undefined) {
            result.addCheck(this._isEqual(definition.const, variable));
        }
        if (definition.enum !== undefined) {
            result.addCheck(this._checkEnum(definition.enum, variable));
        }
        if (definition.if !== undefined) {
            result.addCheck(this._checkIfThenElse(definition, variable));
        }
        if (definition.not !== undefined) {
            const curResult = this._checkSchema(definition.not, variable);
            if (curResult.check) {
                result.invalidate({ message: 'element must not match the schema' });
            }
        }
        return result;
    };

    private _checkBaseSchema = (definition: any, variable: any): CheckResult => {
        const result = new CheckResult(true);
        if (typeof variable === 'string') {
            result.addCheck(checkString(definition, variable));
        } else if (typeof variable === 'number') {
            result.addCheck(checkNumber(definition, variable));
        } else if (Array.isArray(variable)) {
            result.addCheck(checkArray(definition, variable, this._checkSchema, this._options.deepUnique));
        } else if (typeof variable === 'object' && variable !== null) {
            result.addCheck(checkObject(definition, variable, this._checkSchema));
        } else if (typeof variable === 'boolean') {
            result.addCheck(checkBoolean(variable));
        }
        return result;
    };

    private _checkSchema = (definition: any, variable: any): CheckResult => {
        let result = new CheckResult(true);
        if (typeof definition === 'boolean') {
            result = checkTrueFalse(definition);
            return result;
        }
        if (definition.$ref) {
            const refDefinition = resolveRef(definition.$ref, this.definition);
            if (!refDefinition) {
                result.invalidate({ 
                    message: 'Schema error',
                    expected: `reference ${definition.$ref} is defined in the schema`,
                    received: definition.$ref
                });
                return result;
            }
            result = this._checkSchema(refDefinition, variable);
            return result;
        }
        if (definition.default !== undefined && variable === undefined) {
            variable = definition.default;
        }
        if (this._options.stringToNumber && definition.type === 'number' && typeof variable === 'string' && !isNaN(Number(variable))) {
            variable = Number(variable);
        }
        result.addCheck(checkType(definition, variable));
        result.addCheck(this._checkBaseSchema(definition, variable));
        result.addCheck(this._checkCommands(definition, variable));
        return result;
    };

 
    /**
     * Validates the given data against the JSON schema.
     * @param data - The data to be validated.
     * @returns An object containing the validation result.
     */
    public validate = (data: any): CheckJsonResult => {
        const check = this._checkSchema(this.definition, data);
        return {
            result: check.check ? true : false,
            messages: check.messages,
            messagesAsString: check.getErrorAsString()
        };
    };



    /**
     * Throws an error if the provided data fails validation.
     * @param data - The data to validate.
     * @param textMessage - Optional text message to include in the error.
     */
    public throwOnValidationError = (data: any, textMessage: string = ''): void => {
        const check = this.validate(data);
        if (!check.result) {
            let separator = textMessage === '' ? '' : '\n'; 
            throw new Error(textMessage + separator + check.messagesAsString);
        }
    };


    /**
     * Validates the JSON against the schema and returns the result.
     * @returns The result of the JSON schema validation.
     */
    public testSchema(): CheckJsonResult {
        const check = new CheckJson(schemaValidator);
        return check.validate(this.definition);
    };

}


