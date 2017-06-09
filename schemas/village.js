module.exports = {
    "id": "Village",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of the Village"
        },
        "district":{
            "type": "object",
            "description": "District for this village",
            "type": "object",
            "$ref": "District"
        },
    }
}