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
import { ErrorMessage } from './checkresult';
export type CheckJsonResult = {
    result: boolean;
    messages: ErrorMessage[];
    messagesAsString: string;
};
/**
 * Class to validate a data object according to a JSON Schema.
 */
export declare class CheckJson {
    private definition;
    private _options;
    constructor(definition: any, options?: {
        deepUnique?: boolean;
        stringToNumber?: boolean;
    });
    private _isEqual;
    private _checkEnum;
    private _checkIfThenElse;
    private _anyOf;
    private _allOf;
    private _oneOf;
    private _checkCommands;
    private _checkBaseSchema;
    private _checkSchema;
    /**
     * Validates the given data against the JSON schema.
     * @param data - The data to be validated.
     * @returns An object containing the validation result.
     */
    validate: (data: any) => CheckJsonResult;
    /**
     * Throws an error if the provided data fails validation.
     * @param data - The data to validate.
     * @param textMessage - Optional text message to include in the error.
     */
    throwOnValidationError: (data: any, textMessage?: string) => void;
    /**
     * Validates the JSON against the schema and returns the result.
     * @returns The result of the JSON schema validation.
     */
    testSchema(): CheckJsonResult;
}
