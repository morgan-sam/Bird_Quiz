export const addImageToDocument = birdPhotoURL => {
    // console.log(birdPhotoURL);
    var img = document.createElement("img");
    img.src = birdPhotoURL;
    document.body.appendChild(img);
};