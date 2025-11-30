document.addEventListener("DOMContentLoaded", async () => {

    const tbody = document.getElementById("booksBody");
    const searchInput = document.querySelector(".search-form input");
    const searchForm = document.querySelector(".search-form");

    if (!searchInput || !searchForm || !tbody) {
        console.error("❌ Search elements not found in DOM!");
        return;
    }

    let allBooks = [];

    // ====== 1) Fetch all books ======
    const booksRes = await fetch("php/books/getBooks.php");
    const booksData = await booksRes.json();
    allBooks = booksData.data;

    // ====== Render function ======
    function renderBooks(books) {
        tbody.innerHTML = "";

        books.forEach(book => {
            const row = `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre}</td>
                    <td>${book.publish_year}</td>
                    <td>
                        <button class="btn borrow-btn" data-id="${book.id}">Borrow</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
        });
    }

    renderBooks(allBooks);

    // ====== 2) Search Logic ======
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = searchInput.value.trim().toLowerCase();

        const filtered = allBooks.filter(book =>
            (book.title ?? "").toLowerCase().includes(keyword) ||
            (book.author ?? "").toLowerCase().includes(keyword) ||
            (book.genre ?? "").toLowerCase().includes(keyword)
        );

        renderBooks(filtered);
    });

});


// ========== Borrow Button ==========
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("borrow-btn")) return;

    const bookId = e.target.dataset.id;
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const userRes = await fetch("php/checkToken.php", {
        headers: { "Authorization": token }
    });

    const userData = await userRes.json();
    if (!userData.status) {
        window.location.href = "login.html";
        return;
    }

    const userId = userData.data.id;

    const borrowedRes = await fetch(`php/books/getBorrowed.php?user_id=${userId}`);
    const borrowedData = await borrowedRes.json();

    if (borrowedData.data.includes(parseInt(bookId))) {
        alert("You already borrowed this book!");
        return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("book_id", bookId);

    const borrowRes = await fetch("php/books/borrow.php", {
        method: "POST",
        body: formData
    });

    const res = await borrowRes.json();

    if (res.status) {
        alert("📚 Book Borrowed Successfully!");
        window.location.href = "history.html";
    }
});
