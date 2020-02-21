# QuickCrop

This project uses [cropperjs](https://github.com/fengyuanchen/cropperjs) and some small PHP to allow the user to quickly crop an image in a 4:3 ratio and save it to the web server.

## Screenshot
![screenshot](https://raw.githubusercontent.com/vwinslow/QuickCrop/master/screenshots/example.png)

## Local Setup 
Here is a process used for setting up a local development environment.

1. Clone / Download this repo
```
git clone https://github.com/camgaertner/QuickCrop.git
```
Or you can click `download ZIP` (green button top right)

2. Make sure you have Node.js and npm [installed](https://www.npmjs.com/get-npm)

3. Switch to the directory where you have cloned / extracted QuickCrop, and install the required packages.
```
cd QuickCrop;
npm install
```
If you have problems, try to install the package needed manually, we only use a few.
```
npm install jquery-cropper jquery cropperjs
```
4. Install [XAMPP](https://sourceforge.net/projects/xampp/)
5. Open XAMPP and start Apache Webserver. 
6. Copy your QuickCrop folder (with installed `node_modules`) to your `htdocs` location.

On Linux (and probably Mac OS X) it is `/opt/lampp/htdocs`

On Windows it seems to be `C:/xampp/htdoc`

## Calling the app
QuickCrop expects to be called with an image URL and filename. These query parameters are 

`imageUrl` - the URL of the image to crop from

`fileName` - the name the cropped image should eventually be saved as.


Example:
```
http://localhost/QuickCrop/?imageUrl=http://localhost:80/QuickCrop/example.jpg?fileName=example.jpg
```

Here we are passing in an 
`imageUrl` of `http://localhost:80/QuickCrop/example.jpg` and a
`fileName` of `example.jpg`

## Saving files
Once the user clicks `Get Cropped Canvas`, they are given with a preview that they can choose to save to the server.

By default, this image is saved in `supp/fileName` directory, where `fileName` is the originally passed `fileName` from above.


## Local Setup 
Here is a process used for setting up a local development environment.

1. Clone / Download this repo
```
git clone https://github.com/camgaertner/QuickCrop.git
```
Or you can click `download ZIP` (green button top right)
2. Make sure you have Node.js and npm [installed](https://www.npmjs.com/get-npm)
3. Switch to the directory where you have cloned / extracted QuickCrop, and install the required packages.
```
cd QuickCrop;
npm install
```
If you have problems, try to install the package needed manually, we only use a few.
```
npm install jquery-cropper jquery cropperjs
```
4. Install [XAMPP](https://sourceforge.net/projects/xampp/)
5. Open XAMPP and start Apache Webserver. 
6. Copy your QuickCrop folder (with installed `node_modules`) to your `htdocs` location.
On Linux (and probably Mac OS X) it is `/opt/lampp/htdocs`
On Windows it seems to be `C:/xampp/htdoc`

## Additional Information
* Query parameters are case sensitive.
* The fileName should include the image extension
* Supported image extensions are currently `jpg`, `jpeg`, `png`
   * Adding additional image extension support should be trivial
* Ensure only trusted users have access to QuickCrop, because it allows arbitrary data to be written to the webserver
   * The only validation done is to not allow path traversal via specifying `../` in the `fileName` query paramter


## Problems / Contributing
If there are any problems, please open an issue. However, the use case of this app is very specialized and not likely to change.

To contribute, open a PR, and I'll merge it if it improves the state of the project.
