<%@page import="java.util.List"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="ISO-8859-1"%>

<%@ page import="com.doritech.api.Entity.ParamEntity"%>

<%@ page import="com.doritech.api.DTO.TrainingAssignmentDTO"%>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>TMS</title>

<!-------------------------- CSS Links---------------------------- -->

<link rel="stylesheet" href="./externalCSS/bootstrap.min.css">

<link rel="stylesheet" href="./externalCSS/googleFonts.css">

<link rel="stylesheet" href="./css/question.css" />

<link rel="stylesheet" href="./css/onGoingActivity.css" />

<link rel="stylesheet" href="./css/multilingual.css" />

<script src="./externalJS/fontawesome.js"></script>





<!-- DATATABLES CSS Links -->




<script src="https://cdn.webrtc-experiment.com/RecordRTC.js"></script>

<link rel="stylesheet" href="./externalCSS/dataTables.bootstrap4.min.css">

<link rel="stylesheet" href="./externalCSS/buttons.dataTables.min.css">

<link rel="stylesheet" href="./externalCSS/responsive.bootstrap4.min.css">



<!-- DATATABLES JS Links -->

<script src="https://cdn.webrtc-experiment.com/RecordRTC.js"></script>

<script src="./externalJS/sweetalert2.all.min.js"></script>

<script src="./externalJS/jquery-3.7.0.js"></script>

<script src="./externalJS/jquery.dataTables.min.js"></script>

<script src="./externalJS/dataTables.bootstrap4.min.js"></script>

<script src="./externalJS/responsive.bootstrap4.min.js"></script>

<script src="./externalJS/dataTables.responsive.min.js"></script>

<script src="./externalJS/dataTables.buttons.min.js"></script>

<script src="./externalJS/pdfmake.min.js"></script>

<script src="./externalJS/vfs_fonts.js"></script>

<script src="./externalJS/buttons.html5.min.js"></script>

<script src="./externalJS/buttons.print.min.js"></script>



</head>

