const express = require("express");
const {
  handleCreateNewIdea,
  handleGetAllIdea,
  handleGetIdeaById,
  handleUpdateIdea,
  handleDeleteIdea,
} = require("../controllers/idea.controller");
const protect = require("../middlewares/protect");

const router = express.Router();

router.route("/").get(handleGetAllIdea).post(protect, handleCreateNewIdea);

router
  .route("/:id")
  .get(handleGetIdeaById)
  .put(protect, handleUpdateIdea)
  .delete(protect, handleDeleteIdea);

module.exports = router;
