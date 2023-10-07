
if (fullScraper_constants === undefined) {
    var fullScraper_constants = true

    var datesQuery = ".TP4Lpb.eoY5cb.j0Ppje"
    var loadingBarQuery = ".VfPpkd-qNpTzb-P1ekSe.VfPpkd-qNpTzb-P1ekSe-OWXEXe-A9y3zc.VfPpkd-qNpTzb-P1ekSe-OWXEXe-OiiCO-IhfUye.VfPpkd-qNpTzb-P1ekSe-OWXEXe-xTMeO.VfPpkd-qNpTzb-P1ekSe-OWXEXe-xTMeO-OiiCO-Xhs9z"
    var flightListQuery = ".Rk10dc"
    var flightQuery = ".pIav2d"
    var clickableFlightQuery = ".OgQvJf.nKlB3b"
    var dateLeftRightButtonsQuery = ".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc.LjDxcd.XhPA0b.LQeN7.Tmm8n"
    
    var fStopsQuery = ".BbR8Ec > .EfT7Ae.AdWm1c.tPgKwe > .ogfYpf"
    var fTimeSetQuery = ".Ir0Voe > .zxVSec.YMlIz.tPgKwe.ogfYpf > .mv1WYe"
    var fDepatureTimeQuery = "span > span > span"
    var fArrivalTimeQuery = "span:nth-child(2) > span > span"
    var fAirlineQuery = ".sSHqwe.tPgKwe.ogfYpf > span:nth-child(1)"
    var fAirlineQuerySecondary = ".sSHqwe.tPgKwe.ogfYpf > span:nth-child(3)"
    var fAirlineAvoidClassQuery = "ali83b" //Selected Flight....
    var fTravelTimeQuery = ".Ak5kof > .gvkrdb.AdWm1c.tPgKwe.ogfYpf"
    var fListedPriceQuery = ".U3gSDe > .BVAVmf.I11szd.POX3ye"

    var priceListQuery = ".AnvSgb"
    var priceListQuerySecondary = ".UUyzUc"
    var pricesQuery = ".gN1nAc"
    var priceSiteQuery = ".ogfYpf.AdWm1c"
    var pricePriceQuery = ".IX8ct.YMlIz.Y4RJJ"

}

var currentDay
var requiredDays

var maxStops

var scrapedInfo
var isRoundTrip
var isOneWay

var data = {}
var builtData = {}
var currentKey
var currentToFlight
var currentFromFlight

var completed = false

function fullScraperListener(request, sender, sendResponse) {
    chrome.runtime.onMessage.removeListener(fullScraperListener)

    if (!request.scrape) {
        return
    }

    console.warn("START SCRAPING")

    currentDay = 0
    requiredDays = request.days - 1
    if (requiredDays < 0) {
        requiredDays = 0
    }

    maxStops = request.stops

    scrapedInfo = request.scrapedInfo
    console.log(scrapedInfo)

    isRoundTrip = scrapedInfo.tripType == "Round trip"
    isOneWay = scrapedInfo.tripType == "One way"
    if (!isRoundTrip && !isOneWay) {
        alert("Trip Type: " + scrapedInfo.tripType + " is not supported!")
        return
    }

    startWithSet()
    proceedToFlight()

}


function finishedBuildData() {
    builtData = {}
    console.warn("Finished Successfully!")
    builtData.result = data
    builtData.days = requiredDays
    builtData.maxStops = maxStops
    builtData.scrapedInfo = scrapedInfo

    console.log(builtData)
    completed = true
}


function startWithSet() {

    let dates = document.querySelectorAll(datesQuery)
    let goDate = dates[0].value
    let backDate = dates[1].value

    let key = `${goDate}_${backDate}`.replace(/\s/g, "").replaceAll(",", "")
    console.log(key)
    currentKey = key

    data[key] = []
}


function waitToLoad(next) {
    console.log("Waiting to Load")
    // The weirdest but the only way to find out if google has finished loading
    let waitForLoading = true
    let interval = setInterval(() => {
        let loadingBar = document.querySelector(loadingBarQuery)
        if (loadingBar == null) {
            console.log("Loading")
            waitForLoading = false
        }
        else {
            if (!waitForLoading) {
                console.log("Loaded")
                clearInterval(interval)
                next()
            }
            else {
                console.log("Pre-Loading")
            }
        }
    }, 10)
}


function clickFlight(clickingNode, index) {
    console.log("Clicking Flight")
    const flights = clickingNode.querySelectorAll(flightQuery)

    let flight = flights[index]
    let fNode = flight.querySelector(clickableFlightQuery)

    fNode.click()
}

function goBack() {
    console.log("Going Back")

    history.back()
}

function nextDay() {
    console.log("Next Day")

    currentDay++
    if (currentDay > requiredDays) {
        finishedBuildData()
        return 1
    }

    const buttons = document.querySelectorAll(dateLeftRightButtonsQuery)
    if (isRoundTrip) {
        const fromRightBtn = buttons[1]
        fromRightBtn.click()
    
        const toRightBtn = buttons[3]
        toRightBtn.click()
    }
    else if (isOneWay) {
        const fromRightBtn = buttons[1]
        fromRightBtn.click()
    }

    startWithSet()
    console.log("Next Day Clicked")
}




