import axios from "axios";

const token = localStorage.getItem("token");

export const azureService = async (month) => {
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
  console.log(months);
  const response = await axios.get(
    months===0?`http://localhost:9070/api/aws/billing-details?service=${service}&startDate=${startDate}&endDate=${endDate}` : `http://localhost:9070/api/aws/billing-details?service=${service}&months=${months}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const awsFetch = async (service, month) => {
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
  const response = await axios.get(`http://localhost:9070/api/aws/data/count`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const azureCountService = async () => {
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
  const response = await axios.post(
    `http://localhost:9070/api/users/saveuser`,
    data
  );
  return response.data;
};

export const UserLoginService = async (data) => {
  const response = await axios.post(
    `http://localhost:9070/api/users/authenticate`,
    data
  );
  return response.data;
};

export const listService = async () => {
  const response = await axios.get(`http://localhost:9070/api/aws/distinct-services`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
