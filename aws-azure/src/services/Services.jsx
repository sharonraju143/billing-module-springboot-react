// import axios from "axios";
// import toast from "react-hot-toast";


// export const azureService = async (month) => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.get(
//     `http://localhost:9070/api/azure/month?months=${month}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// };

// export const awsService = async (service , startDate , endDate,months) => {
  
// const token = localStorage.getItem("token");
//   console.log(token, "token");
//   if(token) {
//   const response = await axios.get(
//     months==0?`http://localhost:9070/api/aws/billing-details?service=${service}&startDate=${startDate}&endDate=${endDate}` : `http://localhost:9070/api/aws/billing-details?service=${service}&months=${months}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )
//   return response.data
// }else{
//   toast.error("Null Token")
// }

// };

// export const awsFetch = async (service, month) => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.get(
//     `http://localhost:9070/api/aws/service/month?service=${service}&months=${month}`,

//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// };

// export const awsCountService = async () => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.get(`http://localhost:9070/api/aws/data/count`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// export const azureCountService = async () => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.get(
//     `http://localhost:9070/api/azure/data/count`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// };

// export const UserSignUpService = async (data) => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.post(
//     `http://localhost:9070/api/users/saveuser`,
//     data
//   );
//   return response.data;
// };

// export const UserLoginService = async (data) => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.post(
//     `http://localhost:9070/api/users/authenticate`,
//     data
//   );
//   return response.data;
// };

// export const listService = async () => {
  
// const token = localStorage.getItem("token");
//   const response = await axios.get(`http://localhost:9070/api/aws/distinct-services`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };


import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:9070/api"; // Assuming the base URL is the same for all endpoints

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const azureService = async (month) => {
  try {
    const response = await axios.get(`${BASE_URL}/azure/month?months=${month}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Azure Service Error:", error);
    throw error; // Propagate the error to handle it where this function is called
  }
};

export const awsService = async (service, startDate, endDate, months) => {
  try {
    const endpoint = months === 0
      ? `/aws/billing-details?service=${service}&startDate=${startDate}&endDate=${endDate}`
      : `/aws/billing-details?service=${service}&months=${months}`;

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("AWS Service Error:", error);
    throw error; // Propagate the error to handle it where this function is called
  }
};

export const awsFetch = async (service, month) => {
  try {
    const response = await axios.get(`${BASE_URL}/aws/service/month?service=${service}&months=${month}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("AWS Fetch Error:", error);
    throw error;
  }
};

export const awsCountService = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/aws/data/count`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("AWS Count Service Error:", error);
    throw error;
  }
};

export const azureCountService = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/azure/data/count`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Azure Count Service Error:", error);
    throw error;
  }
};

export const UserSignUpService = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/saveuser`, data);
    return response.data;
  } catch (error) {
    console.error("User Sign Up Error:", error);
    throw error;
  }
};

export const UserLoginService = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/authenticate`, data);
    return response.data;
  } catch (error) {
    console.error("User Login Error:", error);
    throw error;
  }
};

export const listService = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/aws/distinct-services`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("List Service Error:", error);
    throw error;
  }
};
