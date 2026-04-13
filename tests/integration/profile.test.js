const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

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

test("PUT /api/v1/profile/updateProfile returns updatedUserDetails contract", async (t) => {
  const originalUserFindById = User.findById;
  const originalProfileFindById = Profile.findById;

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

  let findByIdCalls = 0;
  User.findById = (id) => {
    findByIdCalls += 1;

    if (findByIdCalls === 1) {
      return Promise.resolve({
        _id: id,
        additionalDetails: "profile-1",
      });
    }

    return createQueryChain({
      _id: id,
      firstName: "Test",
      lastName: "User",
      image: "",
      additionalDetails: {
        _id: "profile-1",
        dateOfBirth: "2000-01-01",
        about: "About me",
        gender: "Other",
        contactNumber: "9999999999",
      },
    });
  };

  Profile.findById = async () => profileDoc;

  t.after(() => {
    User.findById = originalUserFindById;
    Profile.findById = originalProfileFindById;
  });

  const response = await request(app)
    .put("/api/v1/profile/updateProfile")
    .set("Authorization", `Bearer ${createStudentToken()}`)
    .send({
      dateOfBirth: "2000-01-01",
      about: "About me",
      contactNumber: "9999999999",
      gender: "Other",
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.statusCode, 200);
  assert.ok(response.body.data.updatedUserDetails);
  assert.equal(response.body.data.updatedUserDetails._id, "student-1");
  assert.equal(profileDoc.about, "About me");
  assert.equal(profileDoc.saveCalled, true);
});
