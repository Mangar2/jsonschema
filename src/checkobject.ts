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

'use strict';

import { SubschemaFunction } from './jsonschema';
import { CheckResult } from './checkresult';
import { isObject } from './checktype';

/**
 * Checks if required elements are available in the object.
 * @param required - Array of required properties.
 * @param object - Object to check.
 * @returns A CheckResult indicating whether all required properties are present.
 */
export const checkRequiredProperties = (required: string[], object: Record<string, any>): CheckResult => {
    const result = new CheckResult(true);
    required?.forEach(property => {
        if (object[property] === undefined) {
            result.invalidate({ 
                path: '',
                message: `The property ${property} is required, but not provided.`,
                expected: `Add the property ${property}`
            });
        }
    });
    return result;
};

/**
 * Checks an object against basic constraints like minimum and maximum properties.
 * @param definition - Object containing constraints like minProperties and maxProperties.
 * @param object - Object to validate.
 * @returns A CheckResult indicating if the object meets the constraints.
 */
export const checkObjectConstraints = (definition: { minProperties?: number; maxProperties?: number; }, object: Record<string, any>): CheckResult => {
    const result = new CheckResult(true);
    const propertiesCount = Object.keys(object).length;
    if (definition.minProperties !== undefined && propertiesCount < definition.minProperties) {
        result.invalidate({ message: `object must have at least ${definition.minProperties} properties` });
    }
    if (definition.maxProperties !== undefined && propertiesCount > definition.maxProperties) {
        result.invalidate({ message: `object may not have more than ${definition.maxProperties} properties` });
    }
    return result;
};

/**
 * Verifies if all listed properties exist in the given object.
 * @param propertyList - List of property names to check.
 * @param object - Object to verify.
 * @returns A CheckResult indicating if all properties exist.
 */
export const hasAllProperties = (propertyList: string[], object: Record<string, any>): CheckResult => {
    const result = new CheckResult(true);
    if (propertyList === undefined || propertyList === null ) {
        return result;
    }
    if (!Array.isArray(propertyList)) {
        return result;
    }
    propertyList.forEach(property => {
        if (object[property] === undefined) {
            result.invalidate({ message: `missing dependent property: ${property}` });
        }
    });
    return result;
};

/**
 * Checks dependencies defined for properties in an object.
 * @param dependencies - Dependency definitions.
 * @param object - Object to validate.
 * @param checkSubschema - Function to validate each dependency or property.
 * @returns A CheckResult summarizing the validation of dependencies.
 */
export const checkDependency = (dependencies: Record<string, any>, object: Record<string, any>, checkSubschema: (definition: any, data: any) => CheckResult): CheckResult => {
    const result = new CheckResult(true);
    if (dependencies === null || dependencies === undefined) {
        return result;
    }
    // Ensure that dependencies, if present, is an object
    if (typeof dependencies !== 'object') {
        return result;  // Invalid structure for dependencies
    }
    Object.entries(dependencies).forEach(([property, dependencyDefinition]) => {
        if (object[property] !== undefined) {
            let check = hasAllProperties(dependencyDefinition, object);
            result.addCheck(check);
            check = checkSubschema(dependencyDefinition, object);
            result.addCheck(check);
        }
    });
    return result;
};

/**
 * Checks additional properties in an object against a provided schema.
 * @param definition - Schema for additional properties.
 * @param object - Object containing the properties to check.
 * @param checkSubschema - Function to validate each additional property against the schema.
 * @returns A CheckResult summarizing the validation of additional properties.
 */
const checkAdditionalProperties = (definition: any, object: any, checkSubschema: (definition: any, data: any) => CheckResult): CheckResult => {
    let result = new CheckResult(true);
    if (definition === false) {
        result.invalidate({ 
            path: '',
            message: 'Unexpected property found, misspelled?',
            expected: 'Properties defined in properties or matching patternProperties',
            received: object
        });
    } else if (typeof definition === 'object') {
        result = checkSubschema(definition, object);
    } else if (definition === true) {
        // Do nothing returns default true
    }
    return result;
};

