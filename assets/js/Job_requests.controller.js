$('document').ready(
	function(){
		//adds black background colour to the view job requests / my job requests button
		//this adds a "selected" effect
		$("#viewJRButton").addClass("black");
		$('ul.tabs').tabs();
	}
);

//job ID of the selected job
job_ID = 0;
//new job description set to blank
new_job_description = "";
//old job description set to blank
old_job_description = "";

//triggered when the cancel job button is clicked
//opens the modal asking if the user wants to cancel the job or not
//modal can't be closed by clicking outside it
//it has to click the no button in order to close it
function confirmCancel(jobID){
	$("#cancelModal").openModal({dismissible:false});
	job_ID = jobID; //sets the job_ID from the jobID of the selected job
}

//triggered when the "Yes" button in the modal confirming user action is clicked
//function that handles cancelling the jobID
//closes the cancel job modal then communicates to the server via jQuery POST
//the job ID of the selected job is sent as post argument
//opens the modal containing "Job canceled" message
//in the case it gets a "Job canceled" message from the server
//the message modal can only be closed by clicking OK
function cancelJob(url){
	$("#jobCancelReasonModal").closeModal();
  cancel_Reason = $('#cancel_reason').val();
	$.post(
		url+"cancel_job",
		{
			jobID:job_ID,
			cancelReason:cancel_Reason
		},
		function(data){
			if(data==="Job canceled"){
				$("#jobCanceledModal").openModal({dismissible:false});
			}
		}
	);
}

function modalKiller(){
    $('#cancelModal').closeModal();
    $('#jobCancelReasonModal').openModal({dismissible:false});
}

//reloads the page
function reloadPage(url){
	window.location.href = url+"job_requests";
}

//triggered when the "add to schedule" button is clicked
//rewrites the main app area containing the Job Requests main label and table
//with a form asking the user for the date of the schedule
function openScheduleJob(url,jobID){
	$('.tooltipped').tooltip('remove');
	$.get(url+"get_schedule_job_form",function(data){
		$("#mainAppArea").html(data);
		$('.datepicker').pickadate({
			selectMonths: true, // Creates a dropdown to control month
			selectYears: 1,
			format: 'yyyy-mm-dd'
		});
		$("#jobPrioritySelect").material_select();
	});
	job_ID = jobID; //sets the job_ID from the jobID of the selected job
}

function scheduleJob(url){
	schedule_date = $("#scheduleDate").val();
	job_priority = $("#jobPrioritySelect").val();
	if(job_priority===null) return;
	$.post(url+"schedule_job",{jobID:job_ID,scheduleDate:schedule_date,jobPriority:job_priority},function(data){
        console.log(data);
        if(data==="Added"){
			$("#jobScheduledModal").openModal({dismissible:false});
		}
		if(data==="Invalid date"){
			return;
		}
		if(data==="Can not add"){

		}
	});
}

function openEditModal(url,jobID){
	job_ID = jobID;
	$("#editJobModal").openModal({dismissible:false});
	$.post(url+"get_job_description",{jobID:jobID},function(data){
		$("#problemsEncounteredNew").val(data);
		old_job_description = data;
	});
}

function confirmEditJob(){
	$("#editJobModal").closeModal();
	if(old_job_description===$("#problemsEncounteredNew").val()) return;
	if($("#problemsEncounteredNew").val()==="") return;
	$("#confirmEditModal").openModal({dismissible:false});
}

function editJob(url){
	$.post(
		url+"edit_job",
		{jobID:job_ID,jobDescription:$("#problemsEncounteredNew").val()},
		function(data){
				if (data==="Job description updated"){
					$("#confirmEditModal").closeModal();
					$("#jobEditedModal").openModal({dismissible:false});
				}
				else {
					$("#confirmEditModal").closeModal();
					Materialize.toast("Can't edit",3000);
				}
		}
	);

}

