export const message= {
    sucess:{
        UserCreated:"User created successfully!",
        UserLogged:"User logged in successfully!"
    },
    error:{
        notFull:"Please, complete all the fields!",
        invalidEmial: "The email address provided is invalid!",
        notMatchPwd:"The passwords do not match!",
        onlyLetterName: "The first name con only contain letters!",
        onlyLetterSpace:"Please revise your last name!",
        alreadyExist:{
            msg:"The email already exists, try ",
            rediUrl:"/api/auth/login",
            linkmsg:"Log in."
        },
        notFoundUser:{
            msg: "Incorrect email address or password. Please try again or ",
            rediUrl: "/api/auth/register",
            linkmsg: "Create account."    
        },
        pwdIncorrect:"The password is incorrect, try again.",
        genericError:"Something is wrong..."
    }
}