document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const successDiv = document.getElementById("loginSuccessScreen");

    // ================= CHECK TOKEN =================
    if (token) {
        try {
            const response = await fetch("php/checkToken.php", {
                headers: { "Authorization": token }
            });

            const raw = await response.text();
            console.log("RAW CHECKTOKEN RESPONSE:", raw);

            let result;
            try {
                result = JSON.parse(raw);
            } catch {
                alert("❌ checkToken.php لم يرجّع JSON:\n\n" + raw);
                return;
            }

            if (response.ok) {

                document.querySelector(".form-section").style.display = "none";

                successDiv.innerHTML = `
                    <h2 style="color:#3a2e27; margin-bottom:15px;">
                        👋 Hello, ${result.data.name}
                    </h2>

                    <p style="color:#5a4a42; font-size:1.1em; margin-bottom:25px;">
                        You are already logged in.
                    </p>

                    <a href="search.html" class="btn">Start Searching</a>

                    <br><br>

                    <button id="logoutBtnNew" class="btn secondary" style="margin-top:15px;">
                        Logout
                    </button>
                `;

                successDiv.style.display = "block";

                // attach logout
                attachLogoutButton();

                return;
            }

        } catch (err) {
            console.log("CHECKTOKEN ERROR:", err);
        }
    }

    // ================= LOGIN FORM ==================

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
            const response = await fetch("php/users/login.php", {
                method: "POST",
                body: formData
            });

            const raw = await response.text();
            console.log("RAW LOGIN RESPONSE:", raw);

            let result;
            try {
                result = JSON.parse(raw);
            } catch {
                alert("❌ login.php لم يرجّع JSON:\n\n" + raw);
                return;
            }

            if (response.ok) {

                localStorage.setItem("token", result.data.token);

                document.body.innerHTML = `
                    <div style="text-align:center; padding:40px;">
                        <h2 style="color:#3a2e27; margin-bottom:15px;">🎉 Login Successful!</h2>

                        <p style="color:#5a4a42; font-size:1.1em; margin-bottom:25px;">
                            Welcome back! You can now explore our library.
                        </p>

                        <a href="search.html" class="btn">Start Searching</a>

                        <br><br>

                        <button id="logoutBtnNew" class="btn secondary" style="margin-top:20px;">
                            Logout
                        </button>
                    </div>
                `;

                attachLogoutButton();
            } 
            else {

                const msg = document.getElementById("loginErrorMsg");
                msg.textContent = result.message;
                msg.style.display = "block";

                setTimeout(() => msg.style.display = "none", 4000);
            }

        } catch (error) {
            alert("❌ Server Connection Error (login)");
        }
    });


    // ================= REGISTER FORM ==================

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
            const response = await fetch("php/users/register.php", {
                method: "POST",
                body: formData
            });

            const raw = await response.text();
            console.log("RAW REGISTER RESPONSE:", raw);

            let result;
            try {
                result = JSON.parse(raw);
            } catch {
                alert("❌ register.php لم يرجّع JSON:\n\n" + raw);
                return;
            }

            if (response.ok) {

                const msg = document.getElementById("registerSuccessMsg");
                msg.classList.remove("error-message");
                msg.classList.add("success-message");

                msg.textContent = "✔️ " + result.message;
                msg.style.display = "block";

                setTimeout(() => msg.style.display = "none", 3000);

            } else {

                const msg = document.getElementById("registerSuccessMsg");

                msg.classList.remove("success-message");
                msg.classList.add("error-message");

                msg.textContent = result.message;
                msg.style.display = "block";

                setTimeout(() => msg.style.display = "none", 4000);
            }

        } catch (error) {
            alert("❌ Server Connection Error (register)");
        }
    });


    // ================= LOGOUT FUNCTION ==================

    function attachLogoutButton() {
        const btn = document.getElementById("logoutBtnNew");
        if (!btn) return;

        btn.addEventListener("click", async () => {

            const token = localStorage.getItem("token");

            if (token) {
                await fetch("php/logout.php", {
                    method: "POST",
                    headers: { "Authorization": token }
                });
            }

            localStorage.removeItem("token");

            window.location.href = "login.html";
        });
    }

});
