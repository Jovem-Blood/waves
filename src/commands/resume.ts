import { Command } from '@sapphire/framework';
import { paused, playing } from './../utils/collections'

export class RsumeCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('resume').setDescription('resumes music')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guildId = interaction.guildId!
    const player = paused.get(guildId)
    if (!player) {
      interaction.reply("Não tem nada para despausar")
    } else {
      player.unpause()
      playing.set(guildId, player)
      paused.delete(guildId)
      interaction.reply("Musica despausada")
    }

  }
}
