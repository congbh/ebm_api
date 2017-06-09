module.exports = {
    "id": "Province",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of the province"
        },
        "districts": {
            "type": "array",
            "description": "List of districts of the province",
            "items": {
                "$ref": "District"
            }
        }
    }
}