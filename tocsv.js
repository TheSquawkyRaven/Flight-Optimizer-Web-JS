
var csvHeader = `ID, Date To Destination, Date From Destination, To Airline, To Departure, To Arrival, To Listed Price, From Airline, From Departure, From Arrival, From Listed Price`
var csvContent = ""
var csv = ""

let purchaseSites = {}
let purchaseOrder = []

function processDat() {

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
            csvHeader += `, ${key}`
        }
    }
    else {
        csvHeader += `, Purchase Site, Price`
    }

    
    for (let key in dat) {
        let roundDates = dat[key]
        let dates = key.split("_")
        roundDates.forEach((toFlight) => {
            if (toFlight.skip == 1) {
                return
            }

            toFlight.fromFlight.forEach((fromFlight) => {
                if (fromFlight.skip == 1) {
                    return
                }
                resetPurchaseSites()
                if (!flatten) {
                    fromFlight.prices.forEach((price) => {
                        purchaseSites[price.site] = price.price
                    })
                    let lowerRow = ""
                    purchaseOrder.forEach((order) => {
                        lowerRow += `, "${String(purchaseSites[order]).replace(/[^0-9]/g, "")}"`
                    })
    
                    csvContent += `${key}, ${dates[0]}, ${dates[1]}, ${toFlight.airline}, ${toFlight.departure}, ${toFlight.arrivalTime}, ${toFlight.listedPrice.replace(/[^0-9]/g, "")}, ${fromFlight.airline}, ${fromFlight.departure}, ${fromFlight.arrivalTime}, ${fromFlight.listedPrice.replace(/[^0-9]/g, "")}${lowerRow}\n`.replaceAll("+1", "").replace(/[^a-zA-Z ,0-9:.\n]/g, "")    
                }
                else {
                    fromFlight.prices.forEach((price) => {
                        csvContent += `${key}, ${dates[0]}, ${dates[1]}, ${toFlight.airline}, ${toFlight.departure}, ${toFlight.arrivalTime}, ${toFlight.listedPrice.replace(/[^0-9]/g, "")}, ${fromFlight.airline}, ${fromFlight.departure}, ${fromFlight.arrivalTime}, ${fromFlight.listedPrice.replace(/[^0-9]/g, "")}, "${price.site}", ${price.price.replace(/[^0-9]/g, "")}\n`.replaceAll("+1", "").replace(/[^a-zA-Z ,0-9:.\n]/g, "")    
                    })
                }
            })
        })
    }


    csv = `${csvHeader}\n${csvContent}`

    console.log(csv)

    return csv

}

function resetPurchaseSites() {
    for (let key in purchaseSites) {
        purchaseSites[key] = ''
    }
}


if (dat !== undefined) {
    document.querySelector("#convert-data").addEventListener('click', () => {
        processDat()
        document.querySelector("#converted-csv").textContent = csv
    })
}