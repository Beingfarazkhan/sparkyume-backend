const { default: mongoose } = require("mongoose");
const Ideas = require("../models/ideas");

const handleGetAllIdea = async (req, res, next) => {
  try {
    const ideas = await Ideas.find({});
    if (!ideas) {
      res.status(400);
      throw new Error("Error Fetching Ideas");
    }
    return res.status(200).json(ideas);
  } catch (err) {
    next(err);
  }
};

const handleGetIdeaById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("No Idea Found with this ID");
    }

    const idea = await Ideas.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error("No Idea Found with this ID");
    }
    return res.status(200).json(idea);
  } catch (err) {
    next(err);
  }
};

const handleCreateNewIdea = async (req, res, next) => {
  try {
    const { title, description, summary, tags } = req.body || {};

    if (!title?.trim() || !description?.trim() || !summary?.trim()) {
      res.status(400);
      throw new Error("Some Fields Are Missing");
    }
    const user = req.user;
    const idea = await Ideas.create({
      user: user._id,
      title,
      description,
      summary,
      tags:
        typeof tags === "string"
          ? [
              ...new Set(
                tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              ),
            ]
          : Array.isArray(tags)
          ? tags
          : [],
    });

    if (!idea) {
      res.status(500);
      throw new Error("Error Creating New Idea");
    }

    return res.status(201).json(idea);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const handleUpdateIdea = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("No Idea Found with this ID");
    }
    const { title, summary, description, tags } = req.body || {};

    const idea = await Ideas.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea Not Found!");
    }

    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Access Forbidden!");
    }
    idea.title = title;
    idea.description = description;
    idea.summary = summary;
    idea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? [
          ...new Set(
            tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          ),
        ]
      : [];

    await idea.save();

    return res.status(200).json(idea);
  } catch (err) {
    next(err);
  }
};

const handleDeleteIdea = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("No Idea Found with this ID");
    }
    const idea = await Ideas.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error("No Idea Found with this ID");
    }

    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Access Forbidden!");
    }

    await idea.deleteOne();

    return res.status(200).json({
      message: "Idea Deleted Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleGetAllIdea,
  handleCreateNewIdea,
  handleGetIdeaById,
  handleUpdateIdea,
  handleDeleteIdea,
};
