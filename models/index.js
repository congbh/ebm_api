module.exports = function (db) {
    return {
        "User": require("./user")(db),
        "Store": require("./store")(db),
        "Teacher": require("./teacher")(db),
        "Degree": require("./degree")(db),
        "Speciality": require("./speciality")(db),
        "Province": require("./province")(db),
        "District": require("./district")(db),
        "Village": require("./village")(db)
    }
}