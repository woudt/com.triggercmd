'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');

class TriggerCmdApp extends Homey.App {
	
	onInit() {
		this.log('TriggerCmdApp is running...');

		let myAction = this.homey.flow.getActionCard('run-command');
		myAction.registerRunListener(async ( args, state ) => {
			try {
				const body = "trigger=" + args.command.did + "&caller=homey";
				this.log(body);
				const token = this.homey.settings.get('token');
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
				const token = this.homey.settings.get('token');
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
}

module.exports = TriggerCmdApp;