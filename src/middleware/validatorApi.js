const ValidatorApi = {
    validateRequiredFields(object, requiredFields) {
        const missingFields = [];

        requiredFields.forEach(field => {
            if (object[field] === undefined || object[field] === null) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return {
                success: false,
                missingFields: missingFields,
                message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
            };
        }

        // Si todos los campos requeridos están presentes, devuelve true
        return { success: true };
    }
}

module.exports = ValidatorApi;
