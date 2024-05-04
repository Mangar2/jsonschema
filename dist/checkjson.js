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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckJson = void 0;
const deepequal_1 = require("./deepequal");
const checkresult_1 = require("./checkresult");
const checkbasictypes_1 = require("./checkbasictypes");
const checkstring_1 = require("./checkstring");
const checktype_1 = require("./checktype");
const checkobject_1 = require("./checkobject");
const checkarray_1 = require("./checkarray");
const resolveref_1 = require("./resolveref");
const jsonschema_1 = require("./jsonschema");
/**
 * Class to validate a data object according to a JSON Schema.
 */
class CheckJson {
    constructor(definition, options = {}) {
        this._isEqual = (definition, variable) => {
            return (0, deepequal_1.deepEqualRec)(definition, variable);
        };
        this._checkEnum = (definition, variable) => {
            let result = new checkresult_1.CheckResult(false);
            for (const element of definition) {
                const cur = this._isEqual(element, variable);
                if (cur.check) {
                    result = cur;
                    break;
                }
            }
            if (!result.check) {
                result.invalidate({
                    message: 'The value does not match any of the enum values.',
                    expected: `One of [${definition.join(', ')}]`,
                    received: variable
                });
            }
            return result;
        };
        this._checkIfThenElse = (definition, variable) => {
            const ifCheck = this._checkSchema(definition.if, variable);
            let result = new checkresult_1.CheckResult(true);
            if (ifCheck.check === true && definition.then) {
                result = this._checkSchema(definition.then, variable);
            }
            else if (ifCheck.check === false && definition.else) {
                result = this._checkSchema(definition.else, variable);
            }
            return result;
        };
        this._anyOf = (definitions, variable) => {
            const result = new checkresult_1.CheckResult(false);
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
        this._allOf = (definitions, variable) => {
            const result = new checkresult_1.CheckResult(true);
            definitions.forEach(definition => {
                const current = this._checkSchema(definition, variable);
                result.addCheck(current);
            });
            return result;
        };
        this._oneOf = (definitions, variable) => {
            const result = new checkresult_1.CheckResult(false);
            for (const definition of definitions) {
                const current = this._checkSchema(definition, variable);
                if (result.check === true && current.check === true) {
                    result.invalidate({ message: ' matches more than one ' });
                    break;
                }
                else {
                    result.addAlternative(current);
                }
            }
            if (!result.check) {
                result.addToPath('oneOf');
            }
            return result;
        };
        this._checkCommands = (definition, variable) => {
            const result = new checkresult_1.CheckResult(true);
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
        this._checkBaseSchema = (definition, variable) => {
            const result = new checkresult_1.CheckResult(true);
            if (typeof variable === 'string') {
                result.addCheck((0, checkstring_1.checkString)(definition, variable));
            }
            else if (typeof variable === 'number') {
                result.addCheck((0, checkbasictypes_1.checkNumber)(definition, variable));
            }
            else if (Array.isArray(variable)) {
                result.addCheck((0, checkarray_1.checkArray)(definition, variable, this._checkSchema, this._options.deepUnique));
            }
            else if (typeof variable === 'object' && variable !== null) {
                result.addCheck((0, checkobject_1.checkObject)(definition, variable, this._checkSchema));
            }
            else if (typeof variable === 'boolean') {
                result.addCheck((0, checkbasictypes_1.checkBoolean)(variable));
            }
            return result;
        };
        this._checkSchema = (definition, variable) => {
            let result = new checkresult_1.CheckResult(true);
            if (typeof definition === 'boolean') {
                result = (0, checkbasictypes_1.checkTrueFalse)(definition);
                return result;
            }
            if (definition.$ref) {
                const refDefinition = (0, resolveref_1.resolveRef)(definition.$ref, this.definition);
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
            result.addCheck((0, checktype_1.checkType)(definition, variable));
            result.addCheck(this._checkBaseSchema(definition, variable));
            result.addCheck(this._checkCommands(definition, variable));
            return result;
        };
        /**
         * Validates the given data against the JSON schema.
         * @param data - The data to be validated.
         * @returns An object containing the validation result.
         */
        this.validate = (data) => {
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
        this.throwOnValidationError = (data, textMessage = '') => {
            const check = this.validate(data);
            if (!check.result) {
                let separator = textMessage === '' ? '' : '\n';
                throw new Error(textMessage + separator + check.messagesAsString);
            }
        };
        this.definition = definition;
        this._options = { deepUnique: options.deepUnique || true, stringToNumber: options.stringToNumber || false };
    }
    /**
     * Validates the JSON against the schema and returns the result.
     * @returns The result of the JSON schema validation.
     */
    testSchema() {
        const check = new CheckJson(jsonschema_1.schemaValidator);
        return check.validate(this.definition);
    }
    ;
}
exports.CheckJson = CheckJson;
//# sourceMappingURL=checkjson.js.map