document.addEventListener("DOMContentLoaded", () => {
    const todoTableBody = document.getElementById("todoTableBody");
    const pagination = document.getElementById("pagination");
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("searchBtn");
    const completedFilter = document.getElementById("completedFilter");
    const userIdFilter = document.getElementById("userIdFilter");
    const resetFilters = document.getElementById("resetFilters");
  
    const API_URL = "https://jsonplaceholder.typicode.com/todos";
    let todos = [];
    let filteredTodos = [];
    let currentPage = 1;
    const todosPerPage = 5;

    //Fetcho i "todos/gli elementi del json che mi avete fornito" e popolo userIdFilter
    const fetchTodos = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        todos = data;
        populateUserIdFilter();
        applyFilters();
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
  
    // Popolo il filtro del dropdown User ID
    const populateUserIdFilter = () => {
      const uniqueUserIds = [...new Set(todos.map(todo => todo.userId))];
      userIdFilter.innerHTML = "<option value=''>All Users</option>";
      uniqueUserIds.forEach(userId => {
        const option = document.createElement("option");
        option.value = userId;
        option.textContent = userId;
        userIdFilter.appendChild(option);
      });
    };
  
    // Renderizzo i "todos/elementi del json" nella tabella
    const renderTodos = (todosToRender) => {
      todoTableBody.innerHTML = "";
      const start = (currentPage - 1) * todosPerPage;
      const end = start + todosPerPage;
      const todosForPage = todosToRender.slice(start, end);
  
      todosForPage.forEach(todo => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${todo.userId}</td>
          <td>${todo.title}</td>
          <td>${todo.completed ? '<span style="color: green;">&#10003;</span>' : '<span style="color: red;">&#10007;</span>'}</td>
        `;
        todoTableBody.appendChild(row);
      });
      renderPagination(todosToRender.length);
    };
  
    //Renderizzo i bottoni per la paginazione
    const renderPagination = (totalTodos) => {
      pagination.innerHTML = "";
      const totalPages = Math.ceil(totalTodos / todosPerPage);
  
      for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        if (i === currentPage) pageItem.classList.add("active");
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = i;
          renderTodos(filteredTodos);
        });
        pagination.appendChild(pageItem);
      }
    };
  
    //Applico i filtri, come da richiesta
    const applyFilters = () => {
      const searchText = searchInput.value.toLowerCase();
      const isCompleted = completedFilter.checked;
      const selectedUserId = userIdFilter.value;
  
      filteredTodos = todos.filter(todo => {
        const matchesSearch = searchText === "" || todo.title.toLowerCase().includes(searchText);
        const matchesCompleted = !isCompleted || todo.completed;
        const matchesUserId = selectedUserId === "" || todo.userId === parseInt(selectedUserId);
        return matchesSearch && matchesCompleted && matchesUserId;
      });
  
      currentPage = 1; // Resetta alla prima pagina dopo i filtri
      renderTodos(filteredTodos);
    };
  
    // Aggiungo gli event listeners per i filtri e il reset
    searchBtn.addEventListener("click", () => applyFilters());
    completedFilter.addEventListener("change", () => applyFilters());
    userIdFilter.addEventListener("change", () => applyFilters());
  
    resetFilters.addEventListener("click", () => {
      searchInput.value = "";
      completedFilter.checked = false;
      userIdFilter.value = "";
      applyFilters();
    });
  
   //Fetcho al caricamento
    fetchTodos();
  });
  