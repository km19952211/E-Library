onpageshow = () => {const loginForm = document.getElementById("loginForm");
window.alert("loginForm");
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault(); 
   
  const formData = new FormData(e.target);

  try {
    const response = await fetch("php/users/login.php", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ " + result.message);
    } else {
      alert("❌ " + result.message);
    }

  } catch (error) 
  {
    alert("خطأ في الاتصال بالسيرفر"); 
  }
});

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault(); 

  const formData = new FormData(e.target);

  try {
    const response = await fetch("register.php", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ " + result.message);
    } else {
      alert("❌ " + result.message);
    }

  } catch (error) {
    alert("خطأ في الاتصال بالسيرفر"); 
  }
}) 
};


