const sendOtp = async (mobile: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append("mobile", mobile); // send without +91

    const response = await fetch(
      "http://landlordzdev.pragmatiqinc.com/api/sendSms",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: formData.toString(),
      }
    );

    const result = await response.text();
    console.log("Send OTP:", result);

    return response.ok;
  } catch (error) {
    console.error("Send OTP Error:", error);
    return false;
  }
};
