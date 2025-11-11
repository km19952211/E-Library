document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault(); 

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost/E-Library/php/users/register.php", {
      method: "POST",
      body: formData
    });

    const result = await response.text(); 

    window.alert("Server Response:"+ result);
   
  } catch (error) {
     window.alert("Error:" + error);
  }
});

