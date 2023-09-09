import { AudioPlayer } from "@discordjs/voice";
import { Collection } from "discord.js";

let playing = new Collection<String, AudioPlayer>()
let paused = new Collection<String, AudioPlayer>()
let queue = new Collection<String, String[]>()

export {playing, paused, queue}
