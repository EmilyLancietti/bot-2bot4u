module.exports = function (res, data, statusCode) {
    statusCode = parseInt(statusCode, 10);
    var status = "";

    switch (statusCode) {
        case 200:
            status = "OK";
            break;
        case 201:
            status = "Created";
            break;
        case 301:
            status = "Moved Permanently";
            break;
        case 302:
            status = "Found";
            break;
        case 304:
            status = "Not Modified";
            break;
        case 307:
            status = "Temporary Redirect";
            break;
        case 400:
            status = "Bad Request";
            break;
        case 401:
            status = "Unauthorized";
            break;
        case 403:
            status = "Forbidden";
            break;
        case 404:
            status = "Not Found";
            break;
        case 405:
            status = "Method Not Allowed";
            break;
        case 500:
            // Utilizzato in caso di errore nelle query al database
            status = "Internal Server Error";
            break;
        default:
            throw Error("Invalid status code");
    }

    res.status(statusCode).send({
        data: data,
        status: status,
        code: statusCode
    });
};
