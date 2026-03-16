async function loadData() {
  const response = await fetch("results.json");
  return await response.json();
}

async function loadSlideList() {
  const data = await loadData();
  const slideList = document.getElementById("slide-list");

  if (!slideList) return;

  data.forEach((item, index) => {
    const slideNumber = index + 1;

    const link = document.createElement("a");
    link.href = `/viewer.html?index=${index}`;
    link.className = "slide-link";
    link.textContent = `slide${slideNumber}`;

    slideList.appendChild(link);
  });
}

async function loadSlideDetail() {
  const slideImage = document.getElementById("slide-image");
  if (!slideImage) return;

  const data = await loadData();

  const params = new URLSearchParams(window.location.search);
  const index = Number(params.get("index"));

  if (isNaN(index) || index < 0 || index >= data.length) {
    alert("잘못된 슬라이드 접근입니다.");
    window.location.href = "/index.html";
    return;
  }

  const item = data[index];
  const result = item.result;

  const slidePosition = document.getElementById("slide-position");
  const termsList = document.getElementById("terms-list");
  const explanation = document.getElementById("explanation");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  slidePosition.textContent = `${index + 1} / ${data.length}`;
  slideImage.src = `slides/${item.file_name}`;
  slideImage.alt = item.file_name;

  termsList.innerHTML = "";

  if (result.terms.length === 0) {
    const emptyText = document.createElement("div");
    emptyText.className = "empty-text";
    emptyText.textContent = "표시할 핵심 용어가 없습니다.";
    termsList.appendChild(emptyText);
  } else {
    result.terms.forEach((term) => {
      const termItem = document.createElement("div");
      termItem.className = "term-item";

      const english = document.createElement("div");
      english.className = "term-english";
      english.textContent = term.english;

      const korean = document.createElement("div");
      korean.className = "term-korean";
      korean.textContent = term.korean;

      termItem.appendChild(english);
      termItem.appendChild(korean);
      termsList.appendChild(termItem);
    });
  }

  explanation.textContent = result.explanation;

  if (index > 0) {
    prevButton.href = `/viewer.html?index=${index - 1}`;
    prevButton.classList.remove("disabled");
  } else {
    prevButton.removeAttribute("href");
    prevButton.classList.add("disabled");
  }

  if (index < data.length - 1) {
    nextButton.href = `/viewer.html?index=${index + 1}`;
    nextButton.classList.remove("disabled");
  } else {
    nextButton.removeAttribute("href");
    nextButton.classList.add("disabled");
  }
}

loadSlideList();
loadSlideDetail();