
function completionListener(request, sender, sendResponse) {

    if (!request.retrieve) {
        return
    }

    if (!completed) {
        let response = {
            completed: false
        }
        sendResponse(response)

    }

    else {
        let response = {
            completed: true,
            data: data
        }
        sendResponse(response)
    }
    chrome.runtime.onMessage.removeListener(completionListener)

}

chrome.runtime.onMessage.addListener(completionListener)
