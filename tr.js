const translator = require('node_modules/@parvineyvazov/json-translator');
let path = './app/config/default-files/default-languages/es-es/translations.json';
const getTags = async () => {
    try {
        await translator.translateFile(
            path,
            translator.languages.Spanish,
        );
    } catch(e) {
        console.log(e.message)
    }
}



