const cameraPage = document.getElementById("cameraPage");
const albumPage = document.getElementById("albumPage");
const mapPage = document.getElementById("mapPage");

const openAlbum = document.getElementById("openAlbum");
const backCamera = document.getElementById("backCamera");
const openMap = document.getElementById("openMap");
const backCameraFromMap = document.getElementById("backCameraFromMap");

const shutterSound = new Audio("shutter.mp3");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const switchCameraBtn = document.getElementById("switchCameraBtn");

let currentCamera = "environment";
let currentStream = null;

// カメラ起動
async function startCamera() {
  try {
    // 既存カメラ停止
    if (currentStream) {
      currentStream.getTracks().forEach(track => {
        track.stop();
      });
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: currentCamera
      },
      audio: false
    });

    currentStream = stream;
    video.srcObject = stream;

  } catch (error) {
    alert("カメラにアクセスできません");
    console.error(error);
  }
}

// カメラ切替
switchCameraBtn.addEventListener("click", () => {
  if (currentCamera === "environment") {
    currentCamera = "user";
  } else {
    currentCamera = "environment";
  }

  startCamera();
});

// 撮影
captureBtn.addEventListener("click", () => {

  // カメラの準備確認
  if (!video.videoWidth || !video.videoHeight) {
    alert("カメラの準備ができていません");
    return;
  }

  const context = canvas.getContext("2d");

  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  context.drawImage(video, 0, 0, width, height);

  shutterSound.currentTime = 0;
  shutterSound.play();

  // JPEG形式
  const imageData = canvas.toDataURL("image/jpeg", 0.5);

  // メモ入力
  const memo = prompt("この写真の思い出を入力してください");

  // キャンセルされた場合
  if (memo === null) {
    return;
  }

  // タグ
  const tags = [];

  // 保存するデータ
  const newPhoto = {
    id: Date.now(),
    image: imageData,
    tags: tags,
    memo: memo,
    date: new Date().toLocaleString("ja-JP"),

    // 撮影場所（今回は教室に固定）
    locationId: "classroom"
  };

  const photos = getPhotos();
  photos.push(newPhoto);
  savePhotos(photos);

  alert("保存しました");

});

// アルバムを開く
openAlbum.addEventListener("click", () => {
  cameraPage.style.display = "none";
  albumPage.style.display = "block";

  renderPhotos();
});

// カメラに戻る
backCamera.addEventListener("click", () => {
  albumPage.style.display = "none";
  cameraPage.style.display = "block";
});

// マップを開く
openMap.addEventListener("click", () => {
  cameraPage.style.display = "none";
  mapPage.style.display = "block";

  renderMap();
});

// マップからカメラに戻る
backCameraFromMap.addEventListener("click", () => {
  mapPage.style.display = "none";
  cameraPage.style.display = "block";
});

// 初期化
startCamera();