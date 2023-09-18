import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord.js';
import play from 'play-dl';
import { paused, playing, counter, queue } from '../utils/collections';

export class PlayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('play').setDescription('Play music').addStringOption((opt) => opt.setName("url").setDescription("uma url do youtube").setRequired(true)
      )
    )
      .registerContextMenuCommand((builder) =>
        builder
          .setName('play')
          .setType(ApplicationCommandType.Message)
      );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guildId = interaction.guildId!;
    const guild = interaction.guild;
    const url = interaction.options.get('url')?.value?.toString() || '';

    const channel = guild?.members.cache.get(interaction.user.id)?.voice.channel;

    if (!channel) {
      return interaction.reply("tu precisa estar em um canal de voz, tio")
    }

    if (playing.get(guildId) || paused.get(guildId)) {
      if (queue.has(guildId)) {
        let musics = queue.get(guildId)!
        musics?.push(url)
        queue.set(guildId, musics)
      } else {
        queue.set(guildId, [url])
      }
      return interaction.reply("Adicionando música a lista")
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator
    })

    const source = await play.stream(url)

    const resource = createAudioResource(source.stream, {
      inputType: source.type
    })

    const player = createAudioPlayer()
    playing.set(guildId, player)
    queue.set(guildId, [url])
    counter.set(guildId, 0)
    interaction.reply("Vamo começar essa festa!")

    const sub = connection.subscribe(player)
    player.play(resource)
    player.on(AudioPlayerStatus.Idle, async () => {
      let position = counter.get(guildId)! + 1
      const nextSong = queue.get(guildId)![position]
      if (!nextSong) {
        interaction.channel?.send("bye")
        connection.destroy()
        queue.delete(guildId)
        playing.delete(guildId)
        paused.delete(guildId)
      } else {
        const nextSource = await play.stream(nextSong)
        const nextResource = createAudioResource(nextSource.stream, {
          inputType: source.type
        })
        player.play(nextResource)
        playing.set(guildId, player)
        play.video_info(nextSong).then(info => {
          interaction.channel?.send(`Tocando agora **${info.video_details.title}**`)
        })
        counter.set(guildId, position)
      }
    })
  }
}
