import { fileTemplate } from "./reqBodyTemplate";
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
export const uploadResume = async (resume: File) => {
  const formData = new FormData();
  formData.append("resume", resume);
  console.log(resume);
  try {
    console.log("loc",localStorage.getItem("token"));
    const response = await fileTemplate.post(`${BACKEND_API}/uploadResume`, formData, {
      headers: {
        Authorization:`Bearer ${localStorage.getItem("token")}`
      },
    });
    console.log(response.data.text);
    return response.data.text;
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};
// const data = {
//   jobDescription: "Consulting",
// };
// export const atsScore = async () => {
//   try {
//     const response = await axios.post(`${BACKEND_API}/atsScore`, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (error) {}
// };
