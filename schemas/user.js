module.exports = {
    "id": "User",
    "properties": {
        "username": {
            "type": "string",
            "description": "The name of user",
            "required": true
        },
        "email": {
            "type": "string",
            "description": "The email of the user",
            "lowercase": true,
            "unique": true,
            "required": true
        },
        "password": {
            "type": "string",
            "description": "The email of the user",
            "required": true
        },
        "last_name": {
            "type": "string",
            "description": "The last name of user"
        },
        "first_name": {
            "type": "string",
            "description": "The first name of user"
        },
        "role": {
            "type": "string",
            "enum": ['Member', 'Client', 'Owner', 'Admin'],
            "default": 'Member'
        },
        "resetPasswordToken": { "type": "string" },
        "resetPasswordExpires": { "type": "date" }
    }
}