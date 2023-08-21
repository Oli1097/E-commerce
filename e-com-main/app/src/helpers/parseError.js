export default function parseError(error) {
  if (!error) {
    return "Unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error.response) {
    const data = error.response.data;
    if (data.message) {
      return data.message;
    }
    return JSON.stringify(data);
  }
  if (error.message) {
    return error.message;
  }
  return "Something went wrong";
}
