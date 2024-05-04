/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRef = void 0;
/**
 * Retrieves a schema definition by its unique identifier.
 * @param id - The identifier of the schema to find.
 * @param definitions - The collection of subschema definitions.
 * @returns The schema definition if found, otherwise undefined.
 */
const getSchemaById = (id, definitions) => {
    for (const property in definitions) {
        const definition = definitions[property];
        if (definition.$id === id) {
            return definition;
        }
    }
    return undefined;
};
/**
 * Retrieves a schema using a local JSON path.
 * @param path - The JSON path to the schema definition.
 * @param definition - The root schema definition.
 * @returns The schema definition located at the specified path.
 */
const getSchemaByPath = (path, definition) => {
    const pathChunks = path.split('/');
    pathChunks.shift(); // Remove the first empty element from leading slash
    let result = definition;
    for (let chunk of pathChunks) {
        const decodedChunk = decodeURIComponent(chunk.replace(/~1/g, '/').replace(/~0/g, '~'));
        result = result && result[decodedChunk];
        if (result === undefined) {
            break;
        }
    }
    return result;
};
/**
 * Resolves a JSON schema reference string and returns the corresponding schema part.
 * @param id - The reference ID or path within the schema definition.
 * @param definitionRoot - The full schema definition from which references are resolved.
 * @returns The part of the schema definition referenced.
 */
const resolveRef = (id, definitionRoot) => {
    var _a;
    const isLocal = id.startsWith('#');
    if (!isLocal) {
        return undefined;
    }
    const isPath = (id === '#' || (id === null || id === void 0 ? void 0 : id.charAt(1)) === '/');
    if (isPath) {
        return getSchemaByPath(id, definitionRoot);
    }
    else {
        const definitions = (_a = definitionRoot.$defs) !== null && _a !== void 0 ? _a : definitionRoot.definitions;
        return getSchemaById(id, definitions);
    }
};
exports.resolveRef = resolveRef;
//# sourceMappingURL=resolveref.js.map