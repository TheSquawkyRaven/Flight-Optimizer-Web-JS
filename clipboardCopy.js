
const copyScrapedButton = document.querySelector("#copy-scraped")
const copyScrapedTextArea = document.querySelector("#scraped-data")

const copyCSVButton = document.querySelector("#copy-csv")
const copyCSVTextArea = document.querySelector("#converted-csv")


function copyToClipboard(text) {

    navigator.clipboard.writeText(text).then(() => {

    }, (err) => {
        alert("Cannot copy text. Copy manually by clicking on the text box, CTRL + A, and CTRL + C.\n" + err)
    });

}


copyScrapedButton.addEventListener('click', () => {
    copyToClipboard(copyScrapedTextArea.textContent)
})

copyCSVButton.addEventListener('click', () => {
    copyToClipboard(copyCSVTextArea.textContent)
})

