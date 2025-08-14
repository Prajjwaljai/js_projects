function setDarkOrLight(){
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        document.body.classList.add("dark");
        document.body.classList.remove("light");
    }else{
        document.body.classList.add("light");
        document.body.classList. remove("dark");
    }
}
setDarkOrLight();

if(localStorage.getItem("theme")){
    document.body.classList.add(localStorage.getItem("theme"));
}else{
    setDarkOrLight();
}

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener("change", function(){
        if(!localStorage.getItem("theme")){//applying this if() make no effect of window dark/light. follows only localstorage
        setDarkOrLight();
        }
        //setDarkOrLight();
    });

let btn = document.querySelector("button");

btn.addEventListener("click", function(){
    if(document.body.classList.contains("dark")){
        document.body.classList.remove("dark");
        document.body.classList. add("light");

        localStorage.setItem("theme", "light");
    }else{
        document.body.classList.remove("light");
        document.body.classList. add("dark");

        localStorage.setItem("theme", "dark");
    }
});
