import { AudioPlayer } from "@discordjs/voice";
import { Collection } from "discord.js";

let playing = new Collection<String, AudioPlayer>()
let paused = new Collection<String, AudioPlayer>()
let queue = new Collection<String, string[]>()
let counter = new Collection<String, number>()

export {playing, paused, queue, counter}
