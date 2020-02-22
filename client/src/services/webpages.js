export function sendws(url) {
    // if ("WebSocket" in window) {
    //     const conn = new WebSocket(process.env.VUE_APP_VUE_WEBSOCKET_API);
    //     console.log('URL being sent: ', url);

    //     conn.onopen = function (e) {
    //         console.log('connection created');
    //         conn.send(JSON.stringify(url));
    //     }

    //     conn.onmessage = function (event) {
    //         console.log('Message received.');
    //         console.log(event);
    //         message = event.data;
    //         return message;
    //     }
    // } else {
    //     console.log('Browser does not support Web Socket')
    // }

    return new Promise(function(resolve, reject) {
        if ("WebSocket" in window) {
            const conn = new WebSocket(process.env.VUE_APP_VUE_WEBSOCKET_API);

            conn.onopen = function (e) {
                console.log('connection created');
                conn.send(JSON.stringify(url));
            }

            conn.onmessage = function (event) {
                console.log('Message received.');
                console.log(event.data);
                resolve(event);
            }

            conn.onclose = function() {
                console.log('Connection Closed');
            }

        } else {
            reject ('Browser does not support Web Socket')
        }
    })
}

