

const startScrapeButton = document.querySelector("#start-scrape")
const daysInput = document.querySelector("#days")

function startScrape() {
	let days = parseInt(daysInput.value)
	if (days == NaN || days < 0) {
		return
	}

    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        injectFullScrapper(tabs[0], days)
    })
	
}

startScrapeButton.addEventListener('click', startScrape)

var intervalTest

function injectFullScrapper(tab, days) {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content/fullScrapper.js"],
	}).then(() => {
		chrome.tabs.sendMessage(tab.id, {
            scrape: true,
            days: days,
        }, () => {})
	})

    intervalTest = setInterval(() => {
        testFinishScraping(tab)
    }, 2000)
}


function testFinishScraping(tab) {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content/completionTester.js"],
	}).then(() => {
		chrome.tabs.sendMessage(tab.id, {
            retrieve: true,
        }, tryRetrieveScrappedData)
	})
}


function tryRetrieveScrappedData(response) {
    console.log("Try Retrieve")
    
    if (response.completed) {
        console.log("Retrieved!")
        clearInterval(intervalTest)

        let data = response.data
        console.log(data)
        document.querySelector("#scraped-data").textContent = data
        processDat(data)

    }


}