function getCookie(nametofind) {
    const cookies = document.cookie.split('; ');
    let cookievalue;
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (nametofind === name) {
            cookievalue = value;
        }
    });
    return cookievalue;
}
function clearCookie(cookiename) {
    console.log(cookiename + "=;" + " path=/; domain=" + window.location.hostname);
    document.cookie = cookiename + "=;" + " path=/; domain=" + window.location.hostname;
}