import { Command } from '@sapphire/framework';
import { counter, playing, queue } from '../utils/collections';
import play from 'play-dl';
import { createAudioResource } from '@discordjs/voice';

export class Back extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('back').setDescription('go back at the queue')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    interaction.reply("backing");

    const guildId = interaction.guildId!
    const position = counter.get(guildId)! - 1
    console.log(queue.get(guildId))

    if (position < 0) {
      return interaction.channel?.send("Não tem mais oq voltar fio")
    }

    const prevSong = queue.get(guildId)![position]
    const player = playing.get(guildId)!
    const prevSource = await play.stream(prevSong)
    const prevResource = createAudioResource(prevSource.stream, {
      inputType: prevSource.type
    })
    player.play(prevResource)
    playing.set(guildId, player)
    play.video_info(prevSong).then(info => {
      interaction.channel?.send(`Tocando agora **${info.video_details.title}**`)
    })
    counter.set(guildId, position)
  }
}
