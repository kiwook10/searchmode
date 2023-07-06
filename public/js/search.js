
const searchForm = document.querySelector("#searchForm");
const inputText = document.querySelector("#inputText");
const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click",(e)=>{
    let data = inputText.value; // 검색한 입력값 data변수에 담음

    // trim() ---> 입력값 앞뒤 빈공백문자를 제거시키는 함수
    let result = data.trim();

    if(result === ""){
        // 입력값이 없으면 넘어가지 않게
        e.preventDefault();
    } else {
        // 입력값이 있으면 넘어가게 하고 /search
        searchForm.submit(); // 전송버튼 누르는 역할
    }
})
