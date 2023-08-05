const loginForm = document.getElementById('login-form')
const contentContainer = document.getElementById('content-container')
console.log(contentContainer)
const baseEndpoint = "http://localhost:8000/api"
loginForm.addEventListener('submit', handleLogin)
// contentContainer.innerHTML = "<pre>" + "hi" + "</pre>"
function writeToContent(data) {
    if (contentContainer) {
        contentContainer.innerHTML = "<pre>" + JSON.stringify(data, null, 4)+ "</pre>"
    }
}

function handleLogin(event) {
    console.log(loginForm.dataset)
    console.log(event)
    event.preventDefault()
    let loginFormData = new FormData(loginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let bodyData = JSON.stringify(loginObjectData)
    console.log(loginObjectData)
    const loginEndpoint = `${baseEndpoint}/token/`
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: bodyData

    }
    fetch(loginEndpoint, options).then(response => {
        return response.json()
    }).then(authData => {
        handleAuthData(authData, getProductList)
    }).catch(err => {
        console.log(err)
    })
}

function handleAuthData(authData, callback) {
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)
    if (callback) {
        console.log("here")
        callback()
    }
}

function validateJWTToken() {
    const endpoint = `${baseEndpoint}/token/verify/`
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({token: localStorage.getItem('access')})
    }
    fetch(endpoint, options).then(response => response.json()).then(x=> {
        //refresh token
    })
}

function isInvalidToken(jsonData) {
    if (jsonData['code'] && jsonData['code']==="token_not_valid") {
        //or run a refresh token fetch
        alert("Please login again")
        return false

    }
    return true
}
function getFetchOptions(method, body) {
    return {
        method: method === null ? "GET": method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        body: body ? body : null
    }
}

function getProductList() {
    const endpoint = `${baseEndpoint}/products/`
    const options = getFetchOptions()
    fetch(endpoint, options).then(response => {
        console.log(response)
        return response.json()
    }).then(data => {
        const valid = isInvalidToken(data)
        if (valid) writeToContent(data)
    })
}
validateJWTToken()
// getProductList()