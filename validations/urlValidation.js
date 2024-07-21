import dns from "dns"

function isExternalUrl(url) {
    const internalIps = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|192\.168\.)/;
    try {
        const hostname = new URL(url).hostname;
        return !internalIps.test(hostname);
    } catch (err) {
        return false;
    }
}

async function resolveHostname(url) {
    return new Promise((resolve, reject) => {
        dns.lookup(new URL(url).hostname, (err, address) => {
            if (err) reject(err);
            resolve(address);
        });
    });
}

export default {isExternalUrl, resolveHostname}