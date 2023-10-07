
function infoScraperListener(request, sender, sendResponse) {

    chrome.runtime.onMessage.removeListener(infoScraperListener)

    var error = {
        error: "Invalid Page. Please use https://www.google.com/travel/flights"
    }

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
    if (!title.includes("eparting")) {
        sendResponse({
            error: "You must be in the Departing Flights page, not the Returning Flights page"
        })
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
