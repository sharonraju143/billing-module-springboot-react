import axios from "axios";
import toast from "react-hot-toast";


export const azureService = async (month) => {
  
const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:9070/api/azure/month?months=${month}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const awsService = async (service , startDate , endDate,months) => {
  
const token = localStorage.getItem("token");
  console.log(token, "token");
  if(token) {
  const response = await axios.get(
    months==0?`http://localhost:9070/api/aws/billing-details?service=${service}&startDate=${startDate}&endDate=${endDate}` : `http://localhost:9070/api/aws/billing-details?service=${service}&months=${months}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}else{
  toast.error("Null Token")
}

};

export const awsFetch = async (service, month) => {
  
const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:9070/api/aws/service/month?service=${service}&months=${month}`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const awsCountService = async () => {
  
const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:9070/api/aws/data/count`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const azureCountService = async () => {
  
const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:9070/api/azure/data/count`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const UserSignUpService = async (data) => {
  
const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:9070/api/users/saveuser`,
    data
  );
  return response.data;
};

export const UserLoginService = async (data) => {
  
const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:9070/api/users/authenticate`,
    data
  );
  return response.data;
};

export const listService = async () => {
  
const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:9070/api/aws/distinct-services`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