/**
 * Validates properties against defined patterns.
 * @param patternProperties - Rules for properties based on regular expressions.
 * @param object - Object to validate.
 * @param propertyName - Name of the property to validate.
 * @param checkSubschema - Function to validate properties.
 * @returns A CheckResult for the property validation.
 */
export const checkPatternProperties = (patternProperties: Record<string, any>, object: Record<string, any>, propertyName: string, checkSubschema: (definition: any, data: any) => CheckResult): CheckResult => {
    let result = new CheckResult(undefined);
    Object.entries(patternProperties).forEach(([pattern, schema]) => {
        const regExp = new RegExp(pattern);
        if (regExp.test(propertyName)) {
            result = checkSubschema(schema, object);
            result.addToPath(propertyName);
        }
    });
    return result;
};

/**
 * Checks if all properties match the property definitions.
 * @param definition - The schema definition object.
 * @param object - The input data object to validate.
 * @param checkSubschema - Function to validate each subschema.
 * @returns A CheckResult indicating whether the object matches the property definitions.
 */
const checkProperties = (
    definition: {
        properties?: Record<string, any>,
        patternProperties?: Record<string, any>,
        additionalProperties?: any
    },
    object: Record<string, any>,
    checkSubschema: SubschemaFunction
): CheckResult => {
    const result = new CheckResult(true);
    const propertyDef = isObject(definition.properties) ? definition.properties : {};
    const patternProperty = isObject(definition.patternProperties) ? definition.patternProperties : false;
    const additionalProperties = definition.additionalProperties;

    if (propertyDef || patternProperty || additionalProperties !== undefined) {
        Object.keys(object).forEach(propertyName => {
            const propertyObject = object[propertyName];
            let checked = false;

            if (propertyDef[propertyName] !== undefined) {
                result.addCheck(checkSubschema(propertyDef[propertyName], propertyObject), propertyName);
                checked = true;
            }

            if (patternProperty) {
                const curResult = checkPatternProperties(patternProperty, propertyObject, propertyName, checkSubschema);
                result.addCheck(curResult);
                if (curResult.check !== undefined) {
                    checked = true;
                }
            }

            if (!checked && additionalProperties !== undefined) {
                result.addCheck(checkAdditionalProperties(additionalProperties, propertyObject, checkSubschema), propertyName);
            }
        });
    }

    return result;
};


/**
 * Validates property names in an object against a given schema.
 * @param definition - Schema definition for property names.
 * @param object - Object containing the properties to validate.
 * @param checkSubschema - Function to validate property names.
 * @returns A CheckResult summarizing the validation of property names.
 */
export const checkPropertyNames = (definition: any, object: Record<string, any>, checkSubschema: (definition: any, data: any) => CheckResult): CheckResult => {
    const result = new CheckResult(true);
    if (definition !== undefined) {
        Object.keys(object).forEach(property => {
            result.addCheck(checkSubschema(definition, property), property);
        });
    }
    return result;
};

/**
 * Validates an object against a defined schema, including properties, dependencies, and constraints.
 * @param definition - Schema definition for the object.
 * @param object - Object to validate.
 * @param checkSubschema - Function to validate each aspect of the object.
 * @returns A CheckResult summarizing the validation.
 */
export const checkObject = (definition: any, object: Record<string, any>, checkSubschema: (definition: any, data: any) => CheckResult): CheckResult => {
    const result = new CheckResult(true);
    result.addCheck(checkPropertyNames(definition.propertyNames, object, checkSubschema));
    result.addCheck(checkObjectConstraints(definition, object));
    result.addCheck(checkDependency(definition.dependencies, object, checkSubschema));
    result.addCheck(checkProperties(definition, object, checkSubschema));
    result.addCheck(checkRequiredProperties(definition.required, object));
    return result;
};

