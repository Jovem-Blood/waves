import { Command } from '@sapphire/framework';
import { paused, playing } from './../utils/collections'

export class PauseCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('pause').setDescription('pauses music')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guildId = interaction.guildId!
    const player = playing.get(guildId)
    if (!player) {
      interaction.reply("Não tem nada para pausar")
    } else {
      player.pause()
      playing.delete(guildId)
      paused.set(guildId, player)
      interaction.reply("Musica pausada")
    }

  }
}
