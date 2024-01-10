const createuser = document.querySelector('#create-user')
const createtask = document.querySelector('#create-task')
const getAllTask = document.querySelector('#get-task')
const getuser = document.querySelector('#get-user')
const loginUser = document.querySelector('#login-user')
const logoutUser = document.querySelector('#logout-user')


const url = 'http://localhost:3000'

createuser.addEventListener('click', function() {
    var formContainer = document.getElementById('signupFormContainer');
    formContainer.style.display = 'block';
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value
    const confirmpassword = document.getElementById('confirmpassword').value

    if(password!=confirmpassword){
        window.alert("Password does not match")
    }
    
    else{
        const formData = new FormData(event.target);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
    
        fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(async(res) =>{
            const data =  await res.json()
            console.log(data);
            var formContainer = document.getElementById('signupFormContainer');
            formContainer.style.display = 'none';
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
});

// const avatar = document.getElementById('avatarupload')
// avatar.addEventListener('submit',function(e){
//     e.preventDefault()
//     const formData = new FormData(e.target);
//     const jsonData = {};
//     formData.forEach((value, key) => {
//         jsonData[key] = value;
//     });

//     fetch(`${url}/users/avatar`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(jsonData),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// })


loginUser.addEventListener('click', async(e)=>{
    var formContainer = document.getElementById('loginformcontainer');
    formContainer.style.display = 'block';
})

document.getElementById('loginform').addEventListener('submit',function(e){
    e.preventDefault()
    const formData = new FormData(e.target);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
    fetch(`${url}/users/login`,{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(jsonData)
    }).then(async (res)=>{
        const data = await res.json();
        localStorage.setItem('usertoken',data.token)
        var formContainer = document.getElementById('loginformcontainer');
        formContainer.style.display = 'none';
        var msg = document.getElementById('msg');
        msg.style.display = 'block';
        msg.innerText = 'Login Successfully'

        setTimeout(()=>{
            msg.style.display = 'none'
        },3000)
        console.log(data)
    }).catch((e)=>{
        console.log(e)
    })
})

const token = localStorage.getItem('usertoken')

getuser.addEventListener('click',function(e){
    var formContainer = document.getElementById('viewprofile');
    formContainer.style.display = 'block';

    e.preventDefault()
    fetch(`${url}/users/me`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    }).then(async (res)=>{
        const data = await res.json();
        console.log(data)
        var name = document.getElementById('name');
        name.style.display = 'block';
        name.innerText = data.name
        var email = document.getElementById('email');
        email.style.display = 'block';
        email.innerText = data.email
        var age = document.getElementById('age');
        age.style.display = 'block';
        age.innerText = data.age

    }).catch((e)=>{
        console.log(e)
    })
})

createtask.addEventListener('click', async(e)=>{
    var formContainer = document.getElementById('taskcontainer');
    formContainer.style.display = 'block';
})
document.getElementById('taskForm').addEventListener('submit',function(e){
    e.preventDefault()
    const formData = new FormData(e.target);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    console.log(jsonData)
    fetch(`${url}/tasks`,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json',
        },
        body:JSON.stringify(jsonData)
    }).then(async (res)=>{
        const data = await res.json();
        console.log(data)
    }).catch((e)=>{
        console.log(e)
    })
})
  
getAllTask.addEventListener('click', async(e)=>{
    e.preventDefault()
    var formContainer = document.getElementById('viewtasks');
    formContainer.style.display = 'block';
    
    fetch(`${url}/tasks`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    }).then(async (res)=>{
        const data = await res.json();
        console.log(data)
        var description= document.getElementById('description');
        description.style.display = 'block';
        description.innerText = data[0].description
        var status = document.getElementById('status');
        status.style.display = 'block';
        status.innerText = data[0].completed
    }).catch((e)=>{
        console.log(e)
    })
})


logoutUser.addEventListener('click', async(e)=>{
    e.preventDefault()
    fetch(`${url}/users/logout`,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    }).then(async (res)=>{
        console.log('logout successful')
    }).catch((e)=>{
        console.log(e)
    })
})


