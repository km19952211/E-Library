document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const noBooksBox = document.getElementById("noBooks");
    const table = document.getElementById("historyTable");
    const tbody = document.getElementById("historyBody");

    // إذا ما فيه تسجيل دخول
    if (!token) {
        noBooksBox.style.display = "block";
        return;
    }

    // تحقق من التوكن → نجيب user_id
    const verify = await fetch("php/checkToken.php", {
        headers: { "Authorization": token }
    });

    const verifyData = await verify.json();

    if (!verifyData.status) {
        noBooksBox.style.display = "block";
        alert(verifyData.status);
        return;
    }

    const userId = verifyData.data.id;

    // جلب الكتب المستعارة
   
    const res = await fetch(`php/books/borrowHistory.php?user_id=${userId}`);
 
    const data = await res.json(); 
    

    if (!data.status || data.data.length === 0) {
        noBooksBox.style.display = "block";
       
        return;
    }
    
    // عرض السجلات
    table.style.display = "table";

    data.data.forEach(book => {
        const isBorrowed = book.status === "Borrowed";

        const row = `
            <tr>
                <td>${book.title}</td>
                <td>${book.borrow_date}</td>
                <td>${book.return_date ?? "-"}</td>
                <td>${book.status}</td>
                <td>
                    ${isBorrowed
                        ? `<button class="btn return-btn" data-id="${book.history_id}">Return</button>`
                        : `<button class="btn" disabled style="opacity:.5;cursor:not-allowed;">Return</button>`
                    }
                </td>
            </tr>
        `;

        tbody.insertAdjacentHTML("beforeend", row);
    });

});


// ========== زر الإرجاع ==========
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("return-btn")) return;

    const historyId = e.target.dataset.id;
    const token = localStorage.getItem("token");

    if (!historyId || !token) return;

    const res = await fetch("php/books/return.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ history_id: historyId })
    });

    const data = await res.json();

    if (data.success) {
        alert("Book returned successfully!");
        location.reload();
    } else {
        alert(data.message);
    }
});
