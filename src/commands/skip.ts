import { Command } from '@sapphire/framework';
import { counter, playing, queue } from '../utils/collections';
import play from 'play-dl';
import { createAudioResource } from '@discordjs/voice';

export class Skip extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('skip').setDescription('skip songs')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    interaction.reply("skiping");

    const guildId = interaction.guildId!
    const position = counter.get(guildId)! + 1
    console.log(queue.get(guildId))

    if (position >= queue.get(guildId)?.length!) {
      return interaction.channel?.send("Tu tá no final já carai")
    }

    const nextSong = queue.get(guildId)![position]
    const player = playing.get(guildId)!
    const nextSource = await play.stream(nextSong)
    const nextResource = createAudioResource(nextSource.stream, {
      inputType: nextSource.type
    })
    player.play(nextResource)
    playing.set(guildId, player)
    play.video_info(nextSong).then(info => {
      interaction.channel?.send(`Tocando agora **${info.video_details.title}**`)
    })
    counter.set(guildId, position)
  }
}
