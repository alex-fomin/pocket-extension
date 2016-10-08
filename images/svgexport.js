function flatten(array) {
    return array.reduce(function (a, b) {
        return a.concat(b);
    }, []);
}
var images = {
    added: {
        x: 20,
        y: 20,
        width: 40
    },
    notAdded: {
        x: 80,
        y: 20,
        width: 40
    },
    random: {
        x: 140,
        y: 20,
        width: 40
    }
};

function generate(prefix, name, width, padding) {
    var image = images[name];
    var realX = image.x - padding;
    var realY = image.y - padding;

    var realWidth = image.width + padding * 2;

    return `${prefix}/${name}-${width}.png ${realX}:${realY}:${realWidth}:${realWidth} ${width}:`;
}
module.exports = [
    {
        "input": "icons.svg",
        "output": [
            generate("safari", "random", 40, 5),
            generate("safari", "added", 40, 5),
            generate("safari", "notAdded", 40, 5),
        ]
    }
];