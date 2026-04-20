const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../server/src/app");
const User = require("../../server/src/models/User");
const Profile = require("../../server/src/models/Profile");

const createStudentToken = () =>
  jwt.sign(
    { id: "student-1", email: "student@example.com", accountType: "Student" },
    process.env.JWT_SECRET
  );

const createQueryChain = (result) => {
  const chain = {
    populate() {
      return chain;
    },
    lean: async () => result,
  };

  return chain;
};

const createExecChain = (result) => {
  const chain = {
    populate() {
      return chain;
    },
    exec: async () => result,
  };

  return chain;
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Profile API contracts", () => {
  it("PUT /api/v1/profile/updateProfile returns updatedUserDetails contract", async () => {
    const profileDoc = {
      dateOfBirth: "",
      about: "",
      gender: "",
      contactNumber: "",
      saveCalled: false,
      save: async function saveProfile() {
        this.saveCalled = true;
      },
    };

    const userDoc = {
      _id: "student-1",
      firstName: "Test",
      lastName: "User",
      additionalDetails: "profile-1",
      saveCalled: false,
      save: async function saveUser() {
        this.saveCalled = true;
      },
    };

    let findByIdCalls = 0;
    jest.spyOn(User, "findById").mockImplementation((id) => {
      findByIdCalls += 1;

      if (findByIdCalls === 1) {
        return Promise.resolve(userDoc);
      }

      return createQueryChain({
        _id: id,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        image: "",
        additionalDetails: {
          _id: "profile-1",
          dateOfBirth: "2000-01-01",
          about: "About me",
          gender: "Other",
          contactNumber: "9999999999",
        },
      });
    });

    jest.spyOn(Profile, "findById").mockResolvedValue(profileDoc);

    const response = await request(app)
      .put("/api/v1/profile/updateProfile")
      .set("Authorization", `Bearer ${createStudentToken()}`)
      .send({
        firstName: "Updated",
        lastName: "Name",
        dateOfBirth: "2000-01-01",
        about: "About me",
        contactNumber: "9999999999",
        gender: "Other",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data.updatedUserDetails).toBeTruthy();
    expect(response.body.data.updatedUserDetails._id).toBe("student-1");
    expect(response.body.data.updatedUserDetails.firstName).toBe("Updated");
    expect(response.body.data.updatedUserDetails.lastName).toBe("Name");
    expect(profileDoc.about).toBe("About me");
    expect(profileDoc.saveCalled).toBe(true);
    expect(userDoc.saveCalled).toBe(true);
  });

  it("GET /api/v1/profile/getUserDetails prefers valid Authorization token over stale cookie token", async () => {
    const validToken = createStudentToken();

    jest.spyOn(User, "findById").mockImplementation((id) =>
      createExecChain({
        _id: id,
        firstName: "Valid",
        lastName: "User",
        email: "student@example.com",
        additionalDetails: {
          _id: "profile-1",
        },
      })
    );

    const response = await request(app)
      .get("/api/v1/profile/getUserDetails")
      .set("Authorization", `Bearer ${validToken}`)
      .set("Cookie", ["token=not-a-valid-jwt"]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data._id).toBe("student-1");
  });
});
