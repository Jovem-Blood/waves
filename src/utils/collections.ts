import { AudioPlayer } from "@discordjs/voice";
import { Collection } from "discord.js";

let playing = new Collection<String, AudioPlayer>()
let paused = new Collection<String, AudioPlayer>()

export {playing, paused}
