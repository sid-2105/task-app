const createuser = document.querySelector('#create-user')
const createtask = document.querySelector('#create-task')
const getAllTask = document.querySelector('#get-all-task')
const getuser = document.querySelector('#get-user')
const loginUser = document.querySelector('#login-user')
const logoutUser = document.querySelector('#logout-user')

const url = 'http://localhost:3000'

createuser.addEventListener('click', function() {
    var formContainer = document.getElementById('signupFormContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
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
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('usertoken',data.token)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
});

const token = localStorage.getItem('usertoken')

loginUser.addEventListener('click', async(e)=>{
    var formContainer = document.getElementById('loginformcontainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';

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
        console.log(data)
    }).catch((e)=>{
        console.log(e)
    })
})



getuser.addEventListener('click',async(e)=>{
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
    }).catch((e)=>{
        console.log(e)
    })
})

createtask.addEventListener('click', async(e)=>{
    var formContainer = document.getElementById('taskcontainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
})
document.getElementById('taskForm').addEventListener('submit',function(e){
    e.preventDefault()
    const formData = new FormData(e.target);
    const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
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

    fetch(`${url}/tasks`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    }).then(async (res)=>{
        const data = await res.json();
        console.log(data)
    }).catch((e)=>{
        console.log(e)
    })
})


logoutUser.addEventListener('click', async(e)=>{
    e.preventDefault()
    fetch(`${url}/users/logout`,{
        method:"POST",
        headers:{
            Authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTlkNzQ3ODNmNDIwNDU2YzVhNWRhYTgiLCJpYXQiOjE3MDQ4MTc3ODR9.-YDSboV00N0uUnt7tGujB3Dpb09akb562_ccLiS6rxA`,
            'Content-Type':'application/json',
        },
    }).then(async (res)=>{
        // const data = await res.json();
        console.log("Hello")
    }).catch((e)=>{
        console.log(e)
    })
})


