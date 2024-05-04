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
/**
 * Checks if required elements are available in the object.
 * @param required - Array of required properties.
 * @param object - Object to check.
 * @returns A CheckResult indicating whether all required properties are present.
 */
export declare const checkRequiredProperties: (required: string[], object: Record<string, any>) => CheckResult;
/**
 * Checks an object against basic constraints like minimum and maximum properties.
 * @param definition - Object containing constraints like minProperties and maxProperties.
 * @param object - Object to validate.
 * @returns A CheckResult indicating if the object meets the constraints.
 */
export declare const checkObjectConstraints: (definition: {
    minProperties?: number;
    maxProperties?: number;
}, object: Record<string, any>) => CheckResult;
/**
 * Verifies if all listed properties exist in the given object.
 * @param propertyList - List of property names to check.
 * @param object - Object to verify.
 * @returns A CheckResult indicating if all properties exist.
 */
export declare const hasAllProperties: (propertyList: string[], object: Record<string, any>) => CheckResult;
/**
 * Checks dependencies defined for properties in an object.
 * @param dependencies - Dependency definitions.
 * @param object - Object to validate.
 * @param checkSubschema - Function to validate each dependency or property.
 * @returns A CheckResult summarizing the validation of dependencies.
 */
export declare const checkDependency: (dependencies: Record<string, any>, object: Record<string, any>, checkSubschema: (definition: any, data: any) => CheckResult) => CheckResult;
/**
 * Validates properties against defined patterns.
 * @param patternProperties - Rules for properties based on regular expressions.
 * @param object - Object to validate.
 * @param propertyName - Name of the property to validate.
 * @param checkSubschema - Function to validate properties.
 * @returns A CheckResult for the property validation.
 */
export declare const checkPatternProperties: (patternProperties: Record<string, any>, object: Record<string, any>, propertyName: string, checkSubschema: (definition: any, data: any) => CheckResult) => CheckResult;
/**
 * Validates property names in an object against a given schema.
 * @param definition - Schema definition for property names.
 * @param object - Object containing the properties to validate.
 * @param checkSubschema - Function to validate property names.
 * @returns A CheckResult summarizing the validation of property names.
 */
export declare const checkPropertyNames: (definition: any, object: Record<string, any>, checkSubschema: (definition: any, data: any) => CheckResult) => CheckResult;
/**
 * Validates an object against a defined schema, including properties, dependencies, and constraints.
 * @param definition - Schema definition for the object.
 * @param object - Object to validate.
 * @param checkSubschema - Function to validate each aspect of the object.
 * @returns A CheckResult summarizing the validation.
 */
export declare const checkObject: (definition: any, object: Record<string, any>, checkSubschema: (definition: any, data: any) => CheckResult) => CheckResult;
