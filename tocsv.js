
var csvHeader = `ID, Date To Destination, Date From Destination, To Airline, To Departure, To Arrival, To Listed Price, From Airline, From Departure, From Arrival, From Listed Price`
var csvContent = ""
var csv = ""

let purchaseSites = {}
let purchaseOrder = []

function processDat(dat) {

    let flatten = document.querySelector("#flatten-csv").checked


    purchaseSites = {}

    for (let key in dat) {
        let roundDates = dat[key]
        roundDates.forEach((toFlight) => {
            if (toFlight.skip == 1) {
                return
            }
            toFlight.fromFlight.forEach((fromFlight) => {
                if (fromFlight.skip == 1) {
                    return
                }
                fromFlight.prices.forEach((price) => {
                    purchaseSites[price.site] = 1
                })
            })
        })
    }

    resetPurchaseSites()

    if (!flatten) {
        purchaseOrder = []
        for (let key in purchaseSites) {
            purchaseOrder.push(key)
            csvHeader += `, ${key.replaceAll(",", " ")}`
        }
    }
    else {
        csvHeader += `, Purchase Site, Price`
    }


    for (let key in dat) {
        let roundDates = dat[key]
        let dates = key.split("_")
        let departureDate = dates[0].substring(3)
        let roundReturnDate = dates[1].substring(3)
        roundDates.forEach((toFlight) => {
            if (toFlight.skip == 1) {
                return
            }

            toFlight.fromFlight.forEach((fromFlight) => {
                if (fromFlight.skip == 1) {
                    return
                }
                resetPurchaseSites()

                let basicInfo = `${key}, ${departureDate}, ${roundReturnDate}`
                let departureInfo = `, ${toFlight.airline}, ${toFlight.departure}, ${toFlight.arrivalTime}, ${toFlight.listedPrice.replace(/[^0-9]/g, "")}`.replaceAll("+1", "")
                let roundReturnInfo = `, ${fromFlight.airline}, ${fromFlight.departure}, ${fromFlight.arrivalTime}, ${fromFlight.listedPrice.replace(/[^0-9]/g, "")}`.replaceAll("+1", "")

                if (!flatten) {
                    fromFlight.prices.forEach((price) => {
                        purchaseSites[price.site] = price.price
                    })
                    let lowerRow = ""
                    purchaseOrder.forEach((order) => {
                        lowerRow += `, "${String(purchaseSites[order]).replace(/[^0-9]/g, "")}"`
                    })

                    let priceInfo = `${lowerRow}`.replaceAll("+1", "").replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                    csvContent += `${basicInfo}${departureInfo}${roundReturnInfo}${priceInfo}\n`.replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                }
                else {
                    fromFlight.prices.forEach((price) => {
                        let priceInfo = `, ${price.site.replaceAll(",", " ")}, ${price.price.replace(/[^0-9]/g, "")}`
                        csvContent += `${basicInfo}${departureInfo}${roundReturnInfo}${priceInfo}\n`.replace(/[^a-zA-Z ,0-9:.\n]/g, "")
                    })
                }
            })
        })
    }

    csv = `${csvHeader}\n${csvContent}`

    console.log(csv)
    document.querySelector("#converted-csv").textContent = csv

}

function resetPurchaseSites() {
    for (let key in purchaseSites) {
        purchaseSites[key] = ''
    }
}


if (dat !== undefined) {
    document.querySelector("#convert-data").addEventListener('click', () => {
        processDat(dat)
    })
}