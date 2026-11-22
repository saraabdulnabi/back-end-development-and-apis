import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

// يحوّل "1" إلى رقم 1، ويترك النصوص الثانية كما هي
const toId = (value) => (/^\d+$/.test(value) ? Number(value) : value);

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(toId(req.params.userId));
  res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(toId(req.params.userId), req.body);
  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    toId(req.params.userId),
    toId(req.params.movieId),
    req.body,
  );
  res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  deleteMovie(toId(req.params.userId), toId(req.params.movieId));
  res.status(200).json({ message: "Movie removed." });
});

export default router;
