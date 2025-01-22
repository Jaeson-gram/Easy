import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Writer",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Please add a title"],
    },

    imageURL: {
      type: String,
    },
    // author, title, imageurl, body, date, comments, categories, meta
    body: {
      type: String,
      required: [true, "please add some content"],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    comments: [
      {
        commentator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Writer",
        },

        body: {
          type: String,
          required: [true, "please add a comment body"],
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    categories: {
      type: [String],
      required: [true, "please add at least one category"],
    },

    meta: {
      likes: {
        type: Number,
        default: 0,
      },
      bookmarks: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", articleSchema);
