var React = require('react');
var StateMixin = require("../state_mixin");
var EditBox = require("../edit_box");

// "1": "Research, Insights, and Synthesis",

var DELIVERABLES = {
	
	"2": "Design Solutions Prototyping",
	"3": "Process Improvement Recommendations",
	"4": "Program Management and Stewardship",
	"5": "UX requirements gathering",
	"6": "Initial application design and implementation",
	"7": "System configuration to support business processes",
	"8": "Integration for input and output methods",
	"9": "Workflow design and implementation",
	"10": "Overall collaboration of applications",
	"11": "Enhancements, patches, and updates to applications, data, or cloud systems",
	"12": "Data import of records collected from legacy systems",
	"13": "Automated testing",
	"14": "Training of end users on the systems",
	"15": "Native mobile application(s)",
	"16": "Mobile responsive web application(s)",
	"17": "Application capable of supporting high user traffic",
	"18": "Devops, continuous integration and continuous deployment",
	"19": "Workstations, data centers, server systems, and connectivity",
	"20": "Supporting Legacy applications/systems",
};

var USER_RESEARCH = {			
	"done": "Research has already been conducted, either internally or by another vendor. (proceed to product/program vision questionnaire)",
	"internal": "We intend to conduct user research internally prior to the start date of this engagement.",
 	"vendor": "The vendor will be responsible for the user research."
};

var KICK_OFF_MEETING = {
	"remote": "Remote Meeting",
	"in-person": "In-person Meeting",
	"none": "No Meeting",
};

var USER_TYPES = {
	"internal_people": "Internal/Government Employees",
	"external_people": "External/The Public",
	"internal_it": "Internal Government IT",
	"external_it": "External IT",
};

var STATES = [
	"definitionOfDone",
	"deliverables",
	"external_it",
	"external_people",
	"generalBackground",
	"internal_it",
	"internal_people",
	"kickOffMeeting",
	"kickOffMeetingInPerson",
	"kickOffMeetingRemote",
	"locationRequirement",
	"locationText",
	"offSiteDevelopmentCompliance",
	"programHistory",
	"userAccess",
	"userResearchStrategy",
	"whatPeopleNeed",
	"startToFinish",
	"simpleAndIntuitive",
	"dataDrivenDecisions",
	"documentationAndTraining",	
	"deliverables",
	"d10",
	"d9",
	"d12",
	"d11",
	"d14",
	"d13",
	"d16",
	"d15",
	"d18",
	"d17",
	"d19",
	"d2",
	"d1",
	"d4",
	"d3",
	"d6",
	"d5",
	"d8",
	"d7",
];

