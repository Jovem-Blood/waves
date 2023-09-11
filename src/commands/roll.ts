import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, Message } from 'discord.js';

export class RollCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('roll').setDescription('roll a dice').addStringOption((opt) => opt.setName("dice").setDescription("o dado a ser jogado").setRequired(true))
    )
      .registerContextMenuCommand((builder) =>
      builder
        .setName('roll')
        .setType(ApplicationCommandType.Message)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guild = interaction.guild;
    const user = guild?.members.cache.get(interaction.user.id)
    const dice = interaction.options.get('dice')?.value?.toString() || '';
    const regexNumero: RegExp = /^\d+$/;
    const results: number[] = [];

    const [quantity, rest] = dice.split('d');
    let sides: string;
    let modifier: string | undefined;

    if (rest.includes('+')) {
    [sides, modifier] = rest.split('+');
    if(!regexNumero.test(`${modifier}`)){
        return interaction.reply("Tu digitou essa bagaça errada fio");
    };
    } else {
        sides = rest;
    };

    if(!regexNumero.test(`${quantity}`) || !regexNumero.test(`${sides}`)){
        return interaction.reply("Tu digitou essa bagaça errada fio");
    };

    for (let i = 0; i < Number(quantity); i++){
        if(!modifier){
            const randomNumber = (Math.floor(Math.random() * Number(sides)) + 1);
            results.push(randomNumber);
        } else {
            const randomNumber = (Math.floor(Math.random() * Number(sides)) + 1 + Number(modifier));
            results.push(randomNumber);
        };
    };
    const sum = results.reduce((sum, result) => sum + result, 0)
    interaction.reply(`O usuário ${user} lançou: ${dice} \n Resultados: ${results} \n Soma: ${sum}`);
  }
}