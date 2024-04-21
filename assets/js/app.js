let cl= console.log;

const postsContainer = document.getElementById("postsContainer");
const postForm =document.getElementById("postForm");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

// fetch API HTML 5

const baseUrl = `https://jsonplaceholder.typicode.com`;

let postUrl = `${baseUrl}/posts`;
let postsArr = [];


const onEdit = (ele)=>{
    cl(ele)
    //edit Id we want at first
   let editId= ele.closest(".card").id;

   localStorage.setItem("editId", editId);
   //edit url 
   let editUrl = `${baseUrl}/posts/${editId}`;

   ////API CALL
   // create instance of xmlHttpRequest
    let xhr = new XMLHttpRequest();

    // xhr.open();
    xhr.open("GET", editUrl);

    //send
    xhr.send();

    //onload
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status<300 ){
            cl(xhr.response);
            let res = JSON.parse(xhr.response)
            title.value =res.title;
            body.value = res.body;
            userId.value = res.userId;
            updateBtn.classList.remove("d-none");
            submitBtn.classList.add("d-none");
        }
    }
    window.scrollTo(0,0);
}

const onDelete = (ele) => {
    Swal.fire({
        title: "Do you want to Remove this post ?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          //deleteId
        let deleteId = ele.closest(".card").id;
        cl(deleteId);

        //deleteUrl
        let deleteUrl = `${baseUrl}/posts/${deleteId}`;
        
        //API call
        
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", deleteUrl);
        xhr.send();
        xhr.onload=function(){
            if (xhr.status >= 200 && xhr.status <300){
                cl(xhr.response);
                ele.closest(".card").remove();
                Swal.fire("Post Removed Successfully !!!", "", "success");
             }
            }
        }
    });
}


const templating = (arr) => {
    postsContainer.innerHTML = arr.map(obj => {
        return ` 
        <div class="card mb-4" id="${obj.id}">
            <div class="card-header">
                <h3 class="m-0">
                    ${obj.title}
                </h3>
            </div>
            <div class="card-body">
                 <p class="m-0">
                    ${obj.body}
                 </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
                <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
            </div>
        </div>
        `
    }).join('')
}


// const templating = (arr) =>{
//     let result =``;
//     arr.forEach(obj => {
//         result+=`
//                 <div class="card mb-4" id="${obj.id}">
//                         <div class="card-header">
//                             <h3 class="m-0">
//                                 ${obj.title}
//                             </h3>
//                         </div>
//                         <div class="card-body">
//                             <p class="m-0">
//                                 ${obj.body}
//                             </p>
//                         </div>
//                         <div class="card-footer">
//                             <button class="btn btn-success onClick="onEdit(this)">Edit</button>
//                             <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
//                         </div>
//                  </div>`
//     });
//     postsContainer.innerHTML=result;
// }

//XHR >> XmlHttpRequest
// 1 create instance of xmlHttpRequest
let xhr = new XMLHttpRequest();

//2 configuration
// GET , POST, PATCH|PUT, DELETE

// xhr.open("GET", postUrl, true);
xhr.open("GET", postUrl);

//3 send
xhr.send()

//4 get responce
xhr.onload = function(){
    cl(xhr.status) // 200 success
    if(xhr.status === 200){
        cl(xhr.readyState)
        //API call success
        let postsArr = JSON.parse(xhr.response);
       // cl(postsArr)
        templating(postsArr);
    }
}

const onPostCreate = (eve) =>{
    eve.preventDefault();
    cl(eve)
    let postObj = {
        title : title.value,
        body : body.value.trim(), 
        userId : userId.value,
        //id
    }
    //object milne ke bad API call
    let xhr = new XMLHttpRequest;

    xhr.open('POST', postUrl);

    xhr.send(JSON.stringify(postObj));

    xhr.onload = function(){
       // cl(xhr.status);
       if(xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4){
        cl(xhr.status)//201
        cl(xhr.response)
        cl(xhr.readyState)
        postObj.id = JSON.parse(xhr.response).id
        cl(postObj)
        postForm.reset();
        let card = document.createElement("div");
        card.className = 'card mb-4';
        card.id=postObj.id;
        card.innerHTML=`
                        <div class="card-header">
                            <h3 class="m-0">
                                ${postObj.title}
                            </h3>
                        </div>
                        <div class="card-body">
                            <p class="m-0">
                                ${postObj.body}
                            </p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-success onClick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
                        </div>
        `
        postsContainer.prepend(card);
        Swal.fire("Post Created Successfully !!!", "", "success")
    }
    }
}

const onUpdateBtnClick =()=>{
//id
let updateId = localStorage.getItem("editId");
cl(updateId)
// updatedObj
let updatedObj = {
    title : title.value,
    body : body.value.trim(),
    userId : userId.value
};
cl(updatedObj)

//updateUrl- baseUrl/posts/:id
let updatedUrl =`${baseUrl}/posts/${updateId}` ;

//api call
let xhr = new XMLHttpRequest();
xhr.open("PATCH",updatedUrl);
xhr.send(JSON.stringify(updatedObj));
xhr.onload = function(){
    if(xhr.status>=200 && xhr.status <300){
        cl(xhr.response);
        
        
        let card = [...document.getElementById(updateId).children];
        cl(card);
        card[0].innerHTML = `
                         <div class="card-header">
                            <h3 class="m-0">
                                ${updatedObj.title}
                            </h3>
                        </div>
        `;
        card[1].innerHTML =`
                        <div class="card-body">
                            <p class="m-0">
                                ${updatedObj.body}
                            </p>
                        </div>
        `
        postForm.reset();  
        submitBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
        Swal.fire("Post Updated Successfully !!!", "", "success")
    }

}
}


postForm.addEventListener("submit", onPostCreate)
updateBtn.addEventListener("click",onUpdateBtnClick)