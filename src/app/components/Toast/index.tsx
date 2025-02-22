import styles from './styles.module.scss'
export type toastType ='Good'|'Bad'

interface toastProps{
    msg:string,
    type:toastType
}

export function Toast({msg,type}:toastProps){

    return(
        <div className={`${styles.toast} ${styles[type!]}`}>
            <p>{msg}</p>
        </div>
    );
}