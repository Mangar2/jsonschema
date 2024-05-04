/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
/**
 * Resolves a JSON schema reference string and returns the corresponding schema part.
 * @param id - The reference ID or path within the schema definition.
 * @param definitionRoot - The full schema definition from which references are resolved.
 * @returns The part of the schema definition referenced.
 */
export declare const resolveRef: (id: string, definitionRoot: any) => any;
