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

export type SubschemaFunction = (definition: any, data: any) => CheckResult;

export interface JsonSchema {
    $id?: string;
    $schema?: string;
    type?: string | string[];
    items?: JsonSchema | JsonSchema[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    additionalItems?: boolean | JsonSchema;
    contains?: JsonSchema;
    properties?: { [key: string]: JsonSchema };
    required?: string[];
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
    minimum?: number;
    maximum?: number;
    multipleOf?: number;
    dependencies?: { [key: string]: string[] | JsonSchema };
    patternProperties?: { [key: string]: JsonSchema };
    additionalProperties?: boolean | JsonSchema;
    oneOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    allOf?: JsonSchema[];
    not?: JsonSchema;
    definitions?: { [key: string]: JsonSchema };
    enum?: any[];
    const?: any;
    examples?: any[];
}