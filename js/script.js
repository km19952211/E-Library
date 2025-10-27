onpageshow = () => {
  const obj = document.getElementById("Library");
  
  

  console.log("🚀 Fetch بدأ الآن");

  fetch("http://localhost/E-Library/php/test.php", { method: "GET" })
    .then(response => {
      console.log("✅ الرد من السيرفر:", response.status);
      return response.text();
    })
    .then(data => {
      console.log("📦 محتوى الرد:", data);
      window.alert("الرد من السيرفر: " + data);
    })
    .catch(error => {
      console.error("❌ صار خطأ:", error);
      window.alert("Fetch error: " + error);
    });
};


