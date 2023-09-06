import { Command } from '@sapphire/framework';
import { paused, playing } from './../utils/collections'

export class LeaveCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('leave').setDescription('leaves the voice chat')
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guildId = interaction.guildId!
    const player = paused.get(guildId) || playing.get(guildId)
    if (!player) {
      interaction.reply("Como eu saio de algo que eu num tô?")
    } else {
      player.stop()
      interaction.reply("Falow")
    }

  }
}
