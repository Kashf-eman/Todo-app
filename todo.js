document.addEventListener('DOMContentLoaded', function () {
    const todoList = document.getElementById('todo');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const search = document.getElementById('search');
    const input = document.getElementById('inp');
    const addButton = document.getElementById('addtodo');
    const alertbox = document.getElementById("alert");
    let close = document.getElementById("closebtn");

    const msgtext = document.getElementById("msgtext");
    const loader = document.getElementById("loader");
    const btnText = document.getElementById("btn-text");
    function headname() {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            const firstName = (userData.firstName || '').toUpperCase();
            const lastName = (userData.lastName || '').toUpperCase();
            var headname = document.getElementById("headingname");
            headname.innerHTML = `HI! ${firstName} ${lastName}`;
        }
    }
    close.addEventListener("click", function () {
        alertbox.style.top = "-100px";
    });
    headname();
    let currentPage = 1;
    const limit = 10;
    let isUpdating = false;
    let selectedTodoId = null;

   
    function fetchTodos(page = 1, searchQuery = '') {
        const url = `https://todo-backend-apis.vercel.app/api/todo?limit=${limit}&page=${page}${searchQuery ? '&search=' + searchQuery : ''}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNiNTM5ZjlhMzVhYzgyODcyMDQ5MTMiLCJpYXQiOjE3NDA0MDUzNTAsImV4cCI6MTc0MDQ5MTc1MH0.uY60Ho1U4Uva2eyBDv_4TRb0HBlLPpx10BPybbHZBqA',
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(apiResponse => {
            const data = apiResponse.data;
            todoList.innerHTML = ''; 
            if (data.length > 0) {
                data.forEach(todo => {
                    const li = document.createElement('li');
                    const p = document.createElement('p');
                    p.innerHTML = todo.todo;
                    li.appendChild(p);
                    todoList.appendChild(li);

                    const btn = document.createElement('div');
                    btn.className = 'btn';
                    li.appendChild(btn);

                    const check = document.createElement("input");
                    check.type = "checkbox";
                    check.className = "checkbox";
                    btn.appendChild(check);

                    check.addEventListener("click", function () {
                        if (check.checked) {
                            p.style.color = "red";
                            p.style.textDecoration = "line-through";
                        } else {
                            p.style.color = "";
                            p.style.textDecoration = "";
                        }
                    });

                 
                    const editbtn = document.createElement("button");
                    editbtn.className = "fa-solid fa-pen editbtn";
                    btn.appendChild(editbtn);
                    editbtn.addEventListener("click", function () {
                        input.value = p.innerHTML;
                        addButton.innerHTML = "Update";
                        isUpdating = true;
                        selectedTodoId = todo._id;
                    });

                
                    const delbtn = document.createElement("button");
                    delbtn.className = "fa-solid fa-trash delbtn";
                    btn.appendChild(delbtn);
                    delbtn.addEventListener("click", function () {
                        deleteTodo(todo._id, li);
                    });
                });

          
                prevPageButton.style.display = page > 1 ? 'inline-block' : 'none';
                nextPageButton.style.display = data.length === limit ? 'inline-block' : 'none';
            } else {
                const li = document.createElement('li');
                const p = document.createElement('p');
                p.innerHTML = 'No todos found.';
                li.appendChild(p);
                todoList.appendChild(li);
                prevPageButton.style.display = 'none';
                nextPageButton.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching todos:', error));
    }

  
    addButton.addEventListener('click', function () {
        const todoText = input.value;
        if (!todoText) {
            alert("Please enter a todo.");
            return;
        }

        const todoData = { todo: todoText };
        loader.style.display = 'block';
        btnText.style.display = "none";

        if (isUpdating) {
            const updatedTodo = { id: selectedTodoId, todo: todoText };

            fetch("https://todo-backend-apis.vercel.app/api/todo", {
                method: "PUT",
                headers: {
                    'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNiNTM5ZjlhMzVhYzgyODcyMDQ5MTMiLCJpYXQiOjE3NDA0MDUzNTAsImV4cCI6MTc0MDQ5MTc1MH0.uY60Ho1U4Uva2eyBDv_4TRb0HBlLPpx10BPybbHZBqA',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTodo),
            })
            .then(response => response.json())
            .then(data => {
                fetchTodos(currentPage);
                alertbox.style.top = "60px";
                msgtext.innerHTML = "Updated data successful!";
                resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while updating the todo.");
            });
        } else {
            fetch("https://todo-backend-apis.vercel.app/api/todo", {
                method: "POST",
                headers: {
                    'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNiNTM5ZjlhMzVhYzgyODcyMDQ5MTMiLCJpYXQiOjE3NDA0MDUzNTAsImV4cCI6MTc0MDQ5MTc1MH0.uY60Ho1U4Uva2eyBDv_4TRb0HBlLPpx10BPybbHZBqA',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData),
            })
            .then(response => response.json())
            .then(data => {
                fetchTodos(currentPage);
                alertbox.style.top = "60px";
                msgtext.innerHTML = "Added data successful!";
                resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while adding the todo.");
            });
        }
    });


    function resetForm() {
        input.value = "";
        loader.style.display = "none";
        btnText.style.display = "block";
        isUpdating = false;
        selectedTodoId = null;
        addButton.innerHTML = "Add Todo";
   
    }

    
    function deleteTodo(id, li) {
        fetch(`https://todo-backend-apis.vercel.app/api/todo/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNiNTM5ZjlhMzVhYzgyODcyMDQ5MTMiLCJpYXQiOjE3NDA0MDUzNTAsImV4cCI6MTc0MDQ5MTc1MH0.uY60Ho1U4Uva2eyBDv_4TRb0HBlLPpx10BPybbHZBqA',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            li.remove();
            alertbox.style.top = "60px";
            msgtext.innerHTML = "Deleted data successful!";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while deleting the todo.");
        });
    }

  
    search.addEventListener('input', function () {
        currentPage = 1;  
        fetchTodos(currentPage, search.value);
    });


    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            fetchTodos(currentPage, search.value);
        }
    });

    nextPageButton.addEventListener('click', function () {
        currentPage++;
        fetchTodos(currentPage, search.value);
    });


    fetchTodos(currentPage);
});