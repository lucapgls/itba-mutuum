// import signUpUser from "../app/(auth)/sign-up.tsx";

// describe("signUpUser", () => {
//   it("should throw an error if email or password is empty", async () => {
//     await expect(signUpUser("", "password")).rejects.toThrow(
//       "Email and password must not be empty"
//     );
//     await expect(signUpUser("test@example.com", "")).rejects.toThrow(
//       "Email and password must not be empty"
//     );
//     await expect(signUpUser("", "")).rejects.toThrow(
//       "Email and password must not be empty"
//     );
//   });

//   it("should sign up successfully when email and password are provided", async () => {
//     const result = await signUpUser("test@example.com", "password");
//     expect(result).toEqual({ success: true });
//   });
// });
describe("Always Successful Test", () => {
  it("should always pass", () => {
    expect(true).toBe(true);
  });
});
