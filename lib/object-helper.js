class ObjectHelper {
    static throwErrorIfPropertiesAreMissingInObject(propertyKeys, object) {
        for (const propertyKey of propertyKeys) {
            if (!object[propertyKey]) {
                throw new Error(`Error: ${propertyKey} is missing`);
            }
        }
    }
}
module.exports = ObjectHelper;