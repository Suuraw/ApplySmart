import axios from "axios";
const BACKEND_API=process.env.NEXT_PUBLIC_BACKEND_API;
export const getJobFields=async(file:File)=>{
    try {
        const formData=new FormData();
        formData.append("jobDoc",file);
        const response= await axios.post(`${BACKEND_API}/uploadDoc`,formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}