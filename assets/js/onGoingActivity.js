/*-------------------------------------JS FOR VIEW MODAL:AKANSHA-------------------------------------*/

// Function to check status and enable evaluate button (Give Test)
function checkStatusAndEnableEvaluateButton(trainingId) {
	var empId = $("#employeeId").val();
	var trainingId = trainingId;

	// Disable both buttons by default
	$('#startInterviewButton').prop('disabled', true);
	$('#openAssessmentButton').prop('disabled', true);

	$.ajax({
		type: "GET",
		url: "getSingleFlagsAndResult",
		data: {
			empId: empId,
			trainingId: trainingId
		},
		contentType: "application/json",
		success: function(response) {
			if (response.statusCode === 200) {
				var payload = response.payload;
				var result = payload.result;
				var assessmentFlag = payload.assessmentFlag;
				var vedioAssessmentFlag = payload.vedioAssessmentFlag;

				// Condition 1: Both N and Not Attempted -> both disabled (default)

				// Condition 2: Both Y and Not Attempted -> Give Test enabled, Video disabled
				if (assessmentFlag === "Y" && vedioAssessmentFlag === "Y" && result === "Not Attempted") {
					$('#openAssessmentButton').prop('disabled', false);
					$('#startInterviewButton').prop('disabled', true);
				}
				// Condition 3: Passed and both Y -> Video enabled, Give Test disabled
				else if (result === "Passed" && assessmentFlag === "Y" && vedioAssessmentFlag === "Y") {
					$('#startInterviewButton').prop('disabled', false);
					$('#openAssessmentButton').prop('disabled', true);
				}
				// Condition 4: Assessment Y, Video N, and not Not Attempted -> Give Test enabled
				else if (assessmentFlag === "Y" && vedioAssessmentFlag === "N" && result !== "Not Attempted") {
					$('#openAssessmentButton').prop('disabled', false);
					$('#startInterviewButton').prop('disabled', true);
				}
				// Other cases: both disabled (already set)
			}
		},
		error: function(err) {
			console.error("Error occurred:", err.responseText);
			// On error, keep both disabled
		}
	});
}

// Function to check video present and enable video test button
function checkVideoPresentOrNot(trainingId) {
    // Temporarily enable the button without AJAX since endpoint is missing
    $('#startInterviewButton').prop('disabled', false);
}

const modalButtons = document.querySelectorAll('[id^=onGoingActivityModalButton]');

const onGoingActivityModal = document.getElementById('onGoingActivity');

function openOnGoingActivityModal(trainingId) {
	//alert("hi")
	if (typeof trainingId !== 'undefined' && trainingId !== null) {
		localStorage.setItem('currentTrainingId', trainingId);
		showLoadingIndicator();

		$.ajax({
			url: 'getTrainingAndDocuments?trainingId=' + trainingId,
			type: 'GET',
			success: function(response) {
				hideLoadingIndicator();

				$('#trainingId').val(response.payload.id);
				$('#trainingName').val(response.payload.trainingName);
				$('#trainingDescription').val(response.payload.trainingDescription);

				$('#trainingDocuments').val('');
				$('#documentsName').val('');
				$('#documentFileContainer').empty();
				$('#documentNameContainer').empty();

				response.payload.trainingDocumentList.forEach(function(document) {
					$('#trainingDocuments').val($('#trainingDocuments').val() + document.documentType + ', ');
					$('#documentsName').val($('#documentsName').val() + document.documentName + ', ');

					displayDocumentFile(document.documentType, document.documentFile, document.documentName, document.id,document.url);
				});

				$('#trainingDocuments').val($('#trainingDocuments').val().replace(/, $/, ''));
				$('#documentsName').val($('#documentsName').val().replace(/, $/, ''));
				
				if (response.payload.assessmentFlag === "N") {
									$('#displayDocumentTable tfoot').hide(); 
								} else {
									$('#displayDocumentTable tfoot').show(); 
								}

				var hasVideoDocuments = response.payload.trainingDocumentList.some(function(document) {
					return document.documentType === 'Video';
				});

				fetchQuestionTypes(trainingId, hasVideoDocuments);

				onGoingActivityModal.style.display = 'block';
			},
			error: function(xhr, status, error) {
				console.error(xhr.responseText);
				console.error("Status: " + status);
				console.error("Error: " + error);
				alert('Error fetching training details' + trainingId);
			}
		});
	} else {
		alert('Invalid training ID');
	}
}


