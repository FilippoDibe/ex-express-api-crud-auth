const tagData = {
    name: {
        in: ["body"],
        notEmpty: {
            errorMessage: 'Il nome è un campo obbligatorio.',
            bail: true
        },
        isString: {
            errorMessage: 'Il nome deve essere una stringa.',
            bail: true
        },
        isLength: {
            errorMessage: 'Il nome deve essere di almeno 3 caratteri',
            options: { min: 3 }
        }
    }
};

module.exports = { tagData };  // Assicurati che l'oggetto sia correttamente esportato

