import axios from "axios";
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
export const uploadResume = async (resume: File) => {
  const formData = new FormData();
  formData.append("resume", resume);
  console.log(resume);
  try {
    const response = await axios.post(`${BACKEND_API}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data.data);
    return response.data.data;
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
