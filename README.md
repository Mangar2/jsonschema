<!-- This file is generated by jsmddoc version 0.1 -->

# Abstract

JSON schema validator matching standard version 0.7. It is developed in typescript and can be installed without installing any other libraries. 


## Contents

- [Meta](#Meta)
- [Not Supported](#not-supported-of-standard-07)
- [Class CheckJson](#Class-CheckJson)
  - [Parameters](#CheckJson-Parameters)
  - [Members](#CheckJson-Members)
  - [Methods](#CheckJson-Methods)
    - [throwOnValidationError](#throwOnValidationError)
    - [validate](#validate)
    - [getErrorAsString](#geterrorasstring)
    - [testSchema](#testschema)

## Meta

| | |
| --- | --- |
| **File** | index.ts |
| **Abstract** | JSON schema validator matching standard version 0 . 7 |
| **Author** | Volker Böhm |
| **Copyright** | Copyright ( c ) 2024 Volker Böhm |
| **License** | This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3 . It is furnished "as is" , without any support , and with no warranty , express or implied , as to its usefulness for any purpose . |

## Not supported (of standard 0.7)

* Access to remote schemas (via http/https)
* Content checks (JSON or base64 files)
* Ecmascript-regex 

## Class CheckJson

`new CheckJson(definition, options)`

Creates a new JSON Schema validation class to validate a data object according to a JSON Schema . Many thanks to epoberezkin/JSON-Schema-Test-Suite for providing a cool test suite . I use it to check my implementation This is not ( yet ) a complete implementation . The following tests are not running yet :

- remote-refs ( neither local nor remote )
- unicode-code-points ( EmacsScript length is used to get the lengt of a string ) definitions

### Example

```javascript
check = new CheckJson(schema)
// Validates a schema against the schema definition
check.validate({ topic: '/a/b', value: 'on' })

// get all error messages 
const messages = check.messages

// Throws an Error, if the validation fails. The error message contains all errors (truncated if the length exceeded 512 characters)
check.throwOnValidationError({ topic: '/a/b' })

// Tests, if the schema is a valid schema. This will not be tested automatically elsewhere!
// 
check.testSchema();
console.log(check.getErrors());
```

### CheckJson Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `definition` | `Any` | JSON schema definition | |
| `options` | `Object` | schema validation options | |

#### options properties

| Name | Type | Attribute | Default | Description |
| ---------- | ------------ | ------------ | ------------ | ----------------- |
| `deepUnique` | `boolean` | optional | true | if true , the content is checked deeply . For example different objects with the same | |
| `stringToNumber` | `boolean` | optional | false | if true , strings containing numbers are automatically converted | |

### CheckJson Members

| Name | Type | description |
| ------------ | ------------ | ------------ |
| `messages` | `Object, string` | Gets the list of error messages |

### CheckJson Methods

#### throwOnValidationError

`throwOnValidationError (data, message)`

Validates the input and throws a message on error

##### throwOnValidationError Parameters

| Name | Type | Attribute | Default | Description |
| ---------- | ------------ | ------------ | ------------ | ----------------- |
| `data` | `Object` |  |  | data to check against definition | |
| `message` | `string` | optional | '' | starting string of the error message | |

#### validate

`validate (data) => {CheckJsonResult}`

Checks an object against the schema

##### validate Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `data` | `Object` | data to check against schema | |

##### validate returns

| Type | Description |
| ---- | ----------- |
| `CheckJsonResult` | {result: boolean, messages: message[], messagesAsString: string} |

#### getErrorAsString

`getErrorAsString (truncateLength: number = 512):string`

Gets the error message as a string truncated by an amount of characters

##### getErrorAsString Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `truncateLength` | `number` | maximal amount of characters | |

##### getErrorAsString returns

| Type | Description |
| ---- | ----------- |
| `string` | the error message as string |

#### testSchema

`testSchema ():boolean`

Tests, if the current schema is valid. This will not be tested, when checking the data.

##### testSchema returns

| Type | Description |
| ---- | ----------- |
| `CheckJsonResult` | {result: boolean, messages: message[], messagesAsString: string} |