<body style="font-size: 14px;">



	<!--<div id="employeeId">${empId}</div>-->

	<hr>

	<div class="form-field col-md-12">

		<input id="employeeId" name="empId" type="text" placeholder="empId"
			value="${empId}" style="display: none">

	</div>





	<button id="btn-show-all-children" type="button"
		style="margin-left: 1%;" class="submit-btn">Expand All</button>

	<button id="btn-hide-all-children" type="button" class="submit-btn">Collapse

		All</button>

	<span id="google_translate_element" class="translateENToHI"></span>



	<hr>

	<div class="card" style="margin: 0.5%;">

		<table id="example"
			class="table table-striped table-bordered table-wrapped"
			cellspacing="0" width="100%">

			<thead>

				<tr>

					<th>Training Name</th>

					<th>View Full Details</th>

					<th class="none">Date of Starting</th>

					<th class="none">Due Date of Training</th>

					<th class="none">Total Duration</th>

					<th class="none">Status</th>
					<th class="none">Result</th>


				</tr>

			</thead>

			<tbody>



				<c:forEach var="assignmentList"
					items="${trainingAssignmentList.payload}" varStatus="loop">

					<tr>

						<td>${assignmentList.trainingName}</td>

						<td><button class="submit-btn"
								id="onGoingActivityModalButton${loop.index}"
								data-training-id="${assignmentList.trainingId}"
								style="font-size: 12px;"
								onclick="checkStatusAndEnableEvaluateButton(${assignmentList.trainingId}, '${empId}');checkVideoPresentOrNot(${assignmentList.trainingId});"
								>View</button></td>

						<td>${assignmentList.startDate}</td>

						<td class="completion-date">${assignmentList.completionDate}</td>

						<td>${assignmentList.trainingDuration}-days</td>

						<td>${assignmentList.status}</td>
						<td>${assignmentList.result}</td>

					</tr>

				</c:forEach>





			</tbody>

		</table>

	</div>

	<!-- Modal Structure -->

	<div class="modal" id="onGoingActivity">

		<div class="modal-dialog">

			<div class="modal-content">



				<div class="modal-header">

					<b class="modal-title" style="font-size: 14px;"><i
						class="fa-solid fa-pen-ruler"></i> <span style="color: #443ea2;">TMS</span></b>

					<button type="button" class="close" data-dismiss="modal">&times;</button>

				</div>

				<div class="modal-body">



					<div class='dashboard-content'>

						<div class='container'>

							<div class='card'>

								<div class='card-header'>

									<div id="employeeName" style="display: none">${loggedInUser}</div>

									<h5>View Training Details</h5>

								</div>

								<div class='card-body'>

									<section class="get-in-touch">



										<form class="contact-form row" name="viewDetailsOfTraining">

											<div class="form-field col-md-12">

												<input id="trainingName" name="trainingName"
													class="training-heading js-input" type="text" required>

											</div>

											<div class="form-field col-md-12">

												<input id="trainingId" name="trainingId" type="text"
													style="display: none" placeholder="Id">

											</div>



											<div class="form-field col-md-12">

												<label class="label" for="trainingDescription"
													style="position: absolute; left: 15px; bottom: 80px">Training

													Description:</label>

												<textarea id="trainingDescription"
													name="trainingDescription" class="textAreaField js-input"
													type="text" rows="10" cols="30" disabled></textarea>



											</div>

											<div class="form-field col-md-4" style="display: none;">

												<input id="trainingDocuments" name="trainingDocuments"
													class="input-text js-input" type="text" required> <label
													class="label" for="trainingDocuments">Training

													Documents:</label>

											</div>
											<div class="form-field col-md-4" style="display: none;">

												<input id="documentsName" name="documentsName"
													class="input-text js-input" type="text" required> <label
													class="label" for="documentsName">Documents Name:</label>

											</div>

											<table id="displayDocumentTable"
												class="table table-striped table-bordered table-wrapped"
												style="width: 90%; margin-left: 5%;">

												<thead>

													<tr>

														<th>Document Name</th>

														<th>Link</th>

														<th>View</th>

													</tr>

												</thead>

												<tbody id="documentTableBody"></tbody>

												<tfoot>

													<tr>

														<th>Action</th>

														<th>
														
														<button type="button" class="submit-btn"
																id="openAssessmentButton"
																onclick="getQuestionsByTrainingId()" disabled>Give
																Test</button>
														
															
														</th>
														<th>		
															
															<button type="button" class="submit-btn"
																id="startInterviewButton"
																onclick="getVideoQuestionsByTrainingId();" disabled>Video
																Test</button>

														</th>

														



													</tr>

												

												</tfoot>

											</table>






										</form>

									</section>





								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	</div>

	<!-- ----------------------------------------------------Modals to show pdf, video,youtube video and MP3------------------------------------------------------- -->

	<!-- PDF Modal -->

	<div class="modal fade" id="pdfModal" tabindex="-1" role="dialog"
		aria-labelledby="pdfModalLabel" aria-hidden="true">

		<div class="modal-dialog modal-lg" role="document">

			<div class="modal-content">

				<div class="modal-header">

					<h5 class="modal-title" id="pdfModalLabel">PDF Document</h5>





					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">

						<span aria-hidden="true">&times;</span>

					</button>

				</div>

				<div class="modal-body" id="pdfModalBody">

					<!-- PDF content will be displayed here -->

				</div>

			</div>

		</div>

	</div>



	<!-- Video Modal -->

	<div class="modal fade" id="videoModal" tabindex="-1" role="dialog"
		aria-labelledby="videoModalLabel" aria-hidden="true">

		<div class="modal-dialog modal-lg" role="document">

			<div class="modal-content">

				<div class="modal-header">

					<h5 class="modal-title" id="videoModalLabel">Video Document</h5>

					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">

						<span aria-hidden="true">&times;</span>

					</button>

				</div>

				<div class="modal-body" id="videoModalBody">

					<!-- Video content will be displayed here -->

				</div>

			</div>

		</div>

	</div>

	<!-- MP3 Modal -->

	<div class="modal fade" id="audioModal" tabindex="-1" role="dialog"
		aria-labelledby="audioModalLabel" aria-hidden="true">

		<div class="modal-dialog modal-lg" role="document">

			<div class="modal-content">

				<div class="modal-header">

					<h5 class="modal-title" id="audioModalLabel">Audio Document</h5>

					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">

						<span aria-hidden="true">&times;</span>

					</button>

				</div>

				<div class="modal-body" id="audioModalBody">

					<!-- Audio content will be displayed here -->

				</div>

			</div>

		</div>

	</div>



	<!-- DOC Modal -->

	<div class="modal fade" id="docModal" tabindex="-1" role="dialog"
		aria-labelledby="docModalLabel" aria-hidden="true">

		<div class="modal-dialog modal-lg" role="document">

			<div class="modal-content">

				<div class="modal-header">

					<h5 class="modal-title" id="docModalLabel">Document</h5>

					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">

						<span aria-hidden="true">&times;</span>

					</button>

				</div>

				<div class="modal-body" id="docModalBody">

					<!-- Document content will be displayed here -->

				</div>

			</div>

		</div>

	</div>



	<!-- YOUTUBE Video -->

	<div class="modal fade" id="youtubeModal" tabindex="-1" role="dialog"
		aria-labelledby="youtubeModalLabel" aria-hidden="true">

		<div class="modal-dialog modal-lg" role="document">

			<div class="modal-content">

				<div class="modal-header">

					<h5 class="modal-title" id="youtubeModalLabel">YouTube Video</h5>

					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">

						<span aria-hidden="true">&times;</span>

					</button>

				</div>

				<div class="modal-body" id="youtubeModalBody">

					<!-- YouTube video content will be displayed here -->

				</div>

			</div>

		</div>

	</div>

	<!------------------------- MODAL ON EVALUATE BUTTON CLICKED TO ASSESSMENT---------------------->



	<div class="modal" id="assessmentModal">

		<div class="modal-dialog">

			<div class="modal-content">

				<div class="modal-header">

					<button type="button" class="close" data-dismiss="modal">&times;</button>

				</div>

				<div class="modal-body">

					<div class='dashboard-content'>

						<div class='container'>

							<div class='card'>

								<div class='card-header'>

									<h5>Evaluate your Learning</h5>

								</div>

								<div class='card-body'>

									<section class="get-in-touch">

										<div class="google-form">

											<main>

												<div id="form-preview">

													<h6>The Ultimate Assessment</h6>



													<div style="height: 20px;"></div>

													<!-- <input type="text" name="trainingId" id="trainingId"

					placeholder="Training Id" style="display: ;"> -->



													<div id="question">

														<div style="height: 25px;"></div>

													</div>





												</div>



												<div id="form-container" class="form-preview"></div>

											</main>



										</div>





										<br>



										<footer>

											<!-- <button id="add-new-question"><i class="fa-solid fa-circle-plus" style="color: #ffffff;"></i> Add Question</button> -->

											<button type="button" id="submit-form" form="form-preview"
												onclick="saveAnswersAndEnableVideo();">Submit</button>



										</footer>



									</section>

								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	</div>





	<div class="modal fade" id="feedbackModal" style="overflow-y: hidden;">

		<div class="modal-dialog">

			<div class="modal-content">



				<div class="modal-header">

					<b class="modal-title" style="font-size: 14px;"><i
						class="fa-solid fa-pen-ruler"></i> <span style="color: #443ea2;">TMS</span></b>

					<button type="button" class="close" data-dismiss="modal">&times;</button>

				</div>

				<div class="modal-body">

					<div class='dashboard-content'>

						<div class='container'>

							<div class='card'>

								<div class='card-header'>

									<h5>Give Feedback</h5>

								</div>



								<div class='card-body'>

									<section class="get-in-touch">



										<form class="contact-form row" name="employeeMaster">







											<div class="container">

												<div class="row">



													<div class="col-lg-12">

														<label class="label">Rate us:</label>



														<div class="star-rating">

															<span class="fa fa-star-o" data-rating="1"></span> <span
																class="fa fa-star-o" data-rating="2"></span> <span
																class="fa fa-star-o" data-rating="3"></span> <span
																class="fa fa-star-o" data-rating="4"></span> <span
																class="fa fa-star-o" data-rating="5"></span> <input
																type="hidden" name="whatever1" class="rating-value"
																value="0">

														</div>

													</div>

												</div>



											</div>





											<div class="form-field col-lg-10">



												<textarea id="remarks" name="remarks"
													class="input-text js-input" rows="10" cols="40" required></textarea>

												<label class="label">Remarks:</label>

											</div>



											<div class="form-field col-lg-10">



												<button class="submit-btn submit-feedback" type="button"
													value="Submit">Submit</button>

											</div>

										</form>

									</section>



								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	</div>

	<!-- Modal Structure for video interview -->


	<div class="modal fade" id="interviewModal" tabindex="-1"
		aria-labelledby="interviewModalLabel" aria-hidden="true"
		style="overflow-y: hidden">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="interviewModalLabel">Interview
						Modal</h5>
					
				</div>
				<div class="modal-body">
					<!-- Add your content here -->
					 <div class="card">
        <div class="row">
            <div class="col-md-6">
                <div id="videoContainer" style="border-radius:; margin-left: 10px; margin-top: 12px;"></div>
            </div>
            <div class="col-md-6">
            <div id="progressContainer" class="mt-3 mr-4">
                    <div class="progress">
                        <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            <div class="mt-3"></div>
                <div id="videoQuestionContainer" >
                    <!-- Questions will be populated here -->
                </div>
                <div class="mt-4"></div>
                <button type="button" id="nextQuestionButton" class="submit-btn mr-4" onclick="nextQuestion()" style="float:right;">Next</button>
            	
            </div>
        </div>
    </div>
				</div>
				<div class="modal-footer">

					<!--         <button type="button"  id="stopButton" class="btn btn-secondary"  data-dismiss="modal">Stop</button> -->
					<button type="button" id="submitVideoAssessment" class="submit-btn"
						data-dismiss="modal" onclick='submitVideoButton();'>Submit</button>
				</div>
			</div>
		</div>
	</div>



	<script>

$(document).ready(function () {

$("#certificateButton").on("click", function () {

var empId = $("#employeeId").val();

var trainingId = $("#trainingId").val();

console.log(empId,trainingId);

window.location.href = "./generateCertificate?empId=" + empId + "&trainingId=" + trainingId;

});

});

</script>

	<script src="./js/addQuestions.js"></script>

	<script src="./js/videoInterview.js"></script>

	<script src="./externalJS/bootstrap.bundle.min.js"></script>

	<script src="./js/onGoingActivity.js"></script>

	<script src="./js/onGoingActivityDataTable.js"></script>

	<script src="./externalJS/multilingual.js"></script>

	<script src="./js/googleTranslateElementInit.js"></script>

</body>

</html>