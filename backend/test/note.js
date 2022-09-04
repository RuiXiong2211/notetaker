// credits https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
let Note = require("../models/note");
let mongoose = require("mongoose");

chai.should();

chai.use(chaiHttp);

describe("Test NoteAPI", () => {
  beforeEach(async() => {
    //Before each test we empty the database
    mongoose.connection.collections.notes.drop();
    Note.remove({}, (err) => {
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
      chai
        .request(server)
        .get("/note")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/GET/:id note", () => {
    it("it should GET a note by the given id", (done) => {
      let note = new Note({ description: "ligma" });
      note.save((err, note) => {
        chai
          .request(server)
          .get("/note/" + note.id)
          .send(note)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("description");
            res.body.should.have.property("_id").eql(note.id);
            done();
          });
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
