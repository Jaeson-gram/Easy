import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

// Function to generate initials from the name
function getInitials(name) {
  if (!name) return ""; // Handle empty names

  const nameParts = name.split(" "); // Split the name into parts
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); // First letter of the first name
  const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || ""; // First letter of the last name (if exists)

  return `${firstInitial}${lastInitial}`; // Combine initials
}

const writerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: { type: String, required: true, minlength: 5, maxlength: 1024 },

  bio: {
    type: String,
    default: 'I love Jesus <3',
  },

  profileImage: {
    type: String,
    default: () => {
      const initials = getInitials(this.name);
      return `https://ui-avatars.com/api/?name=${initials}&background=random&color=ffffff&size=128`;
    },
  },

  bookmarkedArticles: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  ], // List of bookmarked articles

  articles: [
    {type: mongoose.Schema.Types.ObjectId, re: 'Article'}
  ]
});

export default mongoose.model("Writer", writerSchema);
