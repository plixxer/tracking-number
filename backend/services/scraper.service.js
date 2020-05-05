const fetch = require("node-fetch");

const puppeteer = require('puppeteer');
//const cheerio = require("cheerio");

(function () {
	let ScraperService = function () { };

	ScraperService.prototype.get = function (callback) {
		fetch('https://automation.bigdaddyunlimited.com/tracking_data.json').then(resp => resp.json()).then(body => callback(body));
	}

	ScraperService.prototype.uniqueRecords = function (records) {
		let tracking_numbers = records.map(function (elm) { return elm.tracking_number });
		records = records.filter(function (elem, index) {
			return tracking_numbers.indexOf(elem.tracking_number) == index;
		}).map(function (record) {
			return {
				...record,
				ship_date: new Date(record.ship_date.substr(4, 2) + '-' + record.ship_date.substr(6, 2) + '-' + record.ship_date.substr(0, 4))
			};
		});
		return records;
	}

	ScraperService.prototype.tracking = function (trackingNumber, mode, callback) {
		let carrier_settings = {
			fedex: {
				url: 'https://www.fedex.com/apps/fedextrack/?tracknumbers=' + trackingNumber,
				deliverySelector: '.snapshotController_date'
			},
			usps: {
				url: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=' + trackingNumber,
				deliverySelector: '.eta_snip',
				deliveryTimeSelector: '.time'
			}
		};

		let reject = function () {
			console.log("reject");
			callback(null, null);
		};

		puppeteer.launch({ headless: true, args: ['--no-sandbox'] }).then(function (browser) {
			browser.newPage().then(function (page) {
				page.goto(carrier_settings[mode].url, {
					waitUntil: "networkidle2",
					timeout: 10000
				}).then(function () {
					page.waitForSelector(carrier_settings[mode].deliverySelector, {
						visible: true,
						timeout: 6000
					}).then(function () {
						page.$eval(carrier_settings[mode].deliverySelector, elem => elem.innerText).then(function (deliverySelectorContent) {
							if (mode === 'fedex') {
								let fedexDelivery = deliverySelectorContent.split(' ');
								callback(fedexDelivery[0], new Date(fedexDelivery[1] + ' ' + fedexDelivery[3] + ' ' + fedexDelivery[4]));
								browser.close();
							} else if (mode === 'usps') {
								let uspsDelivery = deliverySelectorContent.split('\n');
								if (carrier_settings[mode].deliveryTimeSelector) {
									page.$eval(carrier_settings[mode].deliveryTimeSelector, elem => elem.innerText).then(function (deliveryTimeSelectorContent) {
										let isAm = deliveryTimeSelectorContent.indexOf('pm') != -1;
										deliveryTimeSelectorContent = deliveryTimeSelectorContent.replace("am", "").replace("pm", "");
										deliveryTimeSelectorContent = deliveryTimeSelectorContent + ' ' + ((isAm) ? 'am' : 'pm');
										let deliveryDate = new Date(uspsDelivery[2] + ' ' + uspsDelivery[1] + ' ' + uspsDelivery[3] + ' ' + deliveryTimeSelectorContent);
										callback(uspsDelivery[0], deliveryDate);
										browser.close();
									}).catch(reject);
								}
							}
						}).catch(reject);
					}).catch(reject);
				}).catch(reject);
			});
		});

	}

	module.exports = ScraperService;
})();