// import axios from "axios";

// const BASE_URL = "http://localhost:8080"; // Assuming the base URL is the same for all endpoints

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
  
//   return {
//     "Content-Type": "application/json",
//     Authorization: token ? `Bearer ${token}`: "",
//   };
// };

// export const UserSignUpService = async (data) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/auth/register`, data);
//     return response.data;
//   } catch (error) {
//     console.error("User Sign Up Error:", error);
//     throw error;
//   }
// };


// export const UserLoginService = async (data) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/auth/token`, data);
//     const token = response.data.token; // Assuming the token key in the response
//     localStorage.setItem("token", token); // Store the token in localStorage
//     console.log("Stored Token:", token); // Log the stored token (for verification)
//     return token; // Return the token from the login service
//   } catch (error) {
//     console.error("User Login Error:", error);
//     throw error;
//   }
// };




// export const awsService = async (service, startDate, endDate, months) => {
//   try {
//     const endpoint = months === 0
//       ? `/aws/billing-details?service=${service}&startDate=${startDate}&endDate=${endDate}`
//       : `/aws/billing-details?service=${service}&months=${months}`;

//     const response = await axios.get(`${BASE_URL}${endpoint}`, {
//       headers: getAuthHeaders(),
//     });
//     return response.data;
//   } catch (error) {
//     console.error("AWS Service Error:", error);
//     throw error; // Propagate the error to handle it where this function is called
//   }
// };

// export const gcpService = async (serviceDescription, startDate, endDate, months) => {
//   try {
//     let endpoint = '/gcp/details';

//     if (serviceDescription && startDate && endDate) {
//       endpoint += `?serviceDescription=${serviceDescription}&startDate=${startDate}&endDate=${endDate}`;
//     } else if (serviceDescription && months) {
//       endpoint += `?serviceDescription=${serviceDescription}&months=${months}`;
//     } else if (startDate && endDate) {
//       endpoint += `?startDate=${startDate}&endDate=${endDate}`;
//     } else if (months) {
//       endpoint += `?months=${months}`;
//     } else {
//       throw new Error('Invalid parameters');
//     }

//     const response = await axios.get(`${BASE_URL}${endpoint}`, {
//       headers: getAuthHeaders(),
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Gcp Service Error:', error);
//     throw error;
//   }
// };



// export const azureService = async (ResourseType, startDate, endDate, months) => {
//   try {
//     let endpoint = '/azure/details';

//     if (ResourseType && startDate && endDate) {
//       endpoint += `?ResourseType=${ResourseType}&startDate=${startDate}&endDate=${endDate}`;
//     } else if (ResourseType && months) {
//       endpoint += `?ResourseType=${ResourseType}&months=${months}`;
//     } else if (startDate && endDate) {
//       endpoint += `?startDate=${startDate}&endDate=${endDate}`;
//     } else if (months) {
//       endpoint += `?months=${months}`;
//     } else {
//       throw new Error('Invalid parameters');
//     }

//     const response = await axios.get(`${BASE_URL}${endpoint}`, {
//       headers: getAuthHeaders(),
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Gcp Service Error:', error);
//     throw error;
//   }
// };


import axios from "axios";
 
const BASE_URL = "http://localhost:8080"; // Assuming the base URL is the same for all endpoints
 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
 
export const UserSignUpService = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    console.error("User Sign Up Error:", error);
    throw error;
  }
};
 
export const UserLoginService = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/token`, data);
    return response.data;
  } catch (error) {
    console.error("User Login Error:", error);
    throw error;
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
 
export const gcpService = async (serviceDescription, startDate, endDate, months) => {
  try {
    let endpoint = '/gcp/details';
 
    if (serviceDescription && startDate && endDate) {
      endpoint += `?serviceDescription=${serviceDescription}&startDate=${startDate}&endDate=${endDate}`;
    } else if (serviceDescription && months) {
      endpoint += `?serviceDescription=${serviceDescription}&months=${months}`;
    } else if (startDate && endDate) {
      endpoint += `?startDate=${startDate}&endDate=${endDate}`;
    } else if (months) {
      endpoint += `?months=${months}`;
    } else {
      throw new Error('Invalid parameters');
    }
 
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Gcp Service Error:', error);
    throw error;
  }
};
 
 
 
export const azureService = async (ResourseType, startDate, endDate, months) => {
  try {
    let endpoint = '/azure/details';
 
    if (ResourseType && startDate && endDate) {
      endpoint += `?ResourseType=${ResourseType}&startDate=${startDate}&endDate=${endDate}`;
    } else if (ResourseType && months) {
      endpoint += `?ResourseType=${ResourseType}&months=${months}`;
    } else if (startDate && endDate) {
      endpoint += `?startDate=${startDate}&endDate=${endDate}`;
    } else if (months) {
      endpoint += `?months=${months}`;
    } else {
      throw new Error('Invalid parameters');
    }
 
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Azure Service Error:', error);
    throw error;
  }
};
