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
/**
 * Class to validate a data object according to a JSON Schema.
 */
export declare class CheckInput {
    private definition;
    private _messages;
    private _options;
    constructor(definition: any, options?: {
        deepUnique?: boolean;
        stringToNumber?: boolean;
    });
    get messages(): any;
    private set messages(value);
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
     * Validates the input data against the defined schema.
     * Error messages are stored in the messages property.
     * @param data - The input data to be validated.
     * @returns A boolean indicating whether the input data is valid or not.
     */
    validate: (data: any) => boolean;
    /**
     * Throws an error if the provided data fails validation.
     * @param data - The data to validate.
     * @param textMessage - Optional text message to include in the error.
     */
    throwOnValidationError: (data: any, textMessage?: string) => void;
    /**
     * Tests the schema definition against the ver. 0.7 schema standard.
     * Error messages are stored in the messages property.
     * @returns {boolean} Returns true if the check passes, false otherwise.
     */
    testSchema(): boolean;
}
