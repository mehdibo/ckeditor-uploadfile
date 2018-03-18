CKEDITOR.plugins.add('uploadFile', {
	requires : 'notification',
	lang : 'en',
	icons : 'uploadFile',
	init : function(editor) {
		// Get config data
		var config = editor.config.uploadFile;
		// Set default settings
		CKEDITOR.tools.extend(config, {
			accept : '.png,.jpg,.jpeg,.gif,.pdf', // Accepted file types, *
													// means all files
			maxFileSize : 0, // Maximum size in bytes, 0 means unlimited
			uploadHandler : '', // URL to the file upload handler
			inputName : 'file', // The file input name
			extraFormData : '', // Object of field:value to send with the upload
								// request
		});

		// If no upload handler is set
		if (config.uploadHandler === '') {
			console.log("%c" + "uploadFile CKplugin: You need to set a handler for the upload",
					"color:red");
			return;
		}
		var lang = editor.lang.uploadFile;
		// Add the button to the UI
		editor.ui.addButton('uploadFile', {
			label : lang.label,
			command : 'uploadFile',
			toolbar : 'insert'
		});

		// Add a command to the editor
		editor.addCommand('uploadFile', {
			// Function to be executed
			exec : function(editor) {
				// Create the file input
				input = document.createElement('input');
				// Add attributes
				input.setAttribute('type', 'file');
				input.setAttribute('name', config.inputName);
				input.setAttribute('accept', config.accept);
				// Trigger a click
				input.click();
				// Wait for the user to upload a file
				input.onchange = function() {
					// Get file data
					file = input.files[0];
					// Get file extension
					var file_ext = '.' + file.name.split('.').pop();

					// Get allowed file extensions
					var allowed_exts = $.map(config.accept.split(','), $.trim);

					// Check if the file type is allowed
					if($.inArray(file_ext, allowed_exts) === -1 && config.accept != '*'){
						console.log(file_ext, allowed_exts);
						// Show notification
						config.notification = editor.showNotification(
								lang.file_not_supported + config.accept,
								'warning');
						return;
					}

					// Check file size
					if (file.size > config.maxFileSize
							&& config.maxFileSize != 0) {
						// Show notification
						config.notification = editor.showNotification(
								lang.file_too_big, 'warning');
						return;
					}

					// Start upload
					// Prepare form data
					formData = new FormData;
					formData.append(config.inputName, file, file.name);

					// Check if there is extra form data to submit
					for ( const prop in config.extraFormData) {
						formData.append(prop, config.extraFormData[prop]);
					}
					// Submit the file
					$.ajax({
						url : config.uploadHandler,
						type : 'POST',
						data : formData,
						processData : false,
						contentType : false,
						dataType : 'json',
						beforeSend : function() {
							editor.setReadOnly(true);
							// Show notification
							config.notification = editor.showNotification(
									lang.uploading_file, 'info');
						},
						complete : function(data) {
							// If status is not 200 (OK) stop
							if(data.status != 200){
								return;
							}
							// When the request finishes
							// For a mysterious reason editor.insertElement Doesn't work under the success
							// Remove the read only state from the editor
							editor.setReadOnly(false);
							// Show notification
							config.notification.update({
								type : 'success',
								message : lang.file_uploaded
							});
							// Get the URL
							var url = data.responseJSON.url;
							// Check if the uploaded file is an image
							if (file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
								// Create an image
								var elem = editor.document.createElement('img');
								elem.setAttribute('src', url);
							} else {
								// Create an anchor
								var elem = editor.document.createElement('a');
								elem.setAttribute('href', url);
								elem.setText(url);
							}
							editor.focus();
							// Insert it into the editor
							editor.insertElement(elem);
						},
						error : function(jqXHR, textStatus, errorThrown) {
							// Show notification
							config.notification.update({
								type : 'warning',
								message : errorThrown
							});
						}
					});
				};
			}
		});

	}
})