

const startScrapeButton = document.querySelector("#start-scrape")
const tryRetrieveButton = document.querySelector("#try-retrieve")
const daysInput = document.querySelector("#days")
const stopsInput = document.querySelector("#stops")

function startScrape() {
	let days = parseInt(daysInput.value)
	if (days == NaN || days < 0) {
        alert("Days must be 0 or positive, not " + String(days))
		return
	}
    let stops = parseInt(stopsInput.value)
    if (stops == NaN || stops < 0) {
        alert("Stops must be 0 or positive, not " + String(days))
        return
    }

    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        injectFullScraper(tabs[0], days, stops, scrapedInfo)
    })
	
}

function tryRetrieve() {
    
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        testFinishScraping(tabs[0])
    })

}

startScrapeButton.addEventListener('click', startScrape)
tryRetrieveButton.addEventListener('click', tryRetrieve)

var intervalTest

function injectFullScraper(tab, days, stops, scrapedInfo) {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content/fullScraper.js"],
	}).then(() => {
		chrome.tabs.sendMessage(tab.id, {
            scrape: true,
            days: days,
            stops: stops,
            scrapedInfo: scrapedInfo,
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
        }, tryRetrieveScrapedData)
	})
}


function tryRetrieveScrapedData(response) {
    console.log("Try Retrieve")
    
    if (response.completed) {
        console.log("Retrieved!")
        clearInterval(intervalTest)

        let data = response.data
        console.log(data)
        document.querySelector("#scraped-data").textContent = JSON.stringify(data)
        dat = data
        processDat(data)

    }


}