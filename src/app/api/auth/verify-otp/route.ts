const verifyOtp = async (mobile: string, otp: string) => {
  try {
    const fullMobile = `+91${mobile}`;

    const url = `http://landlordzdev.pragmatiqinc.com/api/sendSms?mobileNumber=${fullMobile}&otp=${otp}`;

    const response = await fetch(url);

    const result = await response.text();
    console.log("Verify OTP:", result);

    return response.ok;
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return false;
  }
};
