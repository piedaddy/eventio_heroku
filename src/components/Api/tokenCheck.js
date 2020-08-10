const url = "https://testproject-api-v2.strv.com/auth/native";

export const getNewAuthToken = async (auth) => {
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      APIKey: "a44883edde409d11fc9fca4b4c028b311ea4cabc",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: auth
    }),
  });
  const data = await response.json();
  console.log('TOKEN CHECK', data, 'response', response)
  }