function proceedToFlight() {
    let result = readToFlight()
    if (result == 1) {
        let result = nextDay()
        if (result != 1) {
            waitToLoad(() => {
                proceedToFlight()
            })
        }
    }
}

function readToFlight() {
    console.log("Read To Flight")
    const listNode = document.querySelector(flightListQuery)
    const flights = listNode.querySelectorAll(flightQuery)

    let length = flights.length
    let index = data[currentKey].length

    if (index < length) {
        let toFlight = readFlight(flights, index)
        let skip = toFlight.skip
        data[currentKey].push(toFlight)
        currentToFlight = toFlight
        if (isRoundTrip) {
            currentToFlight.fromFlight = []
        }
        else if (isOneWay) {

        }

        if (!skip) {
            clickFlight(listNode.parentNode, index)

            if (isRoundTrip) {
                // Load returning flights
                waitToLoad(() => {
                    proceedFromFlight()
                })
            }
            else if (isOneWay) {
                // Load price instantly
                console.log("Prepare to Load Price")
                waitToLoad(() => {
                    currentToFlight.prices = readPrices()
                    goBack()
                    waitToLoad(() => {
                        proceedToFlight()
                    })
                })
            }


        }
        else {
            console.log("Skipped")
            proceedToFlight()
        }
    }
    else {
        console.warn("Finished To Flight")
        console.log(data)
        return 1
    }

}




function proceedFromFlight() {
    if (isOneWay) {
        console.error("One Way does not have a return flight!")
        return
    }

    let result = readFromFlight()
    if (result == 1) {
        goBack()
        waitToLoad(() => {
            proceedToFlight()
        })
    }
}

function readFromFlight() {
    if (isOneWay) {
        console.error("One Way does not have a return flight!")
        return
    }

    console.log("Read From Flight")
    const listNode = document.querySelector(flightListQuery)
    const flights = listNode.querySelectorAll(flightQuery)

    let length = flights.length
    let index = currentToFlight.fromFlight.length

    if (index < length) {
        let fromFlight = readFlight(flights, index)
        let skip = fromFlight.skip
        currentToFlight.fromFlight.push(fromFlight)
        currentFromFlight = fromFlight

        if (!skip) {
            clickFlight(listNode.parentNode, index)
            console.log("Prepare to Load Price")
            waitToLoad(() => {
                currentFromFlight.prices = readPrices()
                goBack()
                waitToLoad(() => {
                    proceedFromFlight()
                })
            })
        }
        else {
            console.log("Skipped")
            proceedFromFlight()
        }

    }
    else {
        console.warn("Finished From Flight")
        return 1
    }
}




function readFlight(flightNodes, index) {
    console.log("Reading Flight")

    let flight = flightNodes[index]

    var fDetail = {}
    let fNode = flight.querySelector(clickableFlightQuery)

    // Stops
    let fStops = fNode.querySelector(fStopsQuery).textContent
    // If zero, skip nonstop stops
    if (maxStops == 0) {
        if (fStops != "Nonstop") {
            return {
                skip: true
            }
        }
    }
    fDetail.stops = fStops
    if (fStops != "Nonstop") {
        // Convert stops to int to compare
        let fStopsInt = parseInt(fStops.replace(/[^0-9]/g, ""))
        if (fStopsInt > maxStops) {
            return {
                skip: true
            }
        }
        fDetail.stops = fStopsInt
    }

    // Departure arrival time
    let fTimeSet = fNode.querySelector(fTimeSetQuery)
    fDetail.departure = fTimeSet.querySelector(fDepatureTimeQuery).textContent
    fDetail.arrivalTime = fTimeSet.querySelector(fArrivalTimeQuery).textContent

    // Airline
    let airlineNode = fNode.querySelector(fAirlineQuery)
    if (airlineNode.classList.contains(fAirlineAvoidClassQuery)) {
        airlineNode = fNode.querySelector(fAirlineQuerySecondary)
    }
    fDetail.airline = airlineNode.textContent

    // Timing
    fDetail.travelTime = fNode.querySelector(fTravelTimeQuery).textContent

    // Listed Price
    fDetail.listedPrice = fNode.querySelector(fListedPriceQuery).textContent

    return fDetail
}

function readPrices() {
    console.log("Reading Prices")

    var prices = []
    let list = document.querySelector(priceListQuery)
    if (!list) {
        // If the price list doesn't have the expandable, then it is in this different query
        list = document.querySelector(priceListQuerySecondary)
    }
    const priceNodes = list.querySelectorAll(pricesQuery)
    priceNodes.forEach((price) => {
        var pDetail = {}
        pDetail.site = price.querySelector(priceSiteQuery).textContent.substring(10)
        pDetail.price = price.querySelector(pricePriceQuery).textContent
        prices.push(pDetail)
    })

    return prices
}



chrome.runtime.onMessage.addListener(fullScraperListener)
