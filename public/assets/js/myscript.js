function loadCamera() {
  if (document.getElementById("mycamera")) {
    Webcam.set({
      width: 320,
      height: 240,
      image_type: "jpeg",
      jpeg_quality: 90,
    });
    Webcam.attach("#mycamera");
    open_modal("picture-modal");
  }
}
function take_picture() {
  Webcam.snap(function (data_uri) {
    document.getElementById("mypicture").innerHTML =
      "<img id='imageprev' src='" + data_uri + "'>";
    document.getElementById("picname").innerHTML =
      document.getElementById("name").value;
  });
}
//
function save_picture() {
  var image = document.getElementById("imageprev").src;
  var imagename = document.getElementById("name").value;
  Webcam.upload(
    image,
    "upload?name=" + imagename + ".jpg",
    function (code, text) {
      alert("image saved!!!");
    }
  );
}

function close_modal(id) {
  document.getElementById(id).style.display = "none";
}

function open_modal(id) {
  document.getElementById(id).style.display = "block";
}
