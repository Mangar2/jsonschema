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

const { CheckJson } = require('../../dist/index')
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
        if (this.passed === total) {
            console.log('All tests passed!')
        }
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
        const check = new CheckJson(schema.schema)
        for (const test of schema.tests) {
            const testSchema = check.testSchema()
            if (!testSchema.result) {
                unitTest.assertEqual(true, false, fileName + ': ' + schema.description + ' - ' + test.description)
                console.log(testSchema.messagesAsString)
                // for debuggin, set breakpoint here
                check.testSchema()
                continue
            }
            const testResult = check.validate(test.data)
            if (testResult.result !== test.valid) {
                // for debuggin, set breakpoint here
                check.validate(test.data)
            }
            unitTest.assertEqual(testResult.result, test.valid, fileName + ': ' + schema.description + ' - ' + test.description)
            if (testResult.result !== test.valid) {
                console.log(testResult.messagesAsString)
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
    run: () => {unitTest.showResult(488)}
}
