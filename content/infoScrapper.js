
function infoScrapperListener(request, sender, sendResponse) {

    if (!request.info) {
        return
    }

    const tripType = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.Maqf5d > div.RLVa8.GeHXyb > div > div > div > div.VfPpkd-TkwUic")
    const adults = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.Maqf5d > div.Hj7hq.LLHSpd > div > div.cQnuXe.k0gFV > div > button > span > span")
    const flightType = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.Maqf5d > div.JQrP8b.PLrkBc > div > div > div > div.VfPpkd-TkwUic")
    
    const goDate = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.kStSsc.ieVaIb > div > input")
    const backDate = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.lJODHb.qXDC9e > div > input")
    const fromAirport = document.querySelector("#i21 > div.e5F5td.BGeFcf > div > div > div.cQnuXe.k0gFV > div > div > input")
    const toAirport = document.querySelector("#i21 > div.e5F5td.vxNK6d > div > div > div.cQnuXe.k0gFV > div > div > input")

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
    chrome.runtime.onMessage.removeListener(infoScrapperListener)

}

chrome.runtime.onMessage.addListener(infoScrapperListener)
