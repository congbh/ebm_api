module.exports = {
    "id": "Teacher",
    "properties": {
        "first_name": {
            "type": "string",
            "description": "First name of the teacher"
        },
        "last_name": {
            "type": "string",
            "description": "Last name of the teacher"
        },
        "dob": {
            "type": "string",
            "description": "Date of birth of this teacher"
        },
        "gender": {
            "type": "string",
            "description": "Gender of this teacher"
        },
        "id_card": {
            "type": "string",
            "description": "Identity Card of this teacher"
        },
        "phone_number": {
            "type": "string",
            "description": "Phone numbers of this teacher"
        },
        "address": {
            "type": "string",
            "description": "Address for the teacher"
        },
        "email": {
            "type": "string",
            "description": "Teacher's email"
        },
        "teacher_number": {
            "type": "number",
            "description": "Unique identifier of the employee"
        },
        "degree": {
            "type": "object",
            "description": "Degree for this teacher",
            "type": "object",
            "$ref": "Degree"
        },
        "speciality": {
            "type": "object",
            "description": "Specialized for this teacher",
            "type": "object",
            "$ref": "Speciality"
        }
    }
}