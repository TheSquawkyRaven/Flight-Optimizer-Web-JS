
const roundTripText = "Round trip"
const oneWayText = "One way"

const csvHeaderPreset = `ID, Date To Destination, Date From Destination, To Airline, To Departure, To Arrival, To Listed Price, From Airline, From Departure, From Arrival, From Listed Price`
var csvHeader = ""
var csvContent = ""
var csv = ""

function processDat(data) {

    let flatten = document.querySelector("#flatten-csv").checked

    let result = data.result
    let isRoundTrip = data.scrappedInfo.tripType == roundTripText
    let isOneWay = data.scrappedInfo.tripType == oneWayText

    csvHeader = csvHeaderPreset
    csvContent = ""
    csv = ""

    let purchaseSites = {}
    let purchaseOrder = []

    findAllPriceSites(result, isRoundTrip, isOneWay, purchaseSites)

    resetPurchaseSites(purchaseSites)

    fillHeader(isRoundTrip, isOneWay, purchaseSites, purchaseOrder, flatten)


    for (let key in result) {
        let roundDates = result[key]
        let dates = key.split("_")
        let departureDate = dates[0].substring(3)
        let roundReturnDate = dates[1].substring(3)
        roundDates.forEach((toFlight) => {
            if (toFlight.skip == 1) {
                return
            }

            let departureInfo = `, ${toFlight.airline.replace(",", ".")}, ${toFlight.departure}, ${toFlight.arrivalTime}, ${toFlight.listedPrice.replace(/[^0-9]/g, "")}`.replace(/\+[0-9]/g, "")

            if (isRoundTrip) {
                let basicInfo = `${key}, ${departureDate}, ${roundReturnDate}`

                toFlight.fromFlight.forEach((fromFlight) => {
                    if (fromFlight.skip == 1) {
                        return
                    }
                    resetPurchaseSites(purchaseSites)

                    let roundReturnInfo = `, ${fromFlight.airline.replace(",", ".")}, ${fromFlight.departure}, ${fromFlight.arrivalTime}, ${fromFlight.listedPrice.replace(/[^0-9]/g, "")}`.replace(/\+[0-9]/g, "")

                    let priceInfo = retrievePrice(fromFlight, purchaseSites, purchaseOrder, flatten)
                    if (!flatten) {
                        csvContent += `${basicInfo}${departureInfo}${roundReturnInfo}${priceInfo}\n`.replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                    }
                    else {
                        priceInfo.forEach((pInfo) => {
                            csvContent += `${basicInfo}${departureInfo}${roundReturnInfo}${pInfo}\n`.replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                        })
                    }
                })
            }
            else if (isOneWay) {
                let basicInfo = `${key}, ${departureDate}`

                resetPurchaseSites(purchaseSites)
                
                let priceInfo = retrievePrice(toFlight, purchaseSites, purchaseOrder, flatten)
                if (!flatten) {
                    csvContent += `${basicInfo}${departureInfo}${priceInfo}\n`.replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                }
                else {
                    priceInfo.forEach((pInfo) => {
                        csvContent += `${basicInfo}${departureInfo}${pInfo}\n`.replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                    })
                }
            }
        })
    }

    csv = `${csvHeader}\n${csvContent}`

    console.log(csv)
    document.querySelector("#converted-csv").textContent = csv

}


function findAllPriceSites(result, isRoundTrip, isOneWay, purchaseSites) {

    for (let key in result) {
        let roundDates = result[key]
        roundDates.forEach((toFlight) => {
            if (toFlight.skip == 1) {
                return
            }
            // Round Trip
            if (isRoundTrip) {
                toFlight.fromFlight.forEach((fromFlight) => {
                    if (fromFlight.skip == 1) {
                        return
                    }
                    fromFlight.prices.forEach((price) => {
                        purchaseSites[price.site] = 1
                    })
                })
            }
            // One Way
            else if (isOneWay) {
                toFlight.prices.forEach((price) => {
                    purchaseSites[price.site] = 1
                })
            }
        })
    }
}


function fillHeader(isRoundTrip, isOneWay, purchaseSites, purchaseOrder, flatten) {
    if (!flatten) {
        for (let key in purchaseSites) {
            purchaseOrder.push(key)
            csvHeader += `, ${key.replaceAll(",", " ")}`
        }
    }
    else {
        csvHeader += `, Purchase Site, Price`
    }
    if (isRoundTrip) {

    }
    else if (isOneWay) {
        csvHeader = csvHeader.replace(", Date From Destination", "")
    }
}


function retrievePrice(container, purchaseSites, purchaseOrder, flatten) {

    if (!flatten) {
        container.prices.forEach((price) => {
            purchaseSites[price.site] = price.price
        })
        let lowerRow = ""
        purchaseOrder.forEach((order) => {
            let priceValue = String(purchaseSites[order])
            if (priceValue.includes("$")) {
                priceValue = priceValue.replace(/[^0-9$]/g, "")
                let split = priceValue.split("$")
                priceValue = String(parseInt(split[0]) + parseInt(split[1]))
                console.log(`Added Price: ${split[0]} + ${split[1]} = ${priceValue}`)
            }
            lowerRow += `, "${priceValue.replace(/[^0-9]/g, "")}"`
        })

        let priceInfo = `${lowerRow}`
        return priceInfo
    }
    else {
        let priceInfos = []
        container.prices.forEach((price) => {
            let priceValue = price.price
            if (priceValue.includes("$")) {
                priceValue = priceValue.replace(/[^0-9$]/g, "")
                let split = priceValue.split("$")
                priceValue = String(parseInt(split[0]) + parseInt(split[1]))
                console.log(`Added Price: ${split[0]} + ${split[1]} = ${priceValue}`)
            }
            let priceInfo = `, ${price.site.replaceAll(",", " ")}, ${priceValue.replace(/[^0-9]/g, "")}`
            priceInfos.push(priceInfo)
        })
        return priceInfos
    }
}

function resetPurchaseSites(purchaseSites) {
    for (let key in purchaseSites) {
        purchaseSites[key] = ''
    }
}

document.querySelector("#convert-data").addEventListener('click', () => {
    processDat(dat)
})