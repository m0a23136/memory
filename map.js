// 東京工科大学 八王子キャンパスの座標
const universityLocation = [35.62525, 139.3444167];

const mapPhotoList = document.getElementById("mapPhotoList");

let map = null;
let campusMarker = null;

// マップの表示
function renderMap() {

  // マップを初めて表示するときだけ初期化
  if (!map) {

    map = L.map("map").setView(universityLocation, 16);

    // OpenStreetMapの地図画像を表示
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 大学のマーカーを設置
    campusMarker = L.marker(universityLocation).addTo(map);
  }

  // マップの表示サイズを調整
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  // 保存されている写真を取得
  const photos = getPhotos().filter(
    photo => photo.locationId === "classroom"
  );

  // マーカーの表示内容を更新
  campusMarker
    .bindPopup(`東京工科大学 八王子キャンパス<br>写真：${photos.length}枚`);

  // 写真一覧を表示
  showMapPhotos(photos);
}

// 写真一覧
function showMapPhotos(photos) {

  mapPhotoList.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "この場所で撮影した写真";
  mapPhotoList.appendChild(heading);

  if (photos.length === 0) {
    const message = document.createElement("p");
    message.textContent = "まだ思い出がありません";
    mapPhotoList.appendChild(message);
    return;
  }

  photos.forEach(photo => {

    const item = document.createElement("div");
    item.className = "map-photo-item";

    const image = document.createElement("img");
    image.src = photo.image;
    image.alt = "撮影した写真";

    const memo = document.createElement("p");
    memo.textContent = photo.memo || "メモなし";

    const date = document.createElement("small");
    date.textContent = photo.date;

    item.appendChild(image);
    item.appendChild(memo);
    item.appendChild(date);

    mapPhotoList.appendChild(item);
  });
}

// マーカーを押したときに写真一覧へ移動