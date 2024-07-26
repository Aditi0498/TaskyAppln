//console.log("Hello Aditii")

// const state ={
//     tasklist: [
//         {  image:" ",
//             title: " ",
//             type: " ",
//             description:" "
//          },

//          {  image:" ",
//             title: " ",
//             type: " ",
//             description:" "
//          },

//          {  image:" ",
//             title: " ",
//             type: " ",
//             description:" "
//          },

//          {  image:" ",
//             title: " ",
//             type: " ",
//             description:" "
//          }
        
//         ]
// }


const state = {
    taskList: [],
};

//DOM 
const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");


// console.log(taskContents);
// console.log(taskModal);


// for creating card
const htmlTaskContent = ({ id, title, description, type, url }) => `
          
   <div class="col-md-6 col-lg-4 mt-3" id=${id} key= ${id}>
          <div class= "card shadow-sm task__card">
       <div class= "card-header d-flex justify-content-end task__card__header">
            <button type="button" class="btn btn-outline-primary mr-2" name=${id} onclick="editTask.apply(this, arguments)">
               <i class="fas fa-pencil-alt" name= ${id}> </i>
            </button>
            <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask.apply(this, arguments)">
               <i class="fas fa-trash-alt" name ${id}> </i>
            </button>
       </div>
      <div class='card-body'>
        ${
          url
            ? `<img width='100%'  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            : `<img width='100%'  src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
        }
        <h4 class='task__card__title'>${title}</h4>
        <p class='description trim-3-lines text-muted'>
          ${description}
        </p>
        <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${type}</span>
        </div>
      </div>
      <div class='card-footer'>
        <button 
        type='button' 
        class='btn btn-outline-primary float-right' 
        data-bs-toggle='modal'
        data-bs-target='#showTask'
        id=${id} onclick='openTask.apply(this, arguments)'>
          Open Task
        </button>
      </div>
    </div>
  </div>
`;


// for creating modal contents
const htmlModalContent =({id,title,url,description}) => {
   const date = new Date(parseInt(id));
   return `
       <div id= ${id}> 
         ${
            url ?
             `<image width="100%" src=${url} alt="card-img-top" class="img-fluid place__holder__image md-3 rounded-lg"/> `:
             `<image width="100%" src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt="card-image-top" class="card-img-top md-3 rounded-lg"/> ` 
         }
         <strong>Created on ${date.toDateString()}</strong>
         <h2 class="my-3">${title}</h2>
         <p class="lead">${description}</p>
     </div>
   `
}

const updateLocalStorage = () =>{
    localStorage.setItem("task", JSON.stringify({
        tasks: state.taskList, 
    })
 );
};


// whatever data is in the array to make it visible on screen
 const loadInitialData = () =>{
    const localStorageCopy = JSON.parse(localStorage.task);

     if(localStorageCopy) state.taskList = localStorageCopy.tasks;

     state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate))

     });
 };



//  when click on save changes of +Add new item it should be present
 const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
      url: document.getElementById("imageUrl").value,
      title: document.getElementById("taskTitle").value,
      type: document.getElementById("tags").value,
      description: document.getElementById("taskDescription").value,
    };
    if (input.title === "" || input.type === "" || input.description === "") {
      return alert("Please fill all required field:-(");
    }
    taskContents.insertAdjacentHTML(
      "beforeend",
      htmlTaskContent({
        ...input,
        id,
      })
    );
  
    // updated task list - for 1st go
    state.taskList.push({ ...input, id });
  
    // update the same on localStorage too
    updateLocalStorage();
  };


  // to open the task
const openTask = (e) => {
  if(!e) e = window.event;

  const getTask = state.taskList.find(({id})=> id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
}


// to delete the task card
const deleteTask = (e) => {
  if(!e) e = window.event;
 
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  // console.log(type);

  const removeTask = state.taskList.filter(({ id })=> id!== targetId)
  console.log(removeTask);

  state.taskList = removeTask;
  updateLocalStorage();

if(type ==="BUTTON"){
  console.log(e.target.parentNode.parentNode.parentNode)
  return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode
  )
}
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    )
}


// to edit the task card
const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let tags;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  tags = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  // console.log(taskTitle);

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  tags.setAttribute("contenteditable", "true");

  // needs to be implemented
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};



// to save the edited changes
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const tags = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    tags: tags.innerHTML,
  };

  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetId
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          tags: updateData.tags,
          url: task.url,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  tags.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};


// to save the task card
const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};

