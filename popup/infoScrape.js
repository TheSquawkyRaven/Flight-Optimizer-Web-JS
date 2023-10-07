
const tripTypeP = document.querySelector("#basic-info #trip-type")
const adultsP = document.querySelector("#basic-info #adults")
const flightTypeP = document.querySelector("#basic-info #flight-type")

const goDateP = document.querySelector("#current-info #go-date")
const backDateP = document.querySelector("#current-info #back-date")
const fromAirportP = document.querySelector("#current-info #from-airport")
const toAirportP = document.querySelector("#current-info #to-airport")

var scrappedInfo = {}

chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
	injectInfoScrapper(tabs[0])
})


function injectInfoScrapper(tab) {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content/infoScrapper.js"],
	}).then(() => {
		chrome.tabs.sendMessage(tab.id, {
			info: true,
		}, retrieveInfoScrappedData)
	})
}

function retrieveInfoScrappedData(response) {

	scrappedInfo = response

	tripTypeP.textContent = response.tripType
	adultsP.textContent = response.adults
	flightTypeP.textContent = response.flightType

	goDateP.textContent = response.goDate
	backDateP.textContent = response.backDate
	fromAirportP.textContent = response.fromAirport
	toAirportP.textContent = response.toAirport

}