var Objective = React.createClass({
	mixins: [StateMixin],
	getInitialState: function() {
		var initialStates = getStates(STATES);
		return initialStates;
	},
	componentDidMount: function() {
		var rfqId = getId(window.location.hash);
    get_data(3, rfqId, function(content){
    	var components = getComponents(content["data"]);
      this.setState( components );
    }.bind(this));
    getDeliverables(rfqId, function(content){
    	this.setState({ deliverables: content["data"]});
    }.bind(this));
  },
  handleCheck: function(key, event) {
  	var newState = {};
  	var currentState = this.state[key];
  	if (currentState == "false"){
  		newState[key] = "true";
  	}
  	else{
  		newState[key] = "false";
  	}
  	this.setState(newState);
  },
	save: function(cb) {
		var data = {};
		
		for (i=0; i < STATES.length; i++){
			var stateName = STATES[i];
			data[stateName] = this.state[stateName];
		}

		var rfqId = getId(window.location.hash);
    put_data(3, rfqId, data, cb);
	},
	render: function() {

		var deliverables = [];
		for (var key in this.state.deliverables) {
			var deliverable = this.state.deliverables[key];
			console.log('"' + deliverable["name"] + '",');
			deliverables.push(
				<div className="checkbox">
					<label>
					<input type="checkbox" value={this.state[deliverable["value"]]} onClick={this.handleCheck.bind(this, deliverable["name"])} checked={this.state[deliverable["name"]] == "true"}></input>
					{deliverable["text"]}
				  </label>
				</div>
			);
		}

		var userTypesOptions = [];
		for (var key in USER_TYPES){
			userTypesOptions.push(
				<div className="checkbox">
				  <label>
				    <input type="checkbox" onClick={this.handleCheck.bind(this, key)} checked={this.state[key] == "true"}></input>
				    {USER_TYPES[key]}
				  </label>
				</div>
			);
		}

		var userResearchOptions = [];
		for (var key in USER_RESEARCH) {
			userResearchOptions.push(
				<div className="radio">
					<label>
						<input type="radio" value={key} checked={key == this.state.userResearchStrategy} />{ USER_RESEARCH[key] }
				  </label>
				</div>
			);
		}

		var kickOffMeetingOptions = [];
		for (var key in KICK_OFF_MEETING) {
			kickOffMeetingOptions.push(
				<div className="radio">
					<label>
						<input type="radio" value={key} checked={key == this.state.kickOffMeeting} />{ KICK_OFF_MEETING[key] }
				  </label>
				</div>
			);
		}

		var usersString = "";
		var userTypes = [];
		for (var key in USER_TYPES){
  		if (this.state[key] == "true"){
  			userTypes.push(USER_TYPES[key]);  		
  		}
  	}
  	if (userTypes.length == 1){
  		usersString = userTypes[0];
  	}
  	if (userTypes.length > 1){
  		for (i=0; i < userTypes.length - 1; i++){
  			usersString += userTypes[i] + ", ";
  		}
  		usersString += "and " + userTypes[userTypes.length-1];
  	}

		return (
			<div>
				<div className="main-heading">Statement of Objectives</div>

				<div className="sub-heading">General Background</div>
				<p>Please provide several paragraphs about your project's history, mission, and current state.</p>

				<textarea className="form-control" rows="9" value={this.state.generalBackground} onChange={this.handleChange.bind(this, 'generalBackground')}></textarea>

				<div className="sub-heading">Program History</div>
				<p>If you have any information about the current vendors and specific technology being used please provide it here.</p>

				<textarea className="form-control" rows="10" value={this.state.programHistory} onChange={this.handleChange.bind(this, 'programHistory')}></textarea>

				<div className="sub-heading">Specific Tasks and Deliverables</div>
				<p>Which of the following do you anticipate your project will need?</p>

				<div className="sub-text">We have already checked certain components that the USDS Playbook suggests be required for all projects.</div>
				
				{deliverables}

				<p>These functional Requirements will be translated into Epics and User Stories that will be used to populate the Product Backlog.</p>

				<div className="sub-heading">Users</div>
				<p>The primary users will be:</p>

				{userTypesOptions}

				{(usersString.length > 0)? 
				<p>The users of the product will include {usersString}.</p> : null}

				<div className="sub-heading">User Research</div>
				<p>What is your User Research Strategy?</p>

				<radiogroup onChange={this.handleChange.bind(this, 'userResearchStrategy')}>
					{userResearchOptions}
				</radiogroup>

				<EditBox
						text={this.state.userAccess}
						editing={this.state.edit === 'userAccess'}
						onStatusChange={this.toggleEdit.bind(this, 'userAccess')}
						onTextChange={this.handleChange.bind(this, 'userAccess')}>
				</EditBox>
	
				{(this.state.userResearchStrategy === "vendor")?
					<div>
						<div className="sub-heading">Understand what people need</div>
						<EditBox
								text={this.state.whatPeopleNeed}
								editing={this.state.edit === 'whatPeopleNeed'}
								onStatusChange={this.toggleEdit.bind(this, 'whatPeopleNeed')}
								onTextChange={this.handleChange.bind(this, 'whatPeopleNeed')}>
						</EditBox>


						<div className="sub-heading">Address the whole experience, from start to finish</div>
						<EditBox
								text={this.state.startToFinish}
								editing={this.state.edit === 'startToFinish'}
								onStatusChange={this.toggleEdit.bind(this, 'startToFinish')}
								onTextChange={this.handleChange.bind(this, 'startToFinish')}>
						</EditBox>

					</div> : null
			}

			<div className="sub-heading">Make it simple and intuitive</div>

			<EditBox
					text={this.state.simpleAndIntuitive}
					editing={this.state.edit === 'simpleAndIntuitive'}
					onStatusChange={this.toggleEdit.bind(this, 'simpleAndIntuitive')}
					onTextChange={this.handleChange.bind(this, 'simpleAndIntuitive')}>
			</EditBox>


			<div className="sub-heading">Use data to drive decisions</div>

			<EditBox
					text={this.state.dataDrivenDecisions}
					editing={this.state.edit === 'dataDrivenDecisions'}
					onStatusChange={this.toggleEdit.bind(this, 'dataDrivenDecisions')}
					onTextChange={this.handleChange.bind(this, 'dataDrivenDecisions')}>
			</EditBox>

			<div className="sub-heading">Deliverables</div>

			<EditBox
					text={this.state.definitionOfDone}
					editing={this.state.edit === 'definitionOfDone'}
					onStatusChange={this.toggleEdit.bind(this, 'definitionOfDone')}
					onTextChange={this.handleChange.bind(this, 'definitionOfDone')}>
			</EditBox>

				<div className="sub-heading">Place of Performance</div>
				<p>Will you require the contractor to have a full-time working staff presence onsite at a specific location?</p>
				<div className="sub-text">Ex: SBA headquarters in Washington, DC</div>
					<div className="radio">
					  <label>
					    <input type="radio" value="yes" onChange={this.handleChange.bind(this, "locationRequirement")} checked={this.state.locationRequirement === "yes"}></input>
					    Yes
					  </label>
					</div>
					<div className="radio">
					  <label>
					    <input type="radio" value="no" onChange={this.handleChange.bind(this, "locationRequirement")} checked={this.state.locationRequirement === "no"}></input>
					    No
					  </label>
					</div>
					{(this.state.locationRequirement === "yes")? <div><input type="text" className="form-control short-response" placeholder="ex: Washington, DC" value={this.state.locationText} onChange={this.handleChange.bind(this, "locationText")}></input><br /></div> : null}


				<div className="resulting-text">Resulting Text</div>
				{(this.state.locationRequirement === "yes")? <p>The contractor shall have a full-time working staff presence at {this.state.locationText}. Contractor shall have additional facilities to perform contract functions as necessary.</p> : <p>The contractor is not required to have a full-time working staff presence on-site.</p>}		

				<EditBox
						text={this.state.offSiteDevelopmentCompliance}
						editing={this.state.edit === 'offSiteDevelopmentCompliance'}
						onStatusChange={this.toggleEdit.bind(this, 'offSiteDevelopmentCompliance')}
						onTextChange={this.handleChange.bind(this, 'offSiteDevelopmentCompliance')}>
				</EditBox>

				<div className="sub-heading">Documentation and Training</div>
				<EditBox
						text={this.state.documentationAndTraining}
						editing={this.state.edit === 'documentationAndTraining'}
						onStatusChange={this.toggleEdit.bind(this, 'documentationAndTraining')}
						onTextChange={this.handleChange.bind(this, 'documentationAndTraining')}>
				</EditBox>
				
				<div className="sub-heading">Kick-Off Meeting/Post-Award Conference</div>

				<p>Will you require the contractor to attend a kick-off meeting?</p>
				<radiogroup onChange={this.handleChange.bind(this, "kickOffMeeting")}>
				{kickOffMeetingOptions}
				</radiogroup>
				
				{(this.state.kickOffMeeting == "in-person")? 
				<div>
					<EditBox
							text={this.state.kickOffMeetingInPerson}
							editing={this.state.edit === 'kickOffMeetingInPerson'}
							onStatusChange={this.toggleEdit.bind(this, 'kickOffMeetingInPerson')}
							onTextChange={this.handleChange.bind(this, 'kickOffMeetingInPerson')}>
					</EditBox>
				</div> : null}

				{(this.state.kickOffMeeting == "remote")? 
					<div>
						<EditBox
							text={this.state.kickOffMeetingRemote}
							editing={this.state.edit === 'kickOffMeetingRemote'}
							onStatusChange={this.toggleEdit.bind(this, 'kickOffMeetingRemote')}
							onTextChange={this.handleChange.bind(this, 'kickOffMeetingRemote')}>
					</EditBox>
					</div>: null}

				{(this.state.kickOffMeeting === "none")?
				<p>A formal kick-off meeting will not be required.</p> : null
				}
			</div>
		);
	},
});


// to ensure the system supports interoperability,  must be followed. (see section). To ensure the user interface is X, Y (playbook language)
module.exports = Objective;