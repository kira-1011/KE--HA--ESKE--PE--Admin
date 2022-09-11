// get the image name from the url query and set src of the image the query
let image_container = document.getElementsByClassName("image_container")[0];
let image = document.getElementsByClassName("image")[0];
image.src = window.location.href.substring(48);