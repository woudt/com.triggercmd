'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');

class TriggerCmdApp extends Homey.App {
	
	onInit() {
		this.log('TriggerCmdApp is running...');

		let myAction = new Homey.FlowCardAction('run-command');
		myAction.register().registerRunListener(async ( args, state ) => {
			try {
				const body = "trigger=" + args.command.did + "&caller=homey";
				this.log(body);
				const token = Homey.ManagerSettings.get('token');
				const response = await fetch(
					"https://www.triggercmd.com/api/smartthings/triggerBase64", {
					method: "POST",	
					headers: {
						"Authorization": "Bearer " + token,
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: body
				});
				const result = await response.text();
				this.log(result);
				if (result.includes("err")) {
					throw new Error(result);
				};
			} catch (error) {
				this.log(error);
				throw error;
			}
		});
    	myAction.getArgument('command').registerAutocompleteListener(async ( query, args ) => {
			try {
				const token = Homey.ManagerSettings.get('token');
				const response = await fetch(
					"https://www.triggercmd.com/api/smartthings/commandlist", {
					headers: {
						"Authorization": "Bearer " + token
					}
				});
				const result = await response.json();
				this.log(result)
				return result
			} catch (error) {
				this.log(error)
				throw error;
			}
		});
	}
	
	async _onFlowCommandAutocomplete( query ) {
		return await fetch("https://www.triggercmd.com/api/command/commandlist", {headers: {
			"authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTg2Zjg2ZDJkYmE1MDAxOTVlZDYwZSIsImlhdCI6MTU4NzIyNTA3N30.6YsjNY8z2Nn-VUrUZGN1FRGAYPMTWfqZZMFewZcC4WU"
		}}).json()
	}
}

module.exports = TriggerCmdApp;