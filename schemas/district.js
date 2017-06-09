module.exports = {
    "id": "District",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of the district"
        },
        "province":{
            "type": "object",
            "description": "Province for this district",
            "type": "object",
            "$ref": "Province"
        },
        "villages": {
            "type": "array",
            "description": "List of villages of the district",
            "items": {
                "$ref": "Village"
            }
        }
    }
}