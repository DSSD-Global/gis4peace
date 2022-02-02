var package_path = location.href.slice(0, location.href.lastIndexOf("/"));
var dojoConfig = {
    parseOnLoad: true,
    async: true,
    baseURL: package_path,
    packages: [
        {
            name: "application",
            location: package_path + "/js",
        },
        {
            name: "widgets",
            location: package_path + "/js/widgets",
        },
    ],
};