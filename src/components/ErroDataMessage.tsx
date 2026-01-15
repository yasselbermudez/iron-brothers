export default function ErrorData({message,description}:{message:string,description?:string}){
    return(
        <div className='p-10 text-center'>
            <h1 className='text-white text-xl semibold'>{message}</h1>
            {description&&<p className='text-slate-400'>{description}</p>}
        </div>
    )
}