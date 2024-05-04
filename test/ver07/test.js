/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

'use scrict'

const { CheckInput } = require('../../dist/checkinput')
const basePath = './'

class UnitTest {
    constructor(verbose = false) {
        this.verbose = verbose
        this.passed = 0
        this.failed = 0
    }

    assertEqual(actual, expected, message) {
        if (actual === expected) {
            this.passed++
            // console.log('Passed: ' + message)
        } else {
            this.failed++
            console.log('Failed: ' + message)
        }
    }

    log(message) {
        if (this.verbose) {
            console.log(message)
        }
    }

    showResult(total) {
        console.log('Passed: ' + this.passed + ' of ' + total)
        console.log('Failed: ' + this.failed + ' of ' + total)
    }

}
const VERBOSE = true
const unitTest = new UnitTest(VERBOSE)

/**
 * Reads a test set and processes it
 * @param {string} fileName name of the test file
 */
function checkSchema(fileName) {
    fileName = basePath + fileName + '.json'
    const definition = require(fileName)
    for (const schema of definition) {
        const check = new CheckInput(schema.schema)
        for (const test of schema.tests) {
            const result = check.validate(test.data)
            if (result !== test.valid) {
                // for debuggin, set breakpoint here
                check.validate(test.data)
            }
            unitTest.assertEqual(result, test.valid, fileName + ': ' + schema.description + ' - ' + test.description)
            if (result !== test.valid){
                unitTest.log(JSON.stringify(check.messages, null, 2))
                // unitTest.log(JSON.stringify(schema.schema, null, 2))
                unitTest.log(JSON.stringify(test.data, null, 2))
            }
        }
    }
}

const files = [
    'own-tests/error-messages',
    'additionalItems',
    'additionalProperties',
    'allOf',
    'anyOf',
    'boolean_schema',
    'const',
    'contains',
    'definitions',
    'dependencies',
    'default',
    'enum',
    'exclusiveMaximum',
    'exclusiveMinimum',
    'if-then-else',
    'items',
    'maximum',
    'maxItems',
    'maxLength',
    'maxProperties',
    'minimum',
    'minItems',
    'minLength',
    'minProperties',
    'multipleOf',
    'not',
    'oneOf',
    'pattern',
    'patternProperties',
    'properties',
    'propertyNames',
    'ref',
    // 'refRemote',
    'required',
    'rulevalidation',
    'type',
    'uniqueItems',
    'optional/bignum',
    // 'optional/content',
    // 'optional/ecmascript-regex',
    'optional/zeroTerminatedFloats',
    'optional/format/date'
]

for (const file of files) {
    checkSchema(file)
}

module.exports = {
    run: () => {unitTest.showResult(486)}
}
