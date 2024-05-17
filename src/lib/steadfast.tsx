"use server";

type TSteadFastApiPostParams = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note: string;
};

export const steadFeastApi = async (params: TSteadFastApiPostParams[]) => {
  const url = "https://portal.steadfast.com.bd/api/v1/create_order/bulk-order";
  const api_key = process.env.STEAD_FAST_API_ID!;
  const api_secret = process.env.STEAD_FAST_API_SECRET!;

  if (!api_key || !api_key) return false;

  try {
    const data = await fetch(url, {
      headers: {
        "Api-Key": api_key,
        "Secret-Key": api_secret,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        data: params,
      }),
    });

    const resp = await data.json();

    if (resp.status === 200) return true;

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
