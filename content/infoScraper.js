
function infoScraperListener(request, sender, sendResponse) {

    if (!request.info) {
        return
    }

    const types = document.querySelectorAll(".VfPpkd-uusGie-fmcmS")
    const tripType = types[0]
    const flightType = types[1]
    const adults = document.querySelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-Bz112c-UbuQg.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.LQeN7.okSQSd.xH2dp.VmOqfd.aKzZ8d")

    
    const dates = document.querySelectorAll(".TP4Lpb.eoY5cb.j0Ppje")
    const goDate = dates[0]
    const backDate = dates[1]

    const airports = document.querySelectorAll(".II2One.j0Ppje.zmMKJ.LbIaRd")
    const fromAirport = airports[0]
    const toAirport = airports[2]

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
    chrome.runtime.onMessage.removeListener(infoScraperListener)

}

chrome.runtime.onMessage.addListener(infoScraperListener)
