import axios from "axios";

interface Login {
  membername: string;
  memberpass: string;
}

async function LoginData(loginData: Login) {
  const { membername, memberpass } = loginData;


  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`,
      { membername, memberpass },
      {
        headers: {
          "Content-Type": "application/json",
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
        },
      }
    );



    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    throw error; // Rethrow the error to propagate it to the caller
  }
}

async function Authenticate() {
  try {
    const access_token = localStorage.getItem("access_token");
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/authenticate`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 200) {
      if (response.data.message === true) {
        return true;
      }
    }

    return false;
  } catch (err) {
    return false;
  }
}

export { LoginData, Authenticate };
