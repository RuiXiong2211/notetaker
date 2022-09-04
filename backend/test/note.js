// credits https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

const chai = require("chai");
const expect = require("chai").expect;
const server = require("../index");
let Note = require("../models/note");
let mongoose = require("mongoose");
const request = require("supertest");

chai.should();

describe("Test NoteAPI", () => {
  let note;
  beforeEach((done) => {
    //Before each test we empty the database
    note = new Note({ description: "ligma" });
    mongoose.connection.collections.notes.drop();
    note
      .save()
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  afterEach((done) => {
    mongoose.connection.collections.notes.drop(() => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("/GET notes", () => {
    it("it should GET all the notes", (done) => {
      request(server)
        .get("/note")
        .then((res) => {
          expect(res.status).equal(200);
          done();
        });
    });
  });

  describe("/GET/:id note", () => {
    it("it should GET a note by the given id", (done) => {
      request(server)
        .get(`/note/${note._id}`)
        //.get("/note" + note.id)
        .then((res) => {
          const noteData = res.body;
          expect(res.status).equal(200);
          expect(noteData.description).equal(note.description)
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST note", () => {
    it("it should not POST a note without a description field", (done) => {
      let note = {};
      chai
        .request(server)
        .post("/note")
        .send(note)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });

    it("it should POST a note ", (done) => {
      let note = {
        description: "'Hello World",
      };
      chai
        .request(server)
        .post("/note")
        .send(note)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("description");
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe("/PUT/:id note", () => {
    it("it should UPDATE a note given the id", (done) => {
      let note = new Note({
        description: "notenote",
      });
      note.save((err, note) => {
        chai
          .request(server)
          .put("/note/" + note.id)
          .send({
            description: "Hello",
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("description").eql("Hello");
            done();
          });
      });
    });
  });

  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id note", () => {
    it("it should DELETE a note given the id", (done) => {
      let note = new Note({
        description: "Balerion",
      });
      note.save((err, note) => {
        chai
          .request(server)
          .delete("/note/" + note.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("message");
            done();
          });
      });
    });
  });
});
