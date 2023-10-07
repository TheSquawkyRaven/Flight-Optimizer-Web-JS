
const flightListNodeQuery = ".Rk10dc"
const priceListNodeQuery = ".AnvSgb"
// If the price list doesn't have the expandable, then it in this different query
const priceListNodeQuery2 = ".UUyzUc"

const roundTripText = "Round trip"
const oneWayText = "One way"


var currentDay
var requiredDays

var maxStops

var scrappedInfo
var isRoundTrip
var isOneWay

var data = {}
var builtData = {}
var currentKey
var currentToFlight
var currentFromFlight

var completed = false

function fullScrapperListener(request, sender, sendResponse) {

    if (!request.scrape) {
        return
    }

    console.warn("START SCRAPING")

    currentDay = 0
    requiredDays = request.days - 1

    maxStops = request.stops

    scrappedInfo = request.scrappedInfo
    console.log(scrappedInfo)

    isRoundTrip = scrappedInfo.tripType == roundTripText
    isOneWay = scrappedInfo.tripType == oneWayText
    if (!isRoundTrip && !isOneWay) {
        alert("Trip Type: " + scrappedInfo.tripType + " is not supported!")
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
    builtData.scrappedInfo = scrappedInfo

    console.log(builtData)
    completed = true
}


function startWithSet() {

    let dates = document.querySelectorAll(".TP4Lpb.eoY5cb.j0Ppje")
    let goDate = dates[0].value
    let backDate = dates[1].value

    let key = `${goDate}_${backDate}`.replace(/\s/g, "").replaceAll(",", "")
    console.log(key)
    currentKey = key

    data[key] = []
}


function waitToLoad(isDoneFunc, next) {
    console.log("Waiting to Load")
    let waitForLoading = true
    // The weirdest but the only way to find out if google has finished loading
    let interval = setInterval(() => {
        let st = document.querySelector(".VfPpkd-qNpTzb-P1ekSe.VfPpkd-qNpTzb-P1ekSe-OWXEXe-A9y3zc.VfPpkd-qNpTzb-P1ekSe-OWXEXe-OiiCO-IhfUye.VfPpkd-qNpTzb-P1ekSe-OWXEXe-xTMeO.VfPpkd-qNpTzb-P1ekSe-OWXEXe-xTMeO-OiiCO-Xhs9z")
        if (st == null) {
            console.log("Loading")
            waitForLoading = false
        }
        else {
            if (!waitForLoading) {
                console.log("Loaded")
                clearInterval(interval)
                //console.log("next")
                next()
            }
        }
    }, 10)
    // let interval = setInterval(() => {
    //     let isDone = isDoneFunc()
    //     if (isDone) {
    //         clearInterval(interval)
    //         //console.log("next")
    //         next()
    //     }
    //     else {
    //         console.log("Waiting...")
    //     }
    // }, 250)
}

function waitFlightToLoad(isDepart, next) {
    let skippedFirstCheck = false
    waitToLoad(() => {
        let container = document.querySelector(flightListNodeQuery)
        if (container) {
            container = container.parentNode
            let h3 = container.querySelector(":scope > h3")
            if (h3) {
                let text = h3.textContent
                if (isOneWay) {
                    //Expected: "Best flights", "Other flights", "Flights"
                    if (text == "Best flights") {
                        // Skipping first check to prevent redraw on load
                        if (!skippedFirstCheck) {
                            skippedFirstCheck = true
                            return false
                        }
                        return true
                    }
                    else if (text == "Other flights") {
                        // If "other" exists, then only the "best" should be used
                        return false
                    }
                    else if (text == "Flights") {
                        // Skipping first check to prevent redraw on load (No "best" nor "other")
                        if (!skippedFirstCheck) {
                            skippedFirstCheck = true
                            return false
                        }
                        return true
                    }
                    else {
                        console.error("Unkown text to handle - " + text)
                        return false
                    }
                }
                if (isDepart) {
                    //Expected: "Best departing flights", "Other departing flights", "Departing flights"
                    if (text == "Best departing flights") {
                        // Skipping first check to prevent redraw on load
                        if (!skippedFirstCheck) {
                            skippedFirstCheck = true
                            return false
                        }
                        return true
                    }
                    else if (text == "Other departing flights") {
                        // If "other" exists, then only the "best" should be used
                        return false
                    }
                    else if (text == "Departing flights") {
                        // Skipping first check to prevent redraw on load (No "best" nor "other")
                        if (!skippedFirstCheck) {
                            skippedFirstCheck = true
                            return false
                        }
                        return true
                    }
                    else {
                        console.error("Unkown text to handle - " + text)
                        return false
                    }
                }
                else {
                    //Expected: "Best returning flights", "Other returning flights", "Returning flights"
                    if (text == "Best returning flights") {
                        // Skipping first check to prevent redraw on load
                        if (!skippedFirstCheck) {
                            skippedFirstCheck = true
                            return false
                        }
                        return true
                    }
                    else if (text == "Other returning flights") {
                        // If "other" exists, then only the "best" should be used
                        return false
                    }
                    else if (text == "Returning flights") {
                        // Skipping first check to prevent redraw on load (No "best" nor "other")
                        if (!skippedFirstCheck) {
                            skippedFirstCheck = true
                            return false
                        }
                        return true
                    }
                    else {
                        console.error("Unkown text to handle - " + text)
                        return false
                    }
                }
            }
        }
        return false
    }, next)
}

function waitPriceToLoad(next) {
    waitToLoad(() => {
        let container = document.querySelector(priceListNodeQuery)
        if (!container) {
            // If the price list doesn't have the expandable, then it in this different query
            container = document.querySelector(priceListNodeQuery2)
        }
        if (container) {
            return true
        }
        return false
    }, next)
}

function clickFlightAndRemove(clickingNode, index) {
    console.log("Clicking Flight")
    const flights = clickingNode.querySelectorAll(".pIav2d")

    let flight = flights[index]
    let fNode = flight.querySelector(".OgQvJf.nKlB3b")

    fNode.click()
    console.log(clickingNode)
    console.log(fNode)
    removeFlightList()
}

function removeFlightList(next) {

    let removingChildNodes = document.querySelectorAll(flightListNodeQuery)
    setTimeout(() => {
        removingChildNodes.forEach((removingChildNode) => {
            removingChildNode.parentNode.remove()
            //console.warn(removingChildNode.parentNode)
        })
        if (next) {
            next()
        }
    }, 1)
}

function backAndRemove(removeNode) {
    console.log("Going Back")

    history.back()

    if (removeNode) {
        removeFlightList()
    }
}

function nextDayAndRemove() {
    console.log("Next Day")

    currentDay++
    if (currentDay > requiredDays) {
        finishedBuildData()
        return 1
    }

    const buttons = document.querySelectorAll(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc.LjDxcd.XhPA0b.LQeN7.Tmm8n")
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

    removeFlightList(() => {
        startWithSet()
    })

    console.log("Next Day Clicked")
}




function proceedToFlight() {
    let result = readToFlight()
    if (result == 1) {
        let result = nextDayAndRemove()
        if (result != 1) {
            waitFlightToLoad(true, () => {
                proceedToFlight()
            })
        }
    }
}

function readToFlight() {
    console.log("Read To Flight")
    let listNode = document.querySelector(flightListNodeQuery)
    const flights = listNode.querySelectorAll(".pIav2d")

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
            clickFlightAndRemove(listNode.parentNode, index)

            if (isRoundTrip) {
                // Load returning flights
                waitFlightToLoad(false, () => {
                    proceedFromFlight()
                })
            }
            else if (isOneWay) {
                // Load price instantly
                console.log("Prepare to Load Price")
                waitPriceToLoad(() => {
                    currentToFlight.prices = readPrices()
                    backAndRemove()
                    waitFlightToLoad(false, () => {
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
        backAndRemove(true)
        waitFlightToLoad(true, () => {
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
    const listNode = document.querySelector(flightListNodeQuery)
    const flights = listNode.querySelectorAll(".pIav2d")

    let length = flights.length
    let index = currentToFlight.fromFlight.length

    if (index < length) {
        let fromFlight = readFlight(flights, index)
        let skip = fromFlight.skip
        currentToFlight.fromFlight.push(fromFlight)
        currentFromFlight = fromFlight

        if (!skip) {
            clickFlightAndRemove(listNode.parentNode, index)
            console.log("Prepare to Load Price")
            waitPriceToLoad(() => {
                currentFromFlight.prices = readPrices()
                backAndRemove()
                waitFlightToLoad(false, () => {
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
    let fNode = flight.querySelector(".OgQvJf.nKlB3b")

    // Stops
    let fStops = fNode.querySelector(".BbR8Ec > .EfT7Ae.AdWm1c.tPgKwe > .ogfYpf").textContent
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
    let fTimeSet = fNode.querySelector(".Ir0Voe > .zxVSec.YMlIz.tPgKwe.ogfYpf > .mv1WYe")
    fDetail.departure = fTimeSet.querySelector("span > span > span").textContent
    fDetail.arrivalTime = fTimeSet.querySelector("span:nth-child(2) > span > span").textContent

    // Airline
    let airlineNode = fNode.querySelector(".sSHqwe.tPgKwe.ogfYpf > span:nth-child(1)")
    if (airlineNode.classList.contains("ali83b")) {
        airlineNode = fNode.querySelector(".sSHqwe.tPgKwe.ogfYpf > span:nth-child(3)")
    }
    fDetail.airline = airlineNode.textContent

    // Timing
    fDetail.travelTime = fNode.querySelector(".Ak5kof > .gvkrdb.AdWm1c.tPgKwe.ogfYpf").textContent

    // Listed Price
    fDetail.listedPrice = fNode.querySelector(".U3gSDe > .BVAVmf.I11szd.POX3ye").textContent

    return fDetail
}

function readPrices() {
    console.log("Reading Prices")

    var prices = []
    let list = document.querySelector(priceListNodeQuery)
    if (!list) {
        // If the price list doesn't have the expandable, then it in this different query
        list = document.querySelector(priceListNodeQuery2)
    }
    const priceNodes = list.querySelectorAll(".gN1nAc")
    priceNodes.forEach((price) => {
        var pDetail = {}
        pDetail.site = price.querySelector(".ogfYpf.AdWm1c").textContent.substring(10)
        pDetail.price = price.querySelector(".IX8ct.YMlIz.Y4RJJ").textContent
        prices.push(pDetail)
    })

    return prices
}



chrome.runtime.onMessage.addListener(fullScrapperListener)
