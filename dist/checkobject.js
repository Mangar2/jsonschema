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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkObject = exports.checkPropertyNames = exports.checkPatternProperties = exports.checkDependency = exports.hasAllProperties = exports.checkObjectConstraints = exports.checkRequiredProperties = void 0;
const checkresult_1 = require("./checkresult");
const checktype_1 = require("./checktype");
/**
 * Checks if required elements are available in the object.
 * @param required - Array of required properties.
 * @param object - Object to check.
 * @returns A CheckResult indicating whether all required properties are present.
 */
const checkRequiredProperties = (required, object) => {
    const result = new checkresult_1.CheckResult(true);
    required === null || required === void 0 ? void 0 : required.forEach(property => {
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
exports.checkRequiredProperties = checkRequiredProperties;
/**
 * Checks an object against basic constraints like minimum and maximum properties.
 * @param definition - Object containing constraints like minProperties and maxProperties.
 * @param object - Object to validate.
 * @returns A CheckResult indicating if the object meets the constraints.
 */
const checkObjectConstraints = (definition, object) => {
    const result = new checkresult_1.CheckResult(true);
    const propertiesCount = Object.keys(object).length;
    if (definition.minProperties !== undefined && propertiesCount < definition.minProperties) {
        result.invalidate({ message: `object must have at least ${definition.minProperties} properties` });
    }
    if (definition.maxProperties !== undefined && propertiesCount > definition.maxProperties) {
        result.invalidate({ message: `object may not have more than ${definition.maxProperties} properties` });
    }
    return result;
};
exports.checkObjectConstraints = checkObjectConstraints;
/**
 * Verifies if all listed properties exist in the given object.
 * @param propertyList - List of property names to check.
 * @param object - Object to verify.
 * @returns A CheckResult indicating if all properties exist.
 */
const hasAllProperties = (propertyList, object) => {
    const result = new checkresult_1.CheckResult(true);
    if (propertyList === undefined || propertyList === null) {
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
exports.hasAllProperties = hasAllProperties;
/**
 * Checks dependencies defined for properties in an object.
 * @param dependencies - Dependency definitions.
 * @param object - Object to validate.
 * @param checkSubschema - Function to validate each dependency or property.
 * @returns A CheckResult summarizing the validation of dependencies.
 */
const checkDependency = (dependencies, object, checkSubschema) => {
    const result = new checkresult_1.CheckResult(true);
    if (dependencies === null || dependencies === undefined) {
        return result;
    }
    // Ensure that dependencies, if present, is an object
    if (typeof dependencies !== 'object') {
        return result; // Invalid structure for dependencies
    }
    Object.entries(dependencies).forEach(([property, dependencyDefinition]) => {
        if (object[property] !== undefined) {
            let check = (0, exports.hasAllProperties)(dependencyDefinition, object);
            result.addCheck(check);
            check = checkSubschema(dependencyDefinition, object);
            result.addCheck(check);
        }
    });
    return result;
};
exports.checkDependency = checkDependency;
/**
 * Checks additional properties in an object against a provided schema.
 * @param definition - Schema for additional properties.
 * @param object - Object containing the properties to check.
 * @param checkSubschema - Function to validate each additional property against the schema.
 * @returns A CheckResult summarizing the validation of additional properties.
 */
const checkAdditionalProperties = (definition, object, checkSubschema) => {
    let result = new checkresult_1.CheckResult(true);
    if (definition === false) {
        result.invalidate({
            path: '',
            message: 'Unexpected property found, misspelled?',
            expected: 'Properties defined in properties or matching patternProperties',
            received: object
        });
    }
    else if (typeof definition === 'object') {
        result = checkSubschema(definition, object);
    }
    else if (definition === true) {
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
const checkPatternProperties = (patternProperties, object, propertyName, checkSubschema) => {
    let result = new checkresult_1.CheckResult(undefined);
    Object.entries(patternProperties).forEach(([pattern, schema]) => {
        const regExp = new RegExp(pattern);
        if (regExp.test(propertyName)) {
            result = checkSubschema(schema, object);
            result.addToPath(propertyName);
        }
    });
    return result;
};
exports.checkPatternProperties = checkPatternProperties;
/**
 * Checks if all properties match the property definitions.
 * @param definition - The schema definition object.
 * @param object - The input data object to validate.
 * @param checkSubschema - Function to validate each subschema.
 * @returns A CheckResult indicating whether the object matches the property definitions.
 */
const checkProperties = (definition, object, checkSubschema) => {
    const result = new checkresult_1.CheckResult(true);
    const propertyDef = (0, checktype_1.isObject)(definition.properties) ? definition.properties : {};
    const patternProperty = (0, checktype_1.isObject)(definition.patternProperties) ? definition.patternProperties : false;
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
                const curResult = (0, exports.checkPatternProperties)(patternProperty, propertyObject, propertyName, checkSubschema);
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
const checkPropertyNames = (definition, object, checkSubschema) => {
    const result = new checkresult_1.CheckResult(true);
    if (definition !== undefined) {
        Object.keys(object).forEach(property => {
            result.addCheck(checkSubschema(definition, property), property);
        });
    }
    return result;
};
exports.checkPropertyNames = checkPropertyNames;
/**
 * Validates an object against a defined schema, including properties, dependencies, and constraints.
 * @param definition - Schema definition for the object.
 * @param object - Object to validate.
 * @param checkSubschema - Function to validate each aspect of the object.
 * @returns A CheckResult summarizing the validation.
 */
const checkObject = (definition, object, checkSubschema) => {
    const result = new checkresult_1.CheckResult(true);
    result.addCheck((0, exports.checkPropertyNames)(definition.propertyNames, object, checkSubschema));
    result.addCheck((0, exports.checkObjectConstraints)(definition, object));
    result.addCheck((0, exports.checkDependency)(definition.dependencies, object, checkSubschema));
    result.addCheck(checkProperties(definition, object, checkSubschema));
    result.addCheck((0, exports.checkRequiredProperties)(definition.required, object));
    return result;
};
exports.checkObject = checkObject;
//# sourceMappingURL=checkobject.js.map