const adminAuth = (req, resp, next) => {
    const token = "abc"; // Example token, replace with actual logic
    //req.headers.authorization = "abc11"
    if (req.headers.authorization === token) {
        next();
    } else {
        resp.status(403).send({ error: "Unauthorized access" });
    }
};

const userAuth = (req, resp, next) => {
    const token = "xyz"; // Example token, replace with actual logic
    if (req.headers.authorization === token) {
        next();
    } else {
        resp.status(403).send({ error: "Unauthorized access" });
    }
};  

module.exports = { adminAuth , userAuth};