function showLoadingIndicator() {
    Swal.fire({
        title: 'Please wait...',
        html: '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });
}

function hideLoadingIndicator() {
    Swal.close();
}


        function playVideo(fileName) {
			showLoadingIndicator();
			//alert("hlo")
           // var fileName = "Guard NG 2.1.1Features2.mp4_3469_3470"; // Replace with your video file name
            var videoUrl = "./play-video/" + fileName; 

            fetch(videoUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
				hideLoadingIndicator();
                // Create a blob URL for the video
                var videoBlobUrl = URL.createObjectURL(blob);
//alert("hey")
                // Set the source of the video element to the blob URL
                document.getElementById("videoDocuments").src = videoBlobUrl;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }

        // Call the function to play the video when the page loads
       // playVideo();
/*------------------------------ JS FOR BUTTON MODAL LOOP-------------------------------------------*/

modalButtons.forEach(button => {
	button.addEventListener('click', function() {
		var trainingId = $(this).data('training-id');
		openOnGoingActivityModal(trainingId);
	});
});

onGoingActivityModal.addEventListener('click', function(event) {
	if (event.target === onGoingActivityModal) {
		onGoingActivityModal.style.display = 'none';
	}
});

const closeModalButton = document.querySelector('#onGoingActivity .close');
closeModalButton.addEventListener('click', function() {
	onGoingActivityModal.style.display = 'none';
	localStorage.removeItem('currentTrainingId');
	location.reload();
});


const container = $('#documentFileContainer');

container.on('click', '.thumbnail', function() {
	const documentType = $(this).data('document-type');
	const documentFile = $(this).data('document-file');

	if (documentType === 'PDF') {
	} else if (documentType === 'VIDEO') {
		window.open(`data:video/mp4;base64,${documentFile}`, '_blank');
	} else if (documentType === 'MP3') {
	}
});


/*-----------------------------JS FOR DISPLAY DOCUMENTS IN MODAL------------------------------------*/
function displayDocumentFile(documentType, documentFile, documentName, documentId, url) {
	const tableBody = $('#displayDocumentTable tbody');

	let content = '';
	if (documentType === 'PDF') {
		content = `<tr>
            <td>${documentName}</td>
            <td>${url}</td>
            <td>
                <div class="thumbnail pdf" data-document-type="PDF" data-document-file="${documentFile}" data-document-id="${documentId}">
                    <button type="button" class="submit-btn" onclick="updateStatusInProgress('${documentId}')">View</button>
                </div>
            </td>
        </tr>`;
	} else if (documentType === 'Video') {
		content = `<tr>
            <td>${documentName}</td>
            <td></td>
            <td>
                <div class="thumbnail video" data-document-type="Video" data-document-file="${documentFile}" data-document-id="${documentId}">
                    <button type="button" class="submit-btn" onclick="updateStatusInProgress('${documentId}');playVideo('${documentName}');">Play</button>
                </div>
            </td>
        </tr>`;
	} else if (documentType === 'Documents') {
		content = `<tr>
            <td>${documentName}</td>
            <td>${url}</td>
            <td>
                <div class="thumbnail document" data-document-type="Documents" data-document-file="${documentFile}" data-document-id="${documentId}">
                    <a href="data:application/octet-stream;base64,${documentFile}" download="${documentName}">Download Document</a>
                    <button type="button" class="submit-btn" onclick="updateStatusInProgress('${documentId}')">View</button>
                </div>
            </td>
        </tr>`;
	} else if (documentType === 'MP3') {
		content = `<tr>
            <td>${documentName}</td>
            <td>${url}</td>
            <td>
                <div class="thumbnail mp3" data-document-type="MP3" data-document-file="${documentFile}" data-document-id="${documentId}">
                    <button type="button" class="submit-btn" onclick="updateStatusInProgress('${documentId}')">Play</button>
                </div>
            </td>
        </tr>`;
	} else 		if (documentType === 'YoutubeLink') {
		    content = `<tr>
		        <td>${documentName}</td>
		        <td class="clickable-link" data-document-id="${documentId}" data-url="${url}" style="cursor:pointer; color:blue;">Click Here</td>
		        <td>
		            <div class="thumbnail youtube-link" data-document-type="YoutubeLink" data-document-id="${documentId}" data-url="${url}">
		                <a href="javascript:void(0);" target="_blank"><i class="fa-brands fa-youtube" style="color: #443ea2; font-size:4rem;"></i></a>
		            </div>
		        </td>
		    </tr>`;
		}


	tableBody.append(content);

	const nameContainer = $('#documentNameContainer');
	const urlContainer = $('#documentUrlContainer');

	const urlContent = `<div><p>${url}</p></div>`;
	urlContainer.append(urlContent);

	const nameContent = `<div><p>${documentName}</p></div>`;
	nameContainer.append(nameContent);
}

/*---------------------------JS FOR OPEN DOCUMENTS( PDF, VIDEO, MP3)--------------------------------*/

$('#displayDocumentTable tbody').on('click', '.thumbnail', function() {
    const documentType = $(this).data('document-type');
    const documentFile = $(this).data('document-file');
    const documentName = $(this).data('document-name');
    const documentId = $(this).data('document-id');

	const documentIdDisplay = `<p>Document ID: ${documentId}</p>`;

	if (documentType === 'PDF') {
		const pdfIframe = `<iframe src="data:application/pdf;base64,${documentFile}" frameborder="0" width="100%" height="90%"></iframe>
        <button type="button" class="audioVideoButton" onclick="updateStatusComplete('${documentId}')">Complete</button>`;
		$('#pdfModalBody').html(documentIdDisplay + pdfIframe);
		$('#pdfModal').modal('show');
		$('.modal-header .close').on('click', function() {
        $('#pdfModal').modal('hide');
        });
		// ...
	 } else if (documentType === 'Video') {
    const storedPositionKey = `videoPlaybackPosition_${documentId}`;

    let storedPosition = localStorage.getItem(storedPositionKey);
    storedPosition = storedPosition ? parseFloat(storedPosition) : 0;

    const videoElement = `<div>
                            <video id="videoDocuments" width="700" height="350" class="col-md-12" controlsList="nodownload" controls>
                                <source src="data:video/mp4;base64,${documentFile}" type="video/mp4">
                                Your browser does not support the video tag.
                             </video>
                             <div class="video-controls">
                                <button type="button" class="playPauseButton" onclick="togglePlayPause('${documentId}')" style="display:none">Play</button>
                                <button type="button" class="audioVideoButton" onclick="updateStatusComplete('${documentId}')" disabled>Complete</button>
                             </div>
                          </div>`;

    $('#videoModalBody').html(documentIdDisplay + videoElement);
    $('#videoModal').modal('show');
    $('.modal-header .close').on('click', function () {
        $('#videoModal').modal('hide');
    });

    const video = document.getElementById('videoDocuments');
    const playPauseButton = $('.playPauseButton');
    const completeButton = $('.audioVideoButton');

    video.currentTime = storedPosition;

    video.addEventListener('ended', function () {
        completeButton.removeAttr('disabled');
    });

    playPauseButton.on('click', function () {
        togglePlayPause(documentId);
    });

    completeButton.on('click', function () {
        updateStatusComplete(documentId);
    });

    video.addEventListener('pause', function () {
        localStorage.setItem(storedPositionKey, video.currentTime);
    });

    function togglePlayPause(documentId) {
        if (video.paused) {
            video.play();
            playPauseButton.text('Pause');
        } else {
            video.pause();
            playPauseButton.text('Play');
        }
    }
}
 else if (documentType === 'MP3') {
		const audioElement = `<audio id="audioDocuments" class="col-md-12" controls>
                            <source src="data:audio/mp3;base64,${documentFile}" type="audio/mp3">
                            Your browser does not support the audio tag.
                         </audio>
                         <button type="button" class="audioVideoButton" onclick="updateStatusComplete('${documentId}')" disabled >Complete</button>`;

		$('#audioModalBody').html(documentIdDisplay + audioElement);
		$('#audioModal').modal('show');
          $('.modal-header .close').on('click', function() {
           $('#audioModal').modal('hide');
        });
		const audio = document.getElementById('audioDocuments');
		const button = $('.audioVideoButton');

		audio.addEventListener('ended', function() {
			button.removeAttr('disabled');
		});
	} else if (documentType === 'Documents') {
		if (documentFile.toLowerCase().includes('base64,')) {
			const docViewerLink = `https://docs.google.com/viewer?url=data:application/msword;base64,${documentFile}`;
			const docIframe = `<iframe src="${docViewerLink}" frameborder="0" width="100%" height="100%"></iframe>
               <button type="button" class="audioVideoButton" onclick="updateStatusComplete('${documentId}')">Complete</button>`;
			$('#docModalBody').html(documentIdDisplay + docIframe);
			$('#docModal').modal('show');
			// ...
		} else {
			const downloadLink = `<a href="data:application/octet-stream;base64,${documentFile}" download="${documentName}">Download Document</a>`;
			$('#documentModalBody').html(documentIdDisplay + downloadLink);
			$('#documentModal').modal('show');
			$('.modal-header .close').on('click', function() {
             $('#docModal').modal('hide');
        });
		}
	}	else if (documentType === 'YoutubeLink') {
	    const youtubeIframe = `<iframe width="700" height="350" src="${documentFile}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
	                            <button type="button" class="audioVideoButton" onclick="updateStatusComplete('${documentId}')">Complete</button>`;

	    $('#youtubeModalBody').html(documentIdDisplay + youtubeIframe);
	    $('#youtubeModal').modal('show');
	    
	    $('.modal-header .close').on('click', function() {
	        $('#youtubeModal').modal('hide');
	    });
	}

});



/*---------------------------JS FOR STATUS UPDATE "IN PROGRESS"--------------------------------*/
function updateStatusInProgress(documentId) {
	var id = documentId;
	var trainingData = {
		trainingId: $("#trainingId").val(),
		documentId: id,
		empId: $("#employeeId").val()
	};
	console.log(trainingData);
	$.ajax({
		url: 'setStatusInProgress',
		type: 'POST',
		data: trainingData,
		success: function(response) {
		},
		error: function(xhr, status, error) {

			console.error('Error updating status:', xhr.responseText);
		}
	});
}

/*---------------------------JS FOR STATUS UPDATE "COMPLETE"--------------------------------*/

function updateStatusComplete(documentId) {
	var id = documentId;
	var trainingData = {
		trainingId: $("#trainingId").val(),
		documentId: id,
	    empId: $("#employeeId").val()
	};
	console.log(trainingData);
	$.ajax({
		url: 'setCompleteStatus',
		type: 'POST',
		data: trainingData,
		success: function(response) {
			console.log(response.payload)
			Swal.fire('Success', 'Media Completed Successfully', 'success').then(function () {
				// Instead of location.reload(), call the check functions to enable buttons
				var trainingId = $("#trainingId").val();
				checkStatusAndEnableEvaluateButton(trainingId);
				checkVideoPresentOrNot(trainingId);
			});
		    
		},
		
		error: function(xhr, status, error) {

			console.error('Error updating status:', xhr.responseText);
		}
	});
}



 /*--------------------------------------MODAL ON EVALUATION BUTTON----------------------------------*/
 
 const openAssessmentButton = document.getElementById('openAssessmentButton');
const assessmentModal = document.getElementById('assessmentModal');

function openAssessmentForm() {
   assessmentModal.style.display = 'block';
}

function closeAssessmentModal() {
   assessmentModal.style.display = 'none';
}


openAssessmentButton.addEventListener('click', function() {
   openAssessmentForm();
   closeDialogBoxModal(); 
});


const closeAssessmentButton = document.querySelector('#assessmentModal .close');
closeAssessmentButton.addEventListener('click', closeAssessmentModal);

/**************************************************FETCH QUESTIONS ON EVALUATION FORM*************************************************** */

function getQuestionsByTrainingId() {

	var trainingId= $("#trainingId").val();

	$.ajax({
		type: 'GET',
		url: 'getAllQuestionsByTrainingId?trainingId=' + trainingId,
		success: function(response) {
			console.log(response.payload);
				populateFormWithQuestions(response.payload);
			
		},
		error: function(error) {
			alert('Error fetching questions: ' + error);
		}
	});
}

/*********************************************************POPULATE QUESTIONS************************************************** */



function populateFormWithQuestions(questions) {


	const formPreview = document.getElementById('form-preview');



	questions.forEach(function(question) {

		const questionDiv = document.createElement('div');

		questionDiv.className = 'question';



		const questionTextInput = document.createElement('textarea');

		questionTextInput.className = 'inputForm';

		questionTextInput.style = 'background-color: #f0eeee; padding-left: 2%; padding-top: 2%; font-size:18px; width:100%; height: 4rem; border-radius:10px;s';

		questionTextInput.name = 'questionText';

		questionTextInput.value = question.questionText;



		const questionIdField = document.createElement('input');

		questionIdField.type = 'hidden';

		questionIdField.name = 'questionId';

		questionIdField.value = question.questionId;

		questionDiv.appendChild(questionIdField);



		// Create option for "RadioButton" type (assuming only this type is available)

		const option = document.createElement('option');

		option.value = 'RadioButton';

		option.textContent = 'RadioButton';

		option.selected = true;



		const formPreview = document.getElementById('form-preview');



		questionDiv.appendChild(questionTextInput);

		formPreview.appendChild(questionDiv);



		const hr = document.createElement('hr');

		hr.style = "border: 1.5px solid #443ea2;"

		formPreview.appendChild(hr);

		const br = document.createElement('br');



		formPreview.appendChild(br);



		// Add options if available

		const options = question.questionOptions ? question.questionOptions.split(',') : [];

		options.forEach(optionText => {

			addRadioOption(questionDiv, optionText);

		});

	});

}



function addRadioOption(questionDiv, optionText) {

	const radioInput = document.createElement('input');

	radioInput.className = 'inputForm option-input';

	radioInput.type = 'radio';

	radioInput.style = 'width:5%; ';

	questionDiv.appendChild(radioInput);



	const optionElement = document.createElement('input');

	optionElement.className = 'inputForm option-input';

	optionElement.style = 'width:95%; ';

	optionElement.value = optionText || '';

	questionDiv.appendChild(optionElement);

}


/*************************************************************JS TO PLAY YOUTUBE VIDEO********************************************************************* */
$('#documentTableBody').on('click', 'tr', function(event) {
    if ($(event.target).is('td:nth-child(2)')) {
        const clickedUrl = $(this).find('.thumbnail').data('url');
        const documentId = $(this).find('.clickable-link').data('document-id');
        playYouTubeVideo(clickedUrl, documentId);
    }
});

function playYouTubeVideo(videoUrl, documentId) {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
        const container = document.getElementById('youtubeModalBody');
        container.innerHTML = `
            <iframe id="youtubePlayer" width="100%" height="500" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allowfullscreen></iframe>
            <p>Document ID: ${documentId}</p>
            <button type="button" class="audioVideoButton" onclick="updateStatusComplete('${documentId}')" disabled>Complete</button>
        `;
        $('#youtubeModal').modal('show');
        $('.modal-header .close').on('click', function() {
            $('#youtubeModal').modal('hide');
        });

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function() {
            const player = new YT.Player('youtubePlayer', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

            function onPlayerReady(event) {
                // Player is ready
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.ENDED) {
                    // Video has ended
                    $('.audioVideoButton').removeAttr('disabled');
                }
            }
        };
    } else {
        console.error('Invalid YouTube video URL');
    }
}

function getYouTubeVideoId(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}



/*---------------------------------------STAR RATING--------------------------------------------*/

    var $star_rating = $('.star-rating .fa');

    var SetRatingStar = function() {
      return $star_rating.each(function() {
        if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
          return $(this).removeClass('fa-star-o').addClass('fa-star');
        } else {
          return $(this).removeClass('fa-star').addClass('fa-star-o');
        }
      });
    };

    $star_rating.on('click', function() {
      $star_rating.siblings('input.rating-value').val($(this).data('rating'));
      return SetRatingStar();
    });

    SetRatingStar();
    $(document).ready(function() {
    // Check if there's a stored trainingId and reopen the modal
    var storedTrainingId = localStorage.getItem('currentTrainingId');
    if (storedTrainingId) {
        openOnGoingActivityModal(storedTrainingId);
    }

// Utility to check if all documents are completed for the current training
function areAllDocumentsCompleted() {

    let allCompleted = true;
    $('#displayDocumentTable tbody tr').each(function() {
        
        const completeBtn = $(this).find('.audioVideoButton');
        if (completeBtn.length && !completeBtn.prop('disabled')) {
            allCompleted = false;
        }
    });
    return allCompleted;
}

// Override Give Test button click to check completion before opening test
$('#openAssessmentButton').off('click').on('click', function(e) {
    if (!areAllDocumentsCompleted()) {
        Swal.fire('Complete Training', 'Please complete all training materials before attempting the test.', 'warning');
        return;
    }
    openAssessmentForm();
    closeDialogBoxModal();
});

function openAssessmentForm() {
    $('#form-preview').empty();
    $('#form-container').empty();
    assessmentModal.style.display = 'block';
}

function closeAssessmentModal() {
    $('#form-preview').empty();
    $('#form-container').empty();
    assessmentModal.style.display = 'none';
}

//const closeAssessmentButton = document.querySelector('#assessmentModal .close');
closeAssessmentButton.addEventListener('click', closeAssessmentModal);

function populateFormWithQuestions(questions) {
    const formPreview = document.getElementById('form-preview');
    formPreview.innerHTML = ''; 

    questions.forEach(function(question, qIdx) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.style = 'font-weight: bold; margin-bottom: 8px;';
        questionText.textContent = question.questionText;
        questionDiv.appendChild(questionText);

        const questionIdField = document.createElement('input');
        questionIdField.type = 'hidden';
        questionIdField.name = 'questionId';
        questionIdField.value = question.questionId;
        questionDiv.appendChild(questionIdField);

        const options = question.questionOptions ? question.questionOptions.split(',') : [];
        options.forEach((optionText, optIdx) => {
            const optionId = `q${qIdx}_opt${optIdx}`;
            const radioLabel = document.createElement('label');
            radioLabel.style = 'display:block; margin-bottom:4px;';

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question_${question.questionId}`; 
            radioInput.value = optionText.trim();
            radioInput.style = 'margin-right:6px;';

            radioLabel.appendChild(radioInput);
            radioLabel.appendChild(document.createTextNode(optionText.trim()));
            questionDiv.appendChild(radioLabel);
        });

        formPreview.appendChild(questionDiv);

        const hr = document.createElement('hr');
        hr.style = "border: 1.5px solid #443ea2;";
        formPreview.appendChild(hr);
    });
}

function fetchQuestionTypes(trainingId, hasVideoDocuments) {
    $.ajax({
        url: 'http://localhost:9090/questions/types?trainingId=' + trainingId,
        type: 'GET',
        success: function(response) {
            var types = response.payload;
            var hasNormal = types.includes('normal');
            var hasVideo = types.includes('video');
            if (hasNormal && hasVideo) {
                $('#openAssessmentButton').prop('disabled', false);
                $('#startInterviewButton').prop('disabled', !hasVideoDocuments); // disabled if no video documents
            } else if (hasNormal) {
                $('#openAssessmentButton').prop('disabled', false);
                $('#startInterviewButton').prop('disabled', true);
            } else if (hasVideo) {
                $('#openAssessmentButton').prop('disabled', true);
                $('#startInterviewButton').prop('disabled', !hasVideoDocuments);
            } else {
                $('#openAssessmentButton').prop('disabled', true);
                $('#startInterviewButton').prop('disabled', true);
            }
        },
        error: function() {
            console.error('Error fetching question types');
            $('#openAssessmentButton').prop('disabled', true);
            $('#startInterviewButton').prop('disabled', true);
        }
    });
}

function saveAnswersAndEnableVideo() {
    // Assuming saveAnswers() is defined in addQuestions.js and handles the submission
    // After successful submission, enable the video test button
    // Note: You may need to modify saveAnswers in addQuestions.js to call a callback or use promises
    saveAnswers();
    // For now, enable it immediately; ideally, enable only on success
    $('#startInterviewButton').prop('disabled', false);
}


