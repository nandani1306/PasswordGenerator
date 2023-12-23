const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); 
const symbols = '`~!@#$%^&*()_+-={}[]:;"<,>.?/';


//initial values
let password = "";
let passwordLength = 10;
let checkCount = 0;


handleSlider(); 

//set strength color to grey
setIndicator("#ccc");


//functions
//set password length
//func : to display password length in UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
    //two parameters in above line of code is width-formula %  height%
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) 
        hasUpper=true;
    if(lowercaseCheck.checked) 
        hasLower=true;
    if(numbersCheck.checked) 
        hasNum=true;
    if(symbolsCheck.checked) 
        hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}


//shuffling password => Fisher Yates Method

function shufflePassword(array){
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+=el));
    return str;
}



allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    //corner count
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    // if(password.length>0)   
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //if none of the checkbox are selected
    if(checkCount==0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); 
    }

    //finding new password
    //remove old password
    password = "";

    //putting conditions mentioned in checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("com addn done");

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);

        console.log("random index" + randIndex);

        password += funcArr[randIndex]();
    }


    //shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("shuffling done");

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
});

