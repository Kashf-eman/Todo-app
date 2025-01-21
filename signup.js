var password1= document.getElementById("password1")
var eyeicon1=document.getElementById("eye1")
eyeicon1.addEventListener("click",function(){
if(password1.type=="password"){
    password1.type="text"
}
else {
password1.type = "password";  
}
})
var password2= document.getElementById("password2")
var eyeicon2=document.getElementById("eye2")
eyeicon2.addEventListener("click",function(){
if(password2.type=="password"){
    password2.type="text"
}
else {
password2.type = "password";  
}
})        
document.getElementById("signform").addEventListener("submit", function(event) {
    event.preventDefault();

    
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password1").value;
    const confirmPassword = document.getElementById("password2").value;
    let loader=document.getElementById("loader")
    loader.style.display="block"
    let btntext=document.getElementById("btn-text")
    btntext.style.display="none"
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    var userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };
    let alertbox=document.getElementById("alert")
let close =document.getElementById("closebtn")
close.addEventListener("click",function(){
    alertbox.style.top="-150px";
    window.location.href = 'login.html';
})
    localStorage.setItem('userData', JSON.stringify(userData));
console.log("userData",userData)
    fetch(`https://todo-backend-apis.vercel.app/api/auth/register`, { 

        method: 'POST',  
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(userData)  
    })
    .then(response => response.json())  
    .then(data => {
        console.log("API Response:", data); 
          alertbox.style.top="10px";
        // alert("Registration successful!");
        // window.location.href = "login.html"; // Log the entire response to inspect it
        // if (data.success) {
        //     alert("Registration successful!");
        //     window.location.href = "login.html";
        // } else {
        //     alert("Error: " + data.message);
        //     console.log(data.message); 
        // }
    })
    .catch(error => {
        alert("An error occurred. Please try again.");
    });
});