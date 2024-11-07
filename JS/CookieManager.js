export default class CookieManager {
    // Método para establecer la cookie con tiempo de expiración en segundos
    static setCookie(name, value, seconds) {
        
        document.cookie = name + "=" + JSON.stringify(value) + ";max-age=" + seconds + ";path=/";
    }

    
    static getCookie(name) {
        const nameEQ = name + "=";
        const cookiesArray = document.cookie.split(";");
        for (let cookie of cookiesArray) {
            while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);
            if (cookie.indexOf(nameEQ) === 0) return JSON.parse(cookie.substring(nameEQ.length, cookie.length));
        }
        return null;
    }


    static deleteCookie(name) {
        document.cookie = name + "=; Max-Age=0; path=/";
    }
}

