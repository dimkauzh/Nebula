import {
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
  type ChatInputCommandInteraction
} from "discord.js";
import { errorCheck, modEmbed } from "../../utils/embeds/modEmbed";

export default class Kick {
  data: SlashCommandSubcommandBuilder;
  constructor() {
    this.data = new SlashCommandSubcommandBuilder()
      .setName("kick")
      .setDescription("Kicks a user.")
      .addUserOption(user =>
        user.setName("user").setDescription("The user that you want to kick.").setRequired(true)
      )
      .addStringOption(string =>
        string.setName("reason").setDescription("The reason for the kick.")
      );
  }

  async run(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user")!;
    if (
      await errorCheck(
        PermissionsBitField.Flags.KickMembers,
        { interaction, user, action: "Kick" },
        { allErrors: true, botError: true, ownerError: true, outsideError: true },
        "Kick Members"
      )
    )
      return;

    const reason = interaction.options.getString("reason");
    await interaction.guild?.members.cache
      .get(user.id)
      ?.kick(reason ?? undefined)
      .catch(error => console.error(error));

    await modEmbed({ interaction, user, action: "Kicked", dm: true, dbAction: "KICK" }, reason);
  }
}