//php passes the base url via onchange value/function call in the document
//javascript function handling the login
function getUsers(url){
	officeID = $("#office-selector").val();
	if (officeID===""){
		$("#clients-selector").attr("disabled","disabled");
		return;
	}
	$.post(url+"get_office_users",{officeID:officeID},function(data){
		if(data==="No clients"){
			data = "<option value=\"\" disabled=\"disabled\" selected=\"selected\">No clients under the selected office!</option>";
			$("#clients-selector").attr("disabled","disabled");
		}
		else $("#clients-selector").removeAttr("disabled");
		$("#clients-selector").html(data);
		$("#clients-selector").material_select();
	});
}

//php passes the base url via onclick value/function call in the document
//javascript function handling the login
function fileJobRequest(url){
	//gets the jobDescription/problemsEncountered field value
	jobDesc = $("#problemsEncountered").val();
	//do not proceed to AJAX if the jobDescription is blank or empty
	if (jobDesc==="") return;

	//jQuery GET communication
	//communicates to the API
	//first argument is the API URL
	//second argument is an anonymous function that handles the event
	//this gets the user type
	$.get(url+"get_user_type", function(data){

		//if the user is a client
		if(data==="client"){

			//jQuery post communication
			//communicates to the API
			//first argument is the API URL
			//second argument is the JSON format of the key-value pairs to be sent
			//third argument is an anonymous function that handles the event
			$.post(url+"submit_request",{jobDescription:jobDesc},function(data){

				//if the data received is "Submitted"
				//reset the jobDescription/problemsEncountered field
				//tell the user that their job request was filed
				//displays the modal containing the message that the job request was filed
				if(data==="Submitted"){
					problemsEncountered.value = "";
					$("#submittedMessage").openModal();
				}
			});
		}

		//if the user in session is either an admin, superadmin, or technician
		else if((data === "technician")||(data === "admin")||(data === "superadmin")){
			//gets the client username from the clients selector value
			clientUname = $("#clients-selector").val();
			//if it's a blank value, do not proceed to AJAX
			if(clientUname === "") return;

			//jQuery post communication
			//communicates to the API
			//first argument is the API URL
			//second argument is the JSON format of the key-value pairs to be sent
			//third argument is an anonymous function that handles the event
			$.post(url+"submit_request",{jobDescription:jobDesc,clientUsername:clientUname},function(data){

				//if the data received is "Submitted"
				//reset the input fields
				//tell the user that their job request was filed
				//utilises Materialize CSS's toast
				if(data==="Submitted"){
					$("#problemsEncountered").val("");
					$("#office-selector").val("");
					$("#clients-selector").val("");
					$('select').material_select();
					$("#submittedMessage").openModal();
				}
			});
		}
	});
}

function getAllJobRequests(url){
	$.get(
		url+"get_all_job_requests",
		function(data){
			$("#jobRequestsTableContent").html(data);
		}
	);
}

function getPendingJobRequests(url){
	$.get(
		url+"get_pending_job_requests",
		function(data){
			$("#jobRequestsTableContent").html(data);
		}
	);
}

function getCanceledJobRequests(url){
	$.get(
		url+"get_canceled_job_requests",
		function(data){
			$("#jobRequestsTableContent").html(data);
		}
	);
}

function getProcessingJobRequests(url){
	$.get(
		url+"get_processing_job_requests",
		function(data){
			$("#jobRequestsTableContent").html(data);
		}
	);
}

function getProcessedJobRequests(url){
	$.get(
		url+"get_processed_job_requests",
		function(data){
			$("#jobRequestsTableContent").html(data);
		}
	);
}

function searchJobRequests(url){
	if($("#searchKeys").val()===""){
		Materialize.toast("Search strings can not be blank!",3000);
		return;
	}
	$.post(
	  url+"get_search_results",
	  {
	    searchKeys:$("#searchKeys").val()
	  },
	  function(data){
			$("#searchModal").closeModal();
	    $("#jobRequestsTableContent").html(data);
			$("#searchKeys").val("");
	  }
	);
}
