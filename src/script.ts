import { game } from "./game";
import "./game/player";
import "./game/debug";

game.config.simulation.rate = 1000 / 200;
game.start();
