const { EmbedBuilder, SlashCommandSubcommandBuilder } = require("discord.js");
const { getColor } = require("../../utils/misc");

module.exports = class Warn {
  constructor() {
    this.data = new SlashCommandSubcommandBuilder()
      .setName("warn")
      .setDescription("This command warns a person.")
      .addUserOption(user => user
        .setName("user")
        .setDescription("The user who is being warned.")
        .setRequired(true)
      )
      .addStringOption(string => string
        .setName("reason")
        .setDescription("Reason for the warn.")
        .setRequired(false)
      );
  }

  async run(interaction) {
    let errorEmbed = new EmbedBuilder().setColor(getColor(0));
    if (interaction.user.id !== OWNER && !ADMIN.includes(interaction.user.id)) {
      errorEmbed.setTitle("You don't have the permission to execute this command");
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const channel = interaction.client.channels.cache.get("979337971159420928");
    const member = interaction.member;
    const allMembers = await member.guild.members.fetch();
    const selectedMember = allMembers.filter(m => m.user.id === user.id).get(user.id);

    let embed = new EmbedBuilder()
      .setTitle(`Warned ${selectedMember.nickname == null ? user.username : selectedMember.nickname}`)
      .addFields({ name: "🔨 • Moderator", value: `${member.nickname == null ? member.user.username : member.nickname}` })
      .setFooter({ text: `User ID: ${user.id}` })
      .setColor(getColor(100));

    if (reason) embed.addFields({ name: "🖊️ • Reason", value: `${reason}` });

    if (selectedMember === member) {
      errorEmbed.setTitle("You can't warn yourself")
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    if (selectedMember.user.bot === true) {
      errorEmbed.setTitle("You can't warn a bot")
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    if (selectedMember.manageable === false) {
      errorEmbed.setTitle("Nebula doesn't have the permissions required")
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    interaction.editReply({ embeds: [embed] });
    channel.send({ embeds: [embed] });
  }
}
