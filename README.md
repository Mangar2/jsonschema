<!-- This file is generated by jsmddoc version 0.1 -->

# Abstract

JSON schema validator matching standard version 0 . 7

## Contents

- [Meta](#Meta)
- [Global Functions](#Global-functions)
  - [_checkPropertyNames](#_checkPropertyNames)
- [Class CheckInput](#Class-CheckInput)
  - [Parameters](#CheckInput-Parameters)
  - [Members](#CheckInput-Members)
  - [Methods](#CheckInput-Methods)
    - [throwOnValidationError](#throwOnValidationError)
    - [validate](#validate)

## Meta

| | |
| --- | --- |
| **File** | checkinput.js |
| **Abstract** | JSON schema validator matching standard version 0 . 7 |
| **Author** | Volker Böhm |
| **Copyright** | Copyright ( c ) 2020 Volker Böhm |
| **License** | This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3 . It is furnished "as is" , without any support , and with no warranty , express or implied , as to its usefulness for any purpose . |

## Global functions

### _checkPropertyNames

`_checkPropertyNames (definition, object, checkSubschema) => {CheckResult}`

Checks the property names

#### _checkPropertyNames Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `definition` | `Object` | property names schema definition | |
| `object` | `Object` | object to check | |
| `checkSubschema` | `function` | ( definition , data ) | |

#### _checkPropertyNames returns

| Type | Description |
| ---- | ----------- |
| `CheckResult` | result of the check with 'check' and 'message' |

## Class CheckInput

`new CheckInput(definition, options)`

Creates a new JSON Schema validation class to validate a data object according to a JSON Schema . Many thanks to epoberezkin/JSON-Schema-Test-Suite for providing a cool test suite . I use it to check my implementation This is not ( yet ) a complete implementation . The following tests are not running yet :

- remote-refs ( neither local nor remote )
- unicode-code-points ( EmacsScript length is used to get the lengt of a string ) definitions

### Example

```javascript
check = new CheckInput({
  type: 'object',
  properties: {
      topic: { type: 'string' },
      value: { type: 'string' },
  },
  required: ['topic', 'value']
})
// returns true, as the parameter fits to the descriptions
check.validate({ topic: '/a/b', value: 'on' })

// returns false and fills the error message
// check.message is { topic: 'missing property topic', value: 'missing property value' }
check.validate ( {} )

// Throws an Error, as the validation does not fits to the description
check.throwOnValidationError({ topic: '/a/b' })

// Prints the error message
console.log(check.messages)
```

### CheckInput Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `definition` | `Any` | JSON schema definition | |
| `options` | `Object` | schema validation options | |

#### options properties

| Name | Type | Attribute | Default | Description |
| ---------- | ------------ | ------------ | ------------ | ----------------- |
| `deepUnique` | `boolean` | optional | true | if true , the content is checked deeply . For example different objects with the same | |
| `stringToNumber` | `boolean` | optional | false | if true , strings containing numbers are automatically converted | |

### CheckInput Members

| Name | Type | description |
| ------------ | ------------ | ------------ |
| `messages` | `Object, string` | Gets the list of error messages |

### CheckInput Methods

#### throwOnValidationError

`throwOnValidationError (data, message)`

Validates the input and throws a message on error

##### throwOnValidationError Parameters

| Name | Type | Attribute | Default | Description |
| ---------- | ------------ | ------------ | ------------ | ----------------- |
| `data` | `Object` |  |  | data to check against definition | |
| `message` | `string` | optional | '' | starting string of the error message | |

#### validate

`validate (data) => {boolean}`

Checks an object against a swagger defintion

##### validate Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `data` | `Object` | data to check against definition | |

##### validate returns

| Type | Description |
| ---- | ----------- |
| `boolean` | true , if the data matches to the definition else false |