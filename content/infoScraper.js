
function infoScraperListener(request, sender, sendResponse) {

    chrome.runtime.onMessage.removeListener(infoScraperListener)

    var error = {
        error: "Invalid Page. Please use https://www.google.com/travel/flights"
    }

    // URL Check
    let url = window.location.href
    if (url.startsWith("https://www.google.com/travel/flights")) {
        error.error = "Please search for a flight first before using this"
    }
    else if (url.startsWith("https://www.google.com/travel/flights/booking")) {
        error.error = "Please return to the departing flights page to use this, not the pricing page"
    }

    if (!request.info) {
        return
    }

    // Trip General Info
    const types = document.querySelectorAll(".VfPpkd-uusGie-fmcmS")
    if (types == null) {
        sendResponse(error)
        return
    }
    const tripType = types[0]
    const flightType = types[1]
    const adults = document.querySelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-Bz112c-UbuQg.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.LQeN7.okSQSd.xH2dp.VmOqfd.aKzZ8d")
    if (tripType == null || flightType == null || adults == null) {
        sendResponse(error)
        return
    }
    if (tripType.textContent.includes("Multi-city")) {
        error.error = "Multi-city flights are currently not supported, please choose Round Trip or One Way"
        sendResponse(error)
        return
    }
    
    // Dates
    const dates = document.querySelectorAll(".TP4Lpb.eoY5cb.j0Ppje")
    if (dates == null) {
        sendResponse(error)
        return
    }
    const goDate = dates[0]
    const backDate = dates[1]
    if (goDate == null || backDate == null) {
        sendResponse(error)
        return
    }

    // Airports
    const airports = document.querySelectorAll(".II2One.j0Ppje.zmMKJ.LbIaRd")
    if (airports == null) {
        sendResponse(error)
        return
    }
    const fromAirport = airports[0]
    const toAirport = airports[2]
    if (fromAirport == null || toAirport == null) {
        sendResponse(error)
        return
    }

    // Flight title check (Departing/Returning flights)
    const flightTitle = document.querySelector(".zBTtmb.ZSxxwc")
    if (flightTitle == null) {
        sendResponse(error)
        return
    }
    let title = flightTitle.textContent
    if (title == null) {
        sendResponse(error)
        return
    }
    // "Departing flights" or "Best departing flights" only
    if (!title.includes("eparting")) {
        error.error = "You must be in the Departing Flights page, not the Returning Flights page"
        sendResponse(error)
        return
    }


    let response = {
        tripType: tripType.textContent,
        adults: adults.textContent,
        flightType: flightType.textContent,

        goDate: goDate.value,
        backDate: backDate.value,
        fromAirport: fromAirport.value,
        toAirport: toAirport.value
    }

    console.log(response)
    sendResponse(response)

}

chrome.runtime.onMessage.addListener(infoScraperListener)
