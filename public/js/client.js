const createuser = document.querySelector('#create-user')
const createtask = document.querySelector('#create-task')
const getAllTask = document.querySelector('#get-task')
const getuser = document.querySelector('#get-user')
const loginUser = document.querySelector('#login-user')
const logoutUser = document.querySelector('#logout-user')
const deleteUser = document.querySelector('#delete-user')
const editprofile = document.querySelector('#edit-profile')
const edittask = document.querySelector('#edit-task')
const deletetask = document.querySelector('#delete-task')
const deleteavatar = document.querySelector('#delete-avatar')


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
      
        fetch(`${url}/users`, {
            method: 'POST',
            body: formData,
        })
        .then(async(res) =>{
            const data =  await res.json()
            var formContainer = document.getElementById('signupFormContainer');
            formContainer.style.display = 'none';
            console.log(data);
            var msg = document.getElementById('msg');
        msg.style.display = 'block';
        msg.innerText = 'User created Successfully'
        setTimeout(()=>{
            msg.style.display = 'none'
        },3000)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
});

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
        var avatar = document.getElementById('avatar')
        avatar.src = `data:image/jpeg;base64,${data?.avatar}`
        avatar.style.display = 'block'
    }).catch((e)=>{
        console.log(e)
    })
})

editprofile.addEventListener('click', async(e)=>{
    var formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'block';
});

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
        const formData = new FormData(event.target);
      
        fetch(`${url}/users/me`, {
            
            method: 'PATCH',
            headers:{
                Authorization:`Bearer ${token}`,
            },
            body: formData,
        })
        .then(async(res) =>{
            const data =  await res.json()
            var formContainer = document.getElementById('editFormContainer');
            formContainer.style.display = 'none';
            console.log(data);
            var msg = document.getElementById('msg');
            msg.style.display = 'block';
            msg.innerText = 'Updated Successfully'
            setTimeout(()=>{
                msg.style.display = 'none'
            },3000)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

logoutUser.addEventListener('click', async(e)=>{
    e.preventDefault()
    fetch(`${url}/users/logout`,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    }).then(async (res)=>{
        var msg = document.getElementById('msg');
        msg.style.display = 'block';
        msg.innerText = 'Logout Successfully'
    }).catch((e)=>{
        console.log(e)
    })
})

deleteUser.addEventListener('click', async(e)=>{
    e.preventDefault()
    fetch(`${url}/users/me`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`,
        },
    }).then(async (res)=>{
        var msg = document.getElementById('msg');
            msg.style.display = 'block';
            msg.innerText = 'Deleted Successfully'
            setTimeout(()=>{
                msg.style.display = 'none'
            },3000)
    }).catch((e)=>{
        console.log(e)
    })
})

deleteavatar.addEventListener('click', async(e)=>{
    e.preventDefault()
    fetch(`${url}/users/me/avatar`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`,
        },
    }).then(async (res)=>{
        var msg = document.getElementById('msg');
        msg.style.display = 'block';
        msg.innerText = 'Deleted Successfully'
        setTimeout(()=>{
            msg.style.display = 'none'
        },3000)
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
        var msg = document.getElementById('msg');
        msg.style.display = 'block';
        msg.innerText = 'Task Created Successfully'
        setTimeout(()=>{
            msg.style.display = 'none'
        },3000)
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
   
        var showTask = document.getElementById('showtask');

        data.forEach((task)=>{
            let desc = document.createElement("li")
            let status = document.createElement("p")

            desc.innerText = task.description
            status.innerText = task.completed

            showTask.appendChild(desc)
            showTask.appendChild(status)
        })
    }).catch((e)=>{
        console.log(e)
    })
})


edittask.addEventListener('click', async(e)=> {
    var formContainer = document.getElementById('edittaskContainer');
    formContainer.style.display = 'block';
    console.log('Clicked')
});

document.getElementById('edittaskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
        const formData = new FormData(event.target);

        fetch(`${url}/tasks/:id`, {
            
            method: 'PATCH',
            headers:{
                Authorization:`Bearer ${token}`,
            },
            body: formData,
        })
        .then(async(res) =>{
            const data =  await res.json()
            var formContainer = document.getElementById('edittaskContainer');
            formContainer.style.display = 'none';
            console.log(data);
            var msg = document.getElementById('msg');
            msg.style.display = 'block';
            msg.innerText = 'Updated Successfully'
            setTimeout(()=>{
                msg.style.display = 'none'
            },3000)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

deletetask.addEventListener('click', async(e)=>{
    e.preventDefault()
    fetch(`${url}/tasks/:id`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`,
        },
    }).then(async (res)=>{
        var msg = document.getElementById('msg');
        msg.style.display = 'block';
        msg.innerText = 'Deleted Successfully'
        setTimeout(()=>{
            msg.style.display = 'none'
        },3000)
    }).catch((e)=>{
        console.log(e)
    })
})





