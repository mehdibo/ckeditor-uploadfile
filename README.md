# ckeditor-uploadfile
This is a tiny CKEditor to upload files insinde your editor.

# Installation
Move the `plugin` folder inside your CKEditor plugins folder and enable it in your `config.js`
by adding `uploadFile` to `config.extraPlugins`

# Configuration
Available configurations are:

    uploadFile: {
        accept: '.png,.jpg,.jpeg,.gif,.pdf', // Allowed extensions, * to allow all files
        maxFileSize: 0, // Maximum size in bytes
        uploadHandler: 'URL', // URL to the file upload handler (to where submit the file)
        inputName: 'file', // File name (input name)
        extraFormData: { // Any extra form data that should be sent with the request
            'name': 'value',
        },
    },

# Usage
The upload handler must return a JSON response containing the URL to the file and a 200 status header.
If you want to pass an error message, you need to set the status header to 500 (or any other error header) and pass the message
along the header, for example in PHP:

`header('Status: 500 The file you uploaded is too big');`

# Contributions
If you have any suggestions or report please open an issue or a pull request, all contributions are welcome.
