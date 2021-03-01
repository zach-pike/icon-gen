const Jimp = require("jimp")

//sine freq and amplitude and thickness
const bannerFreq = 60
const bannerAmp = 600
const bannerThickness = 20;
const bannerText = "Zachary Pike"
const bannerSize = [2560, 1440]

//icon stuff
const iconFreq = 20;
const iconAmp = 150;
const iconThickness = 10;
const iconText = ""

//colors
const backgroundColor = "#404040"
const foregroundColor = "#00aaff"

//output folder
const outFolder = "out"

console.log("Started");

var then;

(async () => {
    then = Date.now()
    //load font
    var font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

    //make local vars
    let _amp = bannerAmp;
    let _thickness = bannerThickness;

    new Jimp(bannerSize[0], bannerSize[1], Jimp.cssColorToHex(backgroundColor), (err, image) => {
        if (err) throw err;
        
        for (let x=0; x < image.bitmap.width; x++) {

            if (x % 5 == 0) {
                _amp--;
            }

            for (let y=0; y < image.bitmap.height; y++) {
    
                //if y is equal to the sine draw pixel
                if (y == Math.floor((Math.sin(x/bannerFreq)*_amp) + image.bitmap.height/2)) {
    
                    //adds thickness
                    for (let t=-1*_thickness; t < _thickness; t++) {
                        image.setPixelColor(Jimp.cssColorToHex(foregroundColor), x, y+t)
                    }
                }
            }
        }

        //puts the initials on the image
        image.print(font, 0, 0, { text: bannerText, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, image.bitmap.width, image.bitmap.height)
        
        //save file
        image.write(outFolder + "/banner.png")
    })
})();

(async ()=> {
    var mask = await Jimp.read(__dirname + "/mask.png")
    var font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

    let _amp = iconAmp;
    let _thickness = iconThickness

    new Jimp(512, 512, Jimp.cssColorToHex(backgroundColor), (err, image) => {
        if (err) throw err;

        for (let x=0; x < image.bitmap.width; x++) {
            
            for(let y=0; y < image.bitmap.height; y++) {

                //if y is exual to the sine draw pixel
                if (y == Math.floor((Math.sin(x/iconFreq)*_amp) + image.bitmap.height/2)) {
    
                    //adds thickness
                    for (let t=-1*_thickness; t < _thickness; t++) {
                        image.setPixelColor(Jimp.cssColorToHex(foregroundColor), x, y+t)
                    }
                }

            }
        }

        image.mask(mask, 0, 0)

        //puts the initials on the image
        image.print(font, 0, 0, { text: iconText, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, image.bitmap.width, image.bitmap.height)

        image.write(outFolder + "/icon.png")
        console.log(`Done!, files wrote to ${outFolder} in ${Date.now() - then}ms!`);
    })
})();