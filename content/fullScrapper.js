
// const fromLeftBtn = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.kStSsc.ieVaIb > div > div.Z4JKhb.CKPWLe.wW6ySd.W3yZgb > button")
// const toLeftBtn = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.lJODHb.qXDC9e > div > div.Z4JKhb.CKPWLe.wW6ySd.W3yZgb > button")

const flightListNodeQuery = "#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.FXkZv > div:nth-child(4) > ul"
const priceListNodeQuery = "#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div > div.SDUAh.Xag90b.jtr7Nd > div.OLfz3c > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.RvrZge > div.q0q6Ub.RbR6Df > div:nth-child(1) > div"
const priceListNodeQuery2 = "#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div > div.SDUAh.Xag90b.jtr7Nd > div.OLfz3c > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.RvrZge > div.UUyzUc"

var currentDay
var requiredDays

var data = {}
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

    startWithSet()
    proceedToFlight()
}


function startWithSet() {

    let goDate = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.kStSsc.ieVaIb > div > input").value
    let backDate = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.lJODHb.qXDC9e > div > input").value

    let key = `${goDate}_${backDate}`.replace(/\s/g, "").replaceAll(",", "");
    console.log(key)
    currentKey = key

    data[key] = []
}


function waitToLoad(isDoneFunc, next) {
    console.log("Waiting to Load")
    let interval = setInterval(() => {
        let isDone = isDoneFunc()
        if (isDone) {
            clearInterval(interval)
            //console.log("next")
            next()
        }
        else {
            console.log("Waiting...")
        }
    }, 250)
}

function waitFlightToLoad(next) {
    let requests = 0
    waitToLoad(() => {
        let container = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.FXkZv > div:nth-child(4)")
        if (container) {
            let h3 = container.querySelector(":scope > h3")
            if (h3) {
                console.log(h3.textContent)
                if (h3.textContent == "Best returning flights" || h3.textContent == "Best departing flights") {
                    let nodes = container.querySelector(":scope > ul")
                    if (nodes) {
                        if (nodes.childElementCount > 0) {
                            return true
                        }
                    }
                }
                if (requests > 1) {
                    return true
                }
                requests++
            }
        }
        return false
    }, next)
}

function waitPriceToLoad(next) {
    waitToLoad(() => {
        let container = document.querySelector(priceListNodeQuery)
        if (!container) {
            container = document.querySelector(priceListNodeQuery2)
        }
        if (container) {
            return true
        }
        return false
    }, next)
}

function clickFlightAndRemove(node, index) {
    console.log("Clicking Flight")
    const flights = node.querySelectorAll(".pIav2d")

    let flight = flights[index]
    let fNode = flight.querySelector(".OgQvJf.nKlB3b")

    fNode.click()
    setTimeout(() => {
        node.remove()
    }, 10)
}

function backAndRemove(node) {
    console.log("Going Back")
    history.back()
    setTimeout(() => {
        if (node) {
            node.remove()
        }
    }, 10)
}

function nextDayAndRemove(node) {
    console.log("Next Day")

    currentDay++
    if (currentDay > requiredDays) {
        console.log("Finished All Required Days!")
        console.log(data)
        completed = true
        return 1
    }

    const fromRightBtn = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.kStSsc.ieVaIb > div > div.Z4JKhb.CKPWLe.HDVC8.Xbfhhd > button")
    const toRightBtn = document.querySelector("#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div.cKvRXe > c-wiz > div.PSZ8D.EA71Tc > div.Ep1EJd > div > div.rIZzse > div.bgJkKe.K0Tsu > div > div > div.cQnuXe.k0gFV > div > div > div:nth-child(1) > div > div.oSuIZ.YICvqf.lJODHb.qXDC9e > div > div.Z4JKhb.CKPWLe.HDVC8.Xbfhhd > button")
    fromRightBtn.click()
    toRightBtn.click()

    console.log("Next Day Clicked")
    setTimeout(() => {
        startWithSet()
        node.remove()
    }, 10)
}




function proceedToFlight() {
    let result = readToFlight()
    if (result == 1) {
        let result = nextDayAndRemove(document.querySelector(flightListNodeQuery))
        if (result != 1) {
            waitFlightToLoad(() => {
                proceedToFlight()
            })
        }
    }
}

function readToFlight() {
    console.log("Read To Flight")
    let listNode = document.querySelector(flightListNodeQuery)
    if (listNode == null) {
        console.log(flightListNodeQuery)
        console.log(listNode)
        listNode = document.querySelector(flightListNodeQuery)
        console.log(listNode)
    }
    const flights = listNode.querySelectorAll(".pIav2d")

    let length = flights.length
    let index = data[currentKey].length

    if (index < length) {
        let toFlight = readFlight(flights, index)
        let skip = toFlight.skip
        data[currentKey].push(toFlight)
        currentToFlight = toFlight
        currentToFlight.fromFlight = []

        if (!skip) {
            clickFlightAndRemove(listNode, index)
            waitFlightToLoad(() => {
                proceedFromFlight()
            })
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
    let result = readFromFlight()
    if (result == 1) {
        backAndRemove(document.querySelector(flightListNodeQuery))
        waitFlightToLoad(() => {
            proceedToFlight()
        })
    }
}

function readFromFlight() {
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
            clickFlightAndRemove(listNode, index)
            console.log("Prepare to Load Price")
            waitPriceToLoad(() => {
                currentFromFlight.prices = readPrices()
                backAndRemove()
                waitFlightToLoad(() => {
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

    let fStops = fNode.querySelector(".BbR8Ec > .EfT7Ae.AdWm1c.tPgKwe").textContent
    if (fStops != "Nonstop") {
        return {
            skip: true
        }
    }
    fDetail.stops = fStops


    let fTimeSet = fNode.querySelector(".Ir0Voe > .zxVSec.YMlIz.tPgKwe.ogfYpf > .mv1WYe")
    fDetail.departure = fTimeSet.querySelector("span > span > span").textContent
    fDetail.arrivalTime = fTimeSet.querySelector("span:nth-child(2) > span > span").textContent

    fDetail.airline = fNode.querySelector(".sSHqwe.tPgKwe.ogfYpf > span:nth-child(1)").textContent

    fDetail.travelTime = fNode.querySelector(".Ak5kof > .gvkrdb.AdWm1c.tPgKwe.ogfYpf").textContent

    fDetail.listedPrice = fNode.querySelector(".U3gSDe > .BVAVmf.I11szd.POX3ye").textContent

    return fDetail
}

function readPrices() {
    console.log("Reading Prices")

    var prices = []
    let list = document.querySelector(priceListNodeQuery)
    if (!list) {
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
