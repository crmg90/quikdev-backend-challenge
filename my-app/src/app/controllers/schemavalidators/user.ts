const editUserValidator = {
    additionalProperties: false,
    properties: {
        name: { type: 'string' },
        birthdate: { type: 'string', format: 'date' },
        address: { type: 'string' },
        addressNumber: { type: 'string' },
        primaryPhone: { type: 'string', validateCell: true },
        description: { type: 'string' }
    },
    required: [ 'name', 'address', 'addressNumber'],
    type: 'object',
}

const createUserValidator = {
    additionalProperties: false,
    properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        birthdate: { type: 'string', format: 'date' },
        address: { type: 'string' },
        addressNumber: { type: 'string' },
        primaryPhone: { type: 'string', validateCell: true },
        description: { type: 'string' },
        password: { type: 'string' }
    },
    required: [ 'name', 'email', 'username', 'address', 'addressNumber', 'password'],
    type: 'object',
}

const updateUserLocationValidator = {
    additionalProperties: false,
    properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
    },
    required: [ 'latitude', 'longitude'],
    type: 'object',
}

export {editUserValidator, createUserValidator, updateUserLocationValidator